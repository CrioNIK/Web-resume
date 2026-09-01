use horizon_engine::{ParticleField, analyze_latency, analyze_signal, layout_timeline};

fn assert_close(actual: f64, expected: f64, tolerance: f64) {
    assert!(
        (actual - expected).abs() <= tolerance,
        "expected {expected}, got {actual}"
    );
}

#[test]
fn particle_field_is_deterministic_and_bounded() {
    let mut left = ParticleField::new(0x51a7e, 640.0, 360.0, 256);
    let mut right = ParticleField::new(0x51a7e, 640.0, 360.0, 256);

    for index in 0..180 {
        let attractor_x = 120.0 + (index % 7) as f64 * 52.0;
        let attractor_y = 90.0 + (index % 5) as f64 * 31.0;
        assert_eq!(
            left.step(1.0 / 60.0, attractor_x, attractor_y, 850.0),
            right.step(1.0 / 60.0, attractor_x, attractor_y, 850.0)
        );
    }

    let left_snapshot = left.snapshot();
    assert_eq!(left_snapshot, right.snapshot());
    assert_eq!(left.count(), 256);
    assert_eq!(left.stride(), 5);
    assert_eq!(left.tick(), 180);

    for record in left_snapshot.as_chunks::<5>().0 {
        assert!(record.iter().all(|value| value.is_finite()));
        assert!((0.0..640.0).contains(&record[0]));
        assert!((0.0..360.0).contains(&record[1]));
        assert!((0.0..=1.0).contains(&record[4]));
    }

    let different_seed = ParticleField::new(0x51a7f, 640.0, 360.0, 256);
    assert_ne!(left_snapshot, different_seed.snapshot());
}

#[test]
fn particle_field_reports_the_applied_step_and_can_reset() {
    let mut field = ParticleField::new(42, 100.0, 80.0, 8);
    let initial = field.snapshot();

    assert_eq!(field.step(1.0, 50.0, 40.0, 0.0), 0.05);
    assert_eq!(field.step(f64::NAN, 50.0, 40.0, 0.0), 0.0);
    field.reset(42);

    assert_eq!(field.tick(), 0);
    assert_eq!(field.snapshot(), initial);
}

#[test]
fn latency_report_uses_only_real_valid_samples() {
    let report = analyze_latency(vec![10.0, 20.0, f64::NAN, -1.0, 30.0, 40.0, 50.0]);

    assert!(report.measured());
    assert_eq!(report.sample_count(), 5);
    assert_eq!(report.rejected_count(), 2);
    assert_eq!(report.min_ms(), 10.0);
    assert_eq!(report.max_ms(), 50.0);
    assert_eq!(report.mean_ms(), 30.0);
    assert_eq!(report.p50_ms(), 30.0);
    assert_close(report.p95_ms(), 48.0, 1e-12);
    assert_close(report.p99_ms(), 49.6, 1e-12);
    assert_close(report.std_dev_ms(), 200.0_f64.sqrt(), 1e-12);
    assert_eq!(report.jitter_ms(), 10.0);
}

#[test]
fn empty_latency_is_unmeasured_instead_of_fake_zero() {
    let report = analyze_latency(vec![f64::NAN, -5.0]);

    assert!(!report.measured());
    assert_eq!(report.sample_count(), 0);
    assert_eq!(report.rejected_count(), 2);
    assert!(report.mean_ms().is_nan());
    assert!(report.p95_ms().is_nan());
    assert!(report.jitter_ms().is_nan());
}

#[test]
fn signal_report_tracks_energy_spread_and_trend() {
    let report = analyze_signal(vec![1.0, 2.0, 3.0, 4.0, 5.0, f64::NAN], 1_000.0);

    assert!(report.valid());
    assert_eq!(report.sample_count(), 5);
    assert_eq!(report.rejected_count(), 1);
    assert_eq!(report.min(), 1.0);
    assert_eq!(report.max(), 5.0);
    assert_eq!(report.mean(), 3.0);
    assert_close(report.rms(), 11.0_f64.sqrt(), 1e-12);
    assert_eq!(report.peak_to_peak(), 4.0);
    assert_close(report.std_dev(), 2.0_f64.sqrt(), 1e-12);
    assert_close(report.trend_per_second(), 1.0, 1e-12);
    assert_eq!(report.duration_ms(), 4_000.0);
    assert_eq!(report.zero_crossings(), 1);

    let untimed = analyze_signal(vec![1.0, 2.0], 0.0);
    assert!(untimed.trend_per_second().is_nan());
    assert!(untimed.duration_ms().is_nan());
}

#[test]
fn timeline_layout_is_stable_and_preserves_source_indices() {
    let timestamps = vec![300.0, 100.0, 200.0, 200.0, f64::NAN];
    let importance = vec![1.0, 5.0, 2.0, 3.0, 4.0];
    let first = layout_timeline(timestamps.clone(), importance.clone(), 1_000.0, 2, 80.0);
    let second = layout_timeline(timestamps, importance, 1_000.0, 2, 80.0);

    assert_eq!(first.nodes(), second.nodes());
    assert_eq!(first.event_count(), 4);
    assert_eq!(first.rejected_count(), 1);
    assert_eq!(first.lane_count(), 2);
    assert_eq!(first.stride(), 4);
    assert_eq!(first.start_ms(), 100.0);
    assert_eq!(first.end_ms(), 300.0);

    let nodes = first.nodes();
    assert_eq!(nodes.len(), 16);
    assert_eq!(
        [nodes[0], nodes[4], nodes[8], nodes[12]],
        [1.0, 2.0, 3.0, 0.0]
    );
    assert_eq!(
        [nodes[1], nodes[5], nodes[9], nodes[13]],
        [0.0, 500.0, 500.0, 1_000.0]
    );
    assert_ne!(nodes[6], nodes[10]);
}
