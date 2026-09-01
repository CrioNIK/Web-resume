#![forbid(unsafe_code)]

use wasm_bindgen::prelude::*;

const MAX_PARTICLES: u32 = 65_536;
const MAX_STEP_SECONDS: f64 = 0.05;
const MAX_PARTICLE_SPEED: f64 = 220.0;
const PARTICLE_STRIDE: u32 = 5;
const TIMELINE_STRIDE: u32 = 4;
const MAX_TIMELINE_LANES: u32 = 64;

#[wasm_bindgen(js_name = engineVersion)]
pub fn engine_version() -> String {
    env!("CARGO_PKG_VERSION").to_owned()
}

#[derive(Clone, Copy, Debug)]
struct Particle {
    x: f64,
    y: f64,
    vx: f64,
    vy: f64,
}

#[derive(Clone, Copy, Debug)]
struct XorShift32 {
    state: u32,
}

impl XorShift32 {
    fn new(seed: u32) -> Self {
        Self {
            state: if seed == 0 { 0x6d2b_79f5 } else { seed },
        }
    }

    fn next_u32(&mut self) -> u32 {
        let mut value = self.state;
        value ^= value << 13;
        value ^= value >> 17;
        value ^= value << 5;
        self.state = value;
        value
    }

    fn unit_f64(&mut self) -> f64 {
        (self.next_u32() as f64 + 0.5) / (u32::MAX as f64 + 1.0)
    }

    fn signed_f64(&mut self) -> f64 {
        self.unit_f64() * 2.0 - 1.0
    }
}

fn safe_extent(value: f64) -> f64 {
    if value.is_finite() && value > 0.0 {
        value
    } else {
        1.0
    }
}

fn make_particles(seed: u32, width: f64, height: f64, count: u32) -> Vec<Particle> {
    let mut rng = XorShift32::new(seed);
    let mut particles = Vec::with_capacity(count as usize);

    for _ in 0..count {
        particles.push(Particle {
            x: rng.unit_f64() * width,
            y: rng.unit_f64() * height,
            vx: rng.signed_f64() * 18.0,
            vy: rng.signed_f64() * 18.0,
        });
    }

    particles
}

fn mix_u32(mut value: u32) -> u32 {
    value ^= value >> 16;
    value = value.wrapping_mul(0x7feb_352d);
    value ^= value >> 15;
    value = value.wrapping_mul(0x846c_a68b);
    value ^ (value >> 16)
}

fn signed_hash(seed: u32, tick: u32, cell_x: i32, cell_y: i32, channel: u32) -> f64 {
    let value = seed
        ^ tick.wrapping_mul(0x9e37_79b9)
        ^ (cell_x as u32).wrapping_mul(0x85eb_ca6b)
        ^ (cell_y as u32).wrapping_mul(0xc2b2_ae35)
        ^ channel.wrapping_mul(0x27d4_eb2d);
    (mix_u32(value) as f64 / u32::MAX as f64) * 2.0 - 1.0
}

fn procedural_force(seed: u32, tick: u32, width: f64, height: f64, x: f64, y: f64) -> (f64, f64) {
    let centered_x = x / width - 0.5;
    let centered_y = y / height - 0.5;
    let cell_x = (x / 48.0).floor() as i32;
    let cell_y = (y / 48.0).floor() as i32;
    let noise_tick = tick / 4;

    let noise_x = signed_hash(seed, noise_tick, cell_x, cell_y, 0);
    let noise_y = signed_hash(seed, noise_tick, cell_x, cell_y, 1);

    (
        -centered_y * 24.0 + noise_x * 16.0,
        centered_x * 24.0 + noise_y * 16.0,
    )
}

/// Seeded particle simulation intended for browser-owned rendering.
#[wasm_bindgen]
pub struct ParticleField {
    seed: u32,
    width: f64,
    height: f64,
    tick: u32,
    particles: Vec<Particle>,
}

#[wasm_bindgen]
impl ParticleField {
    #[wasm_bindgen(constructor)]
    pub fn new(seed: u32, width: f64, height: f64, count: u32) -> ParticleField {
        let width = safe_extent(width);
        let height = safe_extent(height);
        let count = count.min(MAX_PARTICLES);

        ParticleField {
            seed,
            width,
            height,
            tick: 0,
            particles: make_particles(seed, width, height, count),
        }
    }

    /// Advances the field and returns the clamped duration that was applied.
    pub fn step(
        &mut self,
        delta_seconds: f64,
        attractor_x: f64,
        attractor_y: f64,
        attractor_strength: f64,
    ) -> f64 {
        let delta_seconds = if delta_seconds.is_finite() {
            delta_seconds.clamp(0.0, MAX_STEP_SECONDS)
        } else {
            0.0
        };

        if delta_seconds == 0.0 {
            return 0.0;
        }

        let has_attractor = attractor_x.is_finite()
            && attractor_y.is_finite()
            && attractor_strength.is_finite()
            && attractor_strength != 0.0;
        let strength = if has_attractor {
            attractor_strength.clamp(-100_000.0, 100_000.0)
        } else {
            0.0
        };

        let width = self.width;
        let height = self.height;
        let seed = self.seed;
        let tick = self.tick;
        let damping = 1.0 / (1.0 + 0.72 * delta_seconds);

        for particle in &mut self.particles {
            let (mut force_x, mut force_y) =
                procedural_force(seed, tick, width, height, particle.x, particle.y);

            if has_attractor {
                let dx = attractor_x - particle.x;
                let dy = attractor_y - particle.y;
                let softened_distance_sq = dx * dx + dy * dy + 144.0;
                force_x += dx * strength / softened_distance_sq;
                force_y += dy * strength / softened_distance_sq;
            }

            particle.vx = (particle.vx + force_x * delta_seconds) * damping;
            particle.vy = (particle.vy + force_y * delta_seconds) * damping;

            let speed_sq = particle.vx * particle.vx + particle.vy * particle.vy;
            if speed_sq > MAX_PARTICLE_SPEED * MAX_PARTICLE_SPEED {
                let scale = MAX_PARTICLE_SPEED / speed_sq.sqrt();
                particle.vx *= scale;
                particle.vy *= scale;
            }

            particle.x = (particle.x + particle.vx * delta_seconds).rem_euclid(width);
            particle.y = (particle.y + particle.vy * delta_seconds).rem_euclid(height);
        }

        self.tick = self.tick.wrapping_add(1);
        delta_seconds
    }

    /// Flat particle records: x, y, velocity x, velocity y, normalized speed.
    pub fn snapshot(&self) -> Vec<f32> {
        let mut result = Vec::with_capacity(self.particles.len() * PARTICLE_STRIDE as usize);
        for particle in &self.particles {
            let speed = (particle.vx * particle.vx + particle.vy * particle.vy).sqrt();
            result.extend_from_slice(&[
                particle.x as f32,
                particle.y as f32,
                particle.vx as f32,
                particle.vy as f32,
                (speed / MAX_PARTICLE_SPEED).clamp(0.0, 1.0) as f32,
            ]);
        }
        result
    }

    /// Compact x/y pairs for renderers that do not need velocity data.
    pub fn positions(&self) -> Vec<f32> {
        let mut result = Vec::with_capacity(self.particles.len() * 2);
        for particle in &self.particles {
            result.push(particle.x as f32);
            result.push(particle.y as f32);
        }
        result
    }

    /// Resizes the simulation while preserving normalized particle positions.
    pub fn resize(&mut self, width: f64, height: f64) {
        let width = safe_extent(width);
        let height = safe_extent(height);
        let scale_x = width / self.width;
        let scale_y = height / self.height;

        for particle in &mut self.particles {
            particle.x *= scale_x;
            particle.y *= scale_y;
            particle.vx *= scale_x;
            particle.vy *= scale_y;
        }

        self.width = width;
        self.height = height;
    }

    /// Reinitializes the current particle count with a new deterministic seed.
    pub fn reset(&mut self, seed: u32) {
        self.seed = seed;
        self.tick = 0;
        self.particles = make_particles(seed, self.width, self.height, self.particles.len() as u32);
    }

    pub fn count(&self) -> u32 {
        self.particles.len() as u32
    }

    pub fn stride(&self) -> u32 {
        PARTICLE_STRIDE
    }

    pub fn tick(&self) -> u32 {
        self.tick
    }

    #[wasm_bindgen(js_name = meanSpeed)]
    pub fn mean_speed(&self) -> f64 {
        if self.particles.is_empty() {
            return f64::NAN;
        }

        let total = self
            .particles
            .iter()
            .map(|particle| (particle.vx * particle.vx + particle.vy * particle.vy).sqrt())
            .sum::<f64>();
        total / self.particles.len() as f64
    }
}

fn kahan_sum(values: &[f64]) -> f64 {
    let mut sum = 0.0;
    let mut correction = 0.0;
    for &value in values {
        let adjusted = value - correction;
        let next = sum + adjusted;
        correction = (next - sum) - adjusted;
        sum = next;
    }
    sum
}

fn percentile(sorted: &[f64], quantile: f64) -> f64 {
    if sorted.is_empty() {
        return f64::NAN;
    }
    if sorted.len() == 1 {
        return sorted[0];
    }

    let position = quantile.clamp(0.0, 1.0) * (sorted.len() - 1) as f64;
    let lower = position.floor() as usize;
    let upper = position.ceil() as usize;
    let fraction = position - lower as f64;
    sorted[lower] + (sorted[upper] - sorted[lower]) * fraction
}

/// Summary of caller-provided latency measurements in milliseconds.
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct LatencyReport {
    sample_count: u32,
    rejected_count: u32,
    min_ms: f64,
    max_ms: f64,
    mean_ms: f64,
    p50_ms: f64,
    p95_ms: f64,
    p99_ms: f64,
    std_dev_ms: f64,
    jitter_ms: f64,
}

#[wasm_bindgen]
impl LatencyReport {
    pub fn measured(&self) -> bool {
        self.sample_count > 0
    }

    #[wasm_bindgen(js_name = sampleCount)]
    pub fn sample_count(&self) -> u32 {
        self.sample_count
    }

    #[wasm_bindgen(js_name = rejectedCount)]
    pub fn rejected_count(&self) -> u32 {
        self.rejected_count
    }

    #[wasm_bindgen(js_name = minMs)]
    pub fn min_ms(&self) -> f64 {
        self.min_ms
    }

    #[wasm_bindgen(js_name = maxMs)]
    pub fn max_ms(&self) -> f64 {
        self.max_ms
    }

    #[wasm_bindgen(js_name = meanMs)]
    pub fn mean_ms(&self) -> f64 {
        self.mean_ms
    }

    #[wasm_bindgen(js_name = p50Ms)]
    pub fn p50_ms(&self) -> f64 {
        self.p50_ms
    }

    #[wasm_bindgen(js_name = p95Ms)]
    pub fn p95_ms(&self) -> f64 {
        self.p95_ms
    }

    #[wasm_bindgen(js_name = p99Ms)]
    pub fn p99_ms(&self) -> f64 {
        self.p99_ms
    }

    #[wasm_bindgen(js_name = stdDevMs)]
    pub fn std_dev_ms(&self) -> f64 {
        self.std_dev_ms
    }

    #[wasm_bindgen(js_name = jitterMs)]
    pub fn jitter_ms(&self) -> f64 {
        self.jitter_ms
    }
}

#[wasm_bindgen(js_name = analyzeLatency)]
pub fn analyze_latency(samples_ms: Vec<f64>) -> LatencyReport {
    let input_count = samples_ms.len();
    let values = samples_ms
        .into_iter()
        .filter(|value| value.is_finite() && *value >= 0.0)
        .collect::<Vec<_>>();
    let rejected_count = input_count.saturating_sub(values.len()) as u32;

    if values.is_empty() {
        return LatencyReport {
            sample_count: 0,
            rejected_count,
            min_ms: f64::NAN,
            max_ms: f64::NAN,
            mean_ms: f64::NAN,
            p50_ms: f64::NAN,
            p95_ms: f64::NAN,
            p99_ms: f64::NAN,
            std_dev_ms: f64::NAN,
            jitter_ms: f64::NAN,
        };
    }

    let mean_ms = kahan_sum(&values) / values.len() as f64;
    let variance = values
        .iter()
        .map(|value| {
            let delta = value - mean_ms;
            delta * delta
        })
        .sum::<f64>()
        / values.len() as f64;
    let jitter_ms = if values.len() >= 2 {
        values
            .windows(2)
            .map(|pair| (pair[1] - pair[0]).abs())
            .sum::<f64>()
            / (values.len() - 1) as f64
    } else {
        f64::NAN
    };

    let mut sorted = values.clone();
    sorted.sort_by(f64::total_cmp);

    LatencyReport {
        sample_count: values.len() as u32,
        rejected_count,
        min_ms: sorted[0],
        max_ms: sorted[sorted.len() - 1],
        mean_ms,
        p50_ms: percentile(&sorted, 0.50),
        p95_ms: percentile(&sorted, 0.95),
        p99_ms: percentile(&sorted, 0.99),
        std_dev_ms: variance.sqrt(),
        jitter_ms,
    }
}

/// Summary of a scalar, evenly sampled signal.
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct SignalReport {
    sample_count: u32,
    rejected_count: u32,
    min: f64,
    max: f64,
    mean: f64,
    rms: f64,
    peak_to_peak: f64,
    std_dev: f64,
    trend_per_second: f64,
    duration_ms: f64,
    zero_crossings: u32,
}

#[wasm_bindgen]
impl SignalReport {
    pub fn valid(&self) -> bool {
        self.sample_count > 0
    }

    #[wasm_bindgen(js_name = sampleCount)]
    pub fn sample_count(&self) -> u32 {
        self.sample_count
    }

    #[wasm_bindgen(js_name = rejectedCount)]
    pub fn rejected_count(&self) -> u32 {
        self.rejected_count
    }

    pub fn min(&self) -> f64 {
        self.min
    }

    pub fn max(&self) -> f64 {
        self.max
    }

    pub fn mean(&self) -> f64 {
        self.mean
    }

    pub fn rms(&self) -> f64 {
        self.rms
    }

    #[wasm_bindgen(js_name = peakToPeak)]
    pub fn peak_to_peak(&self) -> f64 {
        self.peak_to_peak
    }

    #[wasm_bindgen(js_name = stdDev)]
    pub fn std_dev(&self) -> f64 {
        self.std_dev
    }

    #[wasm_bindgen(js_name = trendPerSecond)]
    pub fn trend_per_second(&self) -> f64 {
        self.trend_per_second
    }

    #[wasm_bindgen(js_name = durationMs)]
    pub fn duration_ms(&self) -> f64 {
        self.duration_ms
    }

    #[wasm_bindgen(js_name = zeroCrossings)]
    pub fn zero_crossings(&self) -> u32 {
        self.zero_crossings
    }
}

#[wasm_bindgen(js_name = analyzeSignal)]
pub fn analyze_signal(samples: Vec<f64>, sample_interval_ms: f64) -> SignalReport {
    let input_count = samples.len();
    let values = samples
        .into_iter()
        .filter(|value| value.is_finite())
        .collect::<Vec<_>>();
    let rejected_count = input_count.saturating_sub(values.len()) as u32;

    if values.is_empty() {
        return SignalReport {
            sample_count: 0,
            rejected_count,
            min: f64::NAN,
            max: f64::NAN,
            mean: f64::NAN,
            rms: f64::NAN,
            peak_to_peak: f64::NAN,
            std_dev: f64::NAN,
            trend_per_second: f64::NAN,
            duration_ms: f64::NAN,
            zero_crossings: 0,
        };
    }

    let sample_count = values.len();
    let mean = kahan_sum(&values) / sample_count as f64;
    let min = values.iter().copied().fold(f64::INFINITY, f64::min);
    let max = values.iter().copied().fold(f64::NEG_INFINITY, f64::max);
    let sum_of_squares = values.iter().map(|value| value * value).sum::<f64>();
    let variance = values
        .iter()
        .map(|value| {
            let delta = value - mean;
            delta * delta
        })
        .sum::<f64>()
        / sample_count as f64;
    let zero_crossings = values
        .windows(2)
        .filter(|pair| (pair[0] <= mean && pair[1] > mean) || (pair[0] >= mean && pair[1] < mean))
        .count() as u32;

    let has_timing = sample_interval_ms.is_finite() && sample_interval_ms > 0.0;
    let duration_ms = if has_timing {
        (sample_count.saturating_sub(1)) as f64 * sample_interval_ms
    } else {
        f64::NAN
    };
    let trend_per_second = if has_timing && sample_count >= 2 {
        let interval_seconds = sample_interval_ms / 1_000.0;
        let center = (sample_count - 1) as f64 / 2.0;
        let mut numerator = 0.0;
        let mut denominator = 0.0;

        for (index, value) in values.iter().enumerate() {
            let x = (index as f64 - center) * interval_seconds;
            numerator += x * (value - mean);
            denominator += x * x;
        }

        if denominator > 0.0 {
            numerator / denominator
        } else {
            f64::NAN
        }
    } else {
        f64::NAN
    };

    SignalReport {
        sample_count: sample_count as u32,
        rejected_count,
        min,
        max,
        mean,
        rms: (sum_of_squares / sample_count as f64).sqrt(),
        peak_to_peak: max - min,
        std_dev: variance.sqrt(),
        trend_per_second,
        duration_ms,
        zero_crossings,
    }
}

#[derive(Clone, Copy, Debug)]
struct TimelineEvent {
    original_index: usize,
    timestamp_ms: f64,
    importance: f64,
}

fn timeline_lane_hash(event: &TimelineEvent) -> u32 {
    let time_bits = event.timestamp_ms.to_bits();
    mix_u32(event.original_index as u32 ^ time_bits as u32 ^ (time_bits >> 32) as u32 ^ 0xa511_e9b3)
}

/// Chronologically ordered flat timeline node records.
#[wasm_bindgen]
#[derive(Clone, Debug)]
pub struct TimelineLayout {
    nodes: Vec<f64>,
    lane_count: u32,
    rejected_count: u32,
    start_ms: f64,
    end_ms: f64,
}

#[wasm_bindgen]
impl TimelineLayout {
    pub fn nodes(&self) -> Vec<f64> {
        self.nodes.clone()
    }

    pub fn stride(&self) -> u32 {
        TIMELINE_STRIDE
    }

    #[wasm_bindgen(js_name = eventCount)]
    pub fn event_count(&self) -> u32 {
        (self.nodes.len() / TIMELINE_STRIDE as usize) as u32
    }

    #[wasm_bindgen(js_name = laneCount)]
    pub fn lane_count(&self) -> u32 {
        self.lane_count
    }

    #[wasm_bindgen(js_name = rejectedCount)]
    pub fn rejected_count(&self) -> u32 {
        self.rejected_count
    }

    #[wasm_bindgen(js_name = startMs)]
    pub fn start_ms(&self) -> f64 {
        self.start_ms
    }

    #[wasm_bindgen(js_name = endMs)]
    pub fn end_ms(&self) -> f64 {
        self.end_ms
    }
}

/// Creates deterministic timeline records: original index, x pixels, lane, scale.
#[wasm_bindgen(js_name = layoutTimeline)]
pub fn layout_timeline(
    timestamps_ms: Vec<f64>,
    importance: Vec<f64>,
    width_px: f64,
    lane_count: u32,
    min_gap_px: f64,
) -> TimelineLayout {
    let input_count = timestamps_ms.len();
    let width_px = if width_px.is_finite() && width_px > 0.0 {
        width_px.min(1_000_000_000.0)
    } else {
        1.0
    };
    let lane_count = lane_count.clamp(1, MAX_TIMELINE_LANES);
    let min_gap_px = if min_gap_px.is_finite() && min_gap_px > 0.0 {
        min_gap_px.min(width_px)
    } else {
        0.0
    };

    let mut events = timestamps_ms
        .into_iter()
        .enumerate()
        .filter(|(_, timestamp_ms)| timestamp_ms.is_finite())
        .map(|(original_index, timestamp_ms)| TimelineEvent {
            original_index,
            timestamp_ms,
            importance: importance
                .get(original_index)
                .copied()
                .filter(|value| value.is_finite())
                .unwrap_or(1.0),
        })
        .collect::<Vec<_>>();

    let rejected_count = input_count.saturating_sub(events.len()) as u32;
    events.sort_by(|left, right| {
        left.timestamp_ms
            .total_cmp(&right.timestamp_ms)
            .then(left.original_index.cmp(&right.original_index))
    });

    if events.is_empty() {
        return TimelineLayout {
            nodes: Vec::new(),
            lane_count,
            rejected_count,
            start_ms: f64::NAN,
            end_ms: f64::NAN,
        };
    }

    let start_ms = events[0].timestamp_ms;
    let end_ms = events[events.len() - 1].timestamp_ms;
    let span_ms = end_ms - start_ms;
    let min_importance = events
        .iter()
        .map(|event| event.importance)
        .fold(f64::INFINITY, f64::min);
    let max_importance = events
        .iter()
        .map(|event| event.importance)
        .fold(f64::NEG_INFINITY, f64::max);
    let importance_span = max_importance - min_importance;

    let mut last_x = vec![f64::NEG_INFINITY; lane_count as usize];
    let mut last_scale = vec![1.0; lane_count as usize];
    let mut nodes = Vec::with_capacity(events.len() * TIMELINE_STRIDE as usize);

    for event in &events {
        let x = if span_ms > 0.0 {
            ((event.timestamp_ms - start_ms) / span_ms) * width_px
        } else {
            width_px * 0.5
        };
        let normalized_importance = if importance_span.is_finite() && importance_span > f64::EPSILON
        {
            ((event.importance - min_importance) / importance_span).clamp(0.0, 1.0)
        } else {
            0.5
        };
        let scale = 0.8 + normalized_importance.sqrt() * 0.6;
        let preferred_lane = timeline_lane_hash(event) % lane_count;

        let mut selected_lane = preferred_lane;
        let mut best_clearance = f64::NEG_INFINITY;

        for offset in 0..lane_count {
            let lane = (preferred_lane + offset) % lane_count;
            let lane_index = lane as usize;
            let required_gap = min_gap_px * (scale + last_scale[lane_index]) * 0.5;
            let clearance = x - last_x[lane_index] - required_gap;

            if clearance >= 0.0 {
                selected_lane = lane;
                break;
            }

            if clearance > best_clearance {
                best_clearance = clearance;
                selected_lane = lane;
            }
        }

        let lane_index = selected_lane as usize;
        last_x[lane_index] = x;
        last_scale[lane_index] = scale;

        nodes.extend_from_slice(&[event.original_index as f64, x, selected_lane as f64, scale]);
    }

    TimelineLayout {
        nodes,
        lane_count,
        rejected_count,
        start_ms,
        end_ms,
    }
}
