#![deny(unsafe_code)]

// Canonical ABI bindings necessarily contain generated pointer shims. The
// implementation below remains safe Rust; only wit-bindgen's generated module
// and export trampoline receive a scoped lint allowance.
#[allow(unsafe_code)]
mod bindings {
    wit_bindgen::generate!({
        path: "../wit",
        world: "rust-normalizer",
    });
}

use bindings::exports::criomant::horizon::normalize::{Guest, NormalizedSignal};

const NORMALIZED_MAX: i64 = 1_000_000;

struct RustNormalizer;

fn normalize_values(samples: &[i32], floor: i32, ceiling: i32) -> (Vec<u32>, u32) {
    let (lower, upper) = if floor <= ceiling {
        (floor, ceiling)
    } else {
        (ceiling, floor)
    };
    let span = i64::from(upper) - i64::from(lower);
    let mut clamped = 0_u32;
    let mut values = Vec::with_capacity(samples.len());

    for &sample in samples {
        let bounded = sample.clamp(lower, upper);
        clamped = clamped.saturating_add(u32::from(sample != bounded));

        let normalized = if span == 0 {
            0
        } else {
            ((i64::from(bounded) - i64::from(lower)) * NORMALIZED_MAX / span) as u32
        };
        values.push(normalized);
    }

    (values, clamped)
}

impl Guest for RustNormalizer {
    fn signal(samples: Vec<i32>, floor: i32, ceiling: i32) -> NormalizedSignal {
        let (values, clamped) = normalize_values(&samples, floor, ceiling);

        let checksum = bindings::criomant::horizon::checksum::hash(&values);
        NormalizedSignal {
            values,
            checksum,
            clamped,
        }
    }
}

#[allow(unsafe_code)]
mod component_export {
    use super::{RustNormalizer, bindings};

    bindings::export!(RustNormalizer with_types_in bindings);
}

#[cfg(test)]
mod tests {
    use super::normalize_values;

    #[test]
    fn normalizes_and_clamps_without_floating_point() {
        assert_eq!(
            normalize_values(&[-500, 0, 250, 750, 1_500], 0, 1_000),
            (vec![0, 0, 250_000, 750_000, 1_000_000], 2)
        );
    }

    #[test]
    fn reversed_bounds_have_the_same_result() {
        assert_eq!(
            normalize_values(&[-1, 5, 11], 0, 10),
            normalize_values(&[-1, 5, 11], 10, 0)
        );
    }

    #[test]
    fn handles_zero_span_and_full_i32_range() {
        assert_eq!(normalize_values(&[4, 5, 6], 5, 5), (vec![0, 0, 0], 2));
        assert_eq!(
            normalize_values(&[i32::MIN, 0, i32::MAX], i32::MIN, i32::MAX),
            (vec![0, 500_000, 1_000_000], 0)
        );
    }
}
