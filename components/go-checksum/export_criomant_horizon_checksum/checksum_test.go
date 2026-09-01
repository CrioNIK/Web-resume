package export_criomant_horizon_checksum

import "testing"

func TestHashIsDeterministicAndOrderSensitive(t *testing.T) {
	left := Hash([]uint32{0, 250_000, 750_000, 1_000_000})
	right := Hash([]uint32{0, 250_000, 750_000, 1_000_000})
	reordered := Hash([]uint32{1_000_000, 750_000, 250_000, 0})

	if left != right {
		t.Fatalf("same input produced %08x and %08x", left, right)
	}
	if left == reordered {
		t.Fatalf("reordered input unexpectedly produced %08x", left)
	}
}

func TestHashEmptyInputUsesFnvOffsetBasis(t *testing.T) {
	const offsetBasis uint32 = 2166136261
	if got := Hash(nil); got != offsetBasis {
		t.Fatalf("Hash(nil) = %08x; want %08x", got, offsetBasis)
	}
}
