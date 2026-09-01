package export_criomant_horizon_checksum

// Hash implements criomant:horizon/checksum.hash. componentize-go generates
// the canonical ABI bindings around this pure function before building.
func Hash(words []uint32) uint32 {
	const offsetBasis uint32 = 2166136261
	const prime uint32 = 16777619

	hash := offsetBasis
	for _, word := range words {
		for shift := uint(0); shift < 32; shift += 8 {
			hash ^= uint32(byte(word >> shift))
			hash *= prime
		}
	}
	return hash
}
