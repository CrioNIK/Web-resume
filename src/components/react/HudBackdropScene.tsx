import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, useGLTF } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

type ArtifactModel = {
	scene: THREE.Group;
};

function EnergyField() {
	const ringA = useRef<THREE.Mesh>(null);
	const ringB = useRef<THREE.Mesh>(null);
	const halo = useRef<THREE.Mesh>(null);

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();

		if (ringA.current) {
			ringA.current.rotation.z = t * 0.18;
			ringA.current.rotation.x = Math.PI / 2 + Math.sin(t * 0.2) * 0.08;
		}

		if (ringB.current) {
			ringB.current.rotation.z = -t * 0.11;
			ringB.current.rotation.y = Math.sin(t * 0.15) * 0.35;
		}

		if (halo.current) {
			halo.current.scale.setScalar(1 + Math.sin(t * 0.6) * 0.03);
		}
	});

	return (
		<group>
			<mesh ref={ringA} rotation={[Math.PI / 2.1, 0, 0]}>
				<torusGeometry args={[3.5, 0.03, 18, 180]} />
				<meshBasicMaterial color="#ff425d" transparent opacity={0.42} />
			</mesh>
			<mesh ref={ringB} rotation={[Math.PI / 2.6, 0.25, 0]}>
				<torusGeometry args={[4.4, 0.02, 16, 180]} />
				<meshBasicMaterial color="#4de6ff" transparent opacity={0.18} />
			</mesh>
			<mesh ref={halo} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.85, 0]}>
				<circleGeometry args={[4.8, 64]} />
				<meshBasicMaterial color="#ff2947" transparent opacity={0.09} />
			</mesh>
		</group>
	);
}

function SkullArtifact() {
	const artifactRef = useRef<THREE.Group>(null);
	const { scene } = useGLTF('/models/artifact.glb') as unknown as ArtifactModel;

	const model = useMemo(() => {
		const clone = scene.clone(true);

		clone.traverse((node) => {
			if ((node as THREE.Mesh).isMesh) {
				const mesh = node as THREE.Mesh;
				const baseMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
				const material = baseMaterial?.clone();

				if (material && 'color' in material) {
					material.color = new THREE.Color('#f0d2ca');
				}

				if (material && 'emissive' in material) {
					material.emissive = new THREE.Color('#3b0711');
					material.emissiveIntensity = 0.22;
				}

				if (material && 'roughness' in material) {
					material.roughness = 0.9;
				}

				mesh.material = material ?? mesh.material;
			}
		});

		return clone;
	}, [scene]);

	useFrame(({ clock, pointer }) => {
		if (!artifactRef.current) {
			return;
		}

		const t = clock.getElapsedTime();
		artifactRef.current.rotation.y = THREE.MathUtils.lerp(
			artifactRef.current.rotation.y,
			pointer.x * 0.28 + Math.sin(t * 0.16) * 0.16,
			0.04
		);
		artifactRef.current.rotation.x = THREE.MathUtils.lerp(
			artifactRef.current.rotation.x,
			-0.18 + pointer.y * -0.14 + Math.sin(t * 0.18) * 0.04,
			0.04
		);
	});

	return (
		<Float speed={1} rotationIntensity={0.15} floatIntensity={0.35}>
			<group ref={artifactRef} position={[0, -0.7, -0.2]} scale={4.8}>
				<primitive object={model} />
			</group>
		</Float>
	);
}

export default function HudBackdropScene() {
	return (
		<div className="hud-backdrop" aria-hidden="true">
			<Canvas camera={{ position: [0, 0, 11], fov: 28 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
				<ambientLight intensity={0.34} />
				<directionalLight position={[2.8, 4.2, 4.2]} intensity={1.25} color="#ff6479" />
				<pointLight position={[-4, 1, 4]} intensity={0.55} color="#4de6ff" />
				<pointLight position={[0, -4, 2]} intensity={0.45} color="#ff2947" />
				<Suspense fallback={null}>
					<SkullArtifact />
					<EnergyField />
					<Sparkles count={55} size={3.8} speed={0.25} scale={[17, 10, 8]} color="#ff4962" />
				</Suspense>
			</Canvas>
		</div>
	);
}

useGLTF.preload('/models/artifact.glb');
