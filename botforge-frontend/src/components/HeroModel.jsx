import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage, PresentationControls } from '@react-three/drei';

function Model(props) {
  // Yahan apne model ka path dein jo public folder mein hai
  const { scene } = useGLTF('/robot.glb'); 
  return <primitive object={scene} scale={0.01} {...props} />;
}

export default function HeroModel() {
  return (
    <div className="h-[300px] w-full cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }} style={{ "position": "relative" }}>
        <color attach="background" args={['#030712']} /> {/* Matching bg-gray-950 */}
        <Suspense fallback={null}>
          <PresentationControls speed={1.5} global zoom={0.5} polar={[-0.1, Math.PI / 4]}>
            <Stage environment="city">
              <Model scale={0.01} />
            </Stage>
          </PresentationControls>
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate />
      </Canvas>
    </div>
  );
}