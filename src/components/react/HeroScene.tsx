import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Float, Html, Sparkles, useGLTF } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';

type ArtifactModel = {
	scene: THREE.Group;
};

function SceneLoader() {
	return (
		<Html center>
			<div className="hero-loader">Завантаження 3D сцени...</div>
		</Html>
	);
}

function EnergyRings() {
	const ringARef = useRef<THREE.Mesh>(null);
	const ringBRef = useRef<THREE.Mesh>(null);

	useFrame(({ clock }) => {
		const t = clock.getElapsedTime();

		if (ringARef.current) {
			ringARef.current.rotation.z = t * 0.4;
			ringARef.current.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.35) * 0.08;
		}

		if (ringBRef.current) {
			ringBRef.current.rotation.z = -t * 0.25;
			ringBRef.current.rotation.y = Math.sin(t * 0.25) * 0.5;
		}
	});

	return (
		<group>
			<mesh ref={ringARef}>
				<torusGeometry args={[1.45, 0.02, 18, 128]} />
				<meshStandardMaterial
					color="#ff5f73"
					emissive="#42111b"
					emissiveIntensity={1.9}
					metalness={0.9}
					roughness={0.24}
				/>
			</mesh>
			<mesh ref={ringBRef} rotation={[Math.PI / 2.8, 0.35, 0]}>
				<torusGeometry args={[1.85, 0.015, 16, 128]} />
				<meshStandardMaterial
					color="#ff7f90"
					emissive="#2f0d17"
					emissiveIntensity={1.35}
					metalness={0.85}
					roughness={0.3}
				/>
			</mesh>
		</group>
	);
}

function Artifact() {
	const artifactRef = useRef<THREE.Group>(null);
	const { scene } = useGLTF('/models/artifact.glb') as unknown as ArtifactModel;

	const enhancedModel = useMemo(() => {
		const cloned = scene.clone(true);

		cloned.traverse((node) => {
			if ((node as THREE.Mesh).isMesh) {
				const mesh = node as THREE.Mesh;
				const baseMaterial = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
				const nextMaterial = baseMaterial?.clone();

				if (nextMaterial && 'color' in nextMaterial) {
					nextMaterial.color = new THREE.Color('#f2d4c7');
				}

				if (nextMaterial && 'emissive' in nextMaterial) {
					nextMaterial.emissive = new THREE.Color('#24070f');
					nextMaterial.emissiveIntensity = 0.35;
				}

				if (nextMaterial && 'metalness' in nextMaterial) {
					nextMaterial.metalness = 0.08;
				}

				if (nextMaterial && 'roughness' in nextMaterial) {
					nextMaterial.roughness = 0.82;
				}

				mesh.material = nextMaterial ?? mesh.material;
				mesh.castShadow = true;
				mesh.receiveShadow = true;
			}
		});

		return cloned;
	}, [scene]);

	useFrame(({ clock, pointer }) => {
		if (!artifactRef.current) {
			return;
		}

		const t = clock.getElapsedTime();

		artifactRef.current.rotation.y = THREE.MathUtils.lerp(
			artifactRef.current.rotation.y,
			0.32 + pointer.x * 0.45 + Math.sin(t * 0.55) * 0.1,
			0.07
		);
		artifactRef.current.rotation.x = THREE.MathUtils.lerp(
			artifactRef.current.rotation.x,
			0.08 - pointer.y * 0.24 + Math.sin(t * 0.6) * 0.035,
			0.07
		);
	});

	return (
		<Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.6}>
			<group ref={artifactRef} position={[0, -1.08, 0]} scale={2.75}>
				<primitive object={enhancedModel} />
			</group>
		</Float>
	);
}

export default function HeroScene() {
	return (
		<div className="hero-canvas-shell" aria-hidden="true">
			<Canvas
				camera={{ position: [0, 0.12, 4.15], fov: 38 }}
				dpr={[1, 1.8]}
				gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
				shadows
			>
				<ambientLight intensity={0.38} />
				<directionalLight position={[2.8, 4.2, 2.8]} intensity={1.9} color="#ff6d80" castShadow />
				<pointLight position={[-2.4, 1.6, 2.6]} intensity={1.1} color="#4de6ff" />
				<pointLight position={[-3, -2, 2]} intensity={0.75} color="#ff344f" />
				<spotLight
					position={[0, 3.8, 3.2]}
					intensity={1.2}
					angle={0.42}
					penumbra={0.8}
					color="#ffd3bf"
				/>
				<Suspense fallback={<SceneLoader />}>
					<Artifact />
					<EnergyRings />
					<Sparkles count={75} size={2.5} scale={[4.6, 3.8, 1.5]} speed={0.35} color="#ff4f69" />
					<ContactShadows
						position={[0, -1.15, 0]}
						opacity={0.5}
						scale={5.5}
						blur={2.4}
						far={3}
						color="#4a0f18"
					/>
				</Suspense>
			</Canvas>
		</div>
	);
}

useGLTF.preload('/models/artifact.glb');
