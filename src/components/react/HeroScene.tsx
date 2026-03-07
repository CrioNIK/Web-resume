import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Sparkles, useGLTF } from '@react-three/drei';
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
				mesh.material = new THREE.MeshStandardMaterial({
					color: '#ff8f9f',
					emissive: '#330a13',
					emissiveIntensity: 1.2,
					metalness: 0.65,
					roughness: 0.24
				});
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
			pointer.x * 0.6 + t * 0.3,
			0.07
		);
		artifactRef.current.rotation.x = THREE.MathUtils.lerp(
			artifactRef.current.rotation.x,
			-pointer.y * 0.35 + Math.sin(t * 0.6) * 0.05,
			0.07
		);
	});

	return (
		<Float speed={1.3} rotationIntensity={0.4} floatIntensity={0.6}>
			<group ref={artifactRef} scale={1.3}>
				<primitive object={enhancedModel} />
			</group>
		</Float>
	);
}

export default function HeroScene() {
	return (
		<div className="hero-canvas-shell" aria-hidden="true">
			<Canvas
				camera={{ position: [0, 0, 4.6], fov: 42 }}
				dpr={[1, 1.8]}
				gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
			>
				<ambientLight intensity={0.5} />
				<directionalLight position={[3, 4, 3]} intensity={1.5} color="#ff5f75" />
				<pointLight position={[-3, -2, 2]} intensity={0.9} color="#ff344f" />
				<Suspense fallback={<SceneLoader />}>
					<Artifact />
					<EnergyRings />
					<Sparkles count={75} size={2.5} scale={[4.6, 3.8, 1.5]} speed={0.35} color="#ff4f69" />
				</Suspense>
			</Canvas>
		</div>
	);
}

useGLTF.preload('/models/artifact.glb');
