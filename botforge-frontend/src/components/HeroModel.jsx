import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, ContactShadows } from '@react-three/drei';

function Model(props) {
  const { scene } = useGLTF('/robot.glb');
  // Model ko neeche shift karein taake poora dikhe
  return <primitive object={scene} scale={0.6} position={[0, -1.2, 0]} {...props} />;
}

export default function HeroModel() {
  return (
    <div className="h-[350px] w-full cursor-grab active:cursor-grabbing">
      <Canvas 
        dpr={[1, 2]} 
        shadows 
        camera={{ 
          fov: 45,
          position: [0, 0, 6], // Camera door se taake poora model aa sake
          near: 0.1,
          far: 100
        }}
        style={{ position: 'relative' }}
      >
        {/* Transparent background taake parent ka bg-gray-950 dikhe */}
        <color attach="background" args={['#030712']} />
        
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <spotLight 
          intensity={1} 
          angle={0.5} 
          penumbra={1} 
          position={[5, 10, 5]} 
          castShadow 
        />
        <directionalLight intensity={0.8} position={[-5, 5, 5]} />
        
        <Suspense fallback={null}>
          <Model />
          
          {/* Floor shadow taake model grounded lage */}
          <ContactShadows 
            position={[0, -1.8, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
          />
          
          {/* Environment reflection */}
          <Environment preset="city" />
        </Suspense>
        
        {/* OrbitControls - mouse se drag kar sakte hain */}
        <OrbitControls 
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={2}
          minPolarAngle={Math.PI / 3}    // Neeche se dekhne ka limit
          maxPolarAngle={Math.PI / 1.8}  // Upar se dekhne ka limit
          minAzimuthAngle={-Infinity}    // Full horizontal rotation
          maxAzimuthAngle={Infinity}
        />
      </Canvas>
    </div>
  );
}