import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Plane, Box, Sphere, Cloud } from '@react-three/drei';

// ১. ঘুরতে থাকা ক্লাউড অ্যানিমেশন (Clouds)
function AnimatedCloud({ position, speed }) {
  const ref = useRef();
  useFrame(() => {
    ref.current.position.x += speed;
    if (ref.current.position.x > 15) ref.current.position.x = -15;
    if (ref.current.position.x < -15) ref.current.position.x = 15;
  });
  return <Cloud ref={ref} position={position} opacity={0.3} speed={0.2} width={2} depth={1} segments={20} />;
}

// ২. সূর্য (Sun)
function Sun() {
  return (
    <Sphere args={[0.8, 16, 16]} position={[5, 8, -5]}>
      <meshStandardMaterial color="#ffdd00" emissive="#ffa500" emissiveIntensity={2} />
    </Sphere>
  );
}

// ৩. ক্লাউড কালার লজিক (রেইনি হলে কালো)
function CloudLayer({ weather }) {
  const isRainy = weather?.toLowerCase().includes('rain') || weather?.toLowerCase().includes('thunderstorm') || weather?.toLowerCase().includes('showers');
  
  return (
    <>
      {/* মেঘের সংখ্যা ৩ থেকে কমিয়ে ২ করা হয়েছে, এবং opacity 0.6 থেকে 0.3 করা হয়েছে */}
      <AnimatedCloud position={[-6, 2.5, 0]} speed={0.008} />
      <AnimatedCloud position={[6, 2.5, -2]} speed={-0.01} />
      
      {/* বৃষ্টি হলে অতিরিক্ত কালো মেঘ (আকার ছোট করা হয়েছে) */}
      {isRainy && (
        <AnimatedCloud position={[-2, 3, -3]} speed={0.004} /> 
      )}
    </>
  );
}

// ৪. বৃষ্টির ফোঁটা (Rain Drop System)
function Rain() {
  const rainRef = useRef();
  useEffect(() => {
    const interval = setInterval(() => {
      if (rainRef.current) {
        rainRef.current.position.y -= 0.1;
        if (rainRef.current.position.y < -1) rainRef.current.position.y = 3;
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <Box ref={rainRef} args={[0.02, 0.2, 0.02]} position={[Math.random()*10 - 5, 3, Math.random()*10 - 5]}>
      <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
    </Box>
  );
}

function RainSystem() {
  return (
    <>
      {Array.from({ length: 70 }).map((_, i) => (<Rain key={i} />))}
    </>
  );
}

// ৫. প্রধান গ্রামের দৃশ্য
const VillageScene = ({ weather, waterLevel }) => {
  const isRainy = weather?.toLowerCase().includes('rain') || weather?.toLowerCase().includes('thunderstorm');
  const isSunny = !isRainy && !weather?.toLowerCase().includes('cloudy');
  const isFlood = waterLevel > 5.5; // যদি পানি ৫.৫ ফুটের বেশি হয়, তবে বন্যা
  const isDrought = weather?.toLowerCase().includes('drought'); // খরা শনাক্ত করা

  return (
    <div style={{ width: '100%', height: '100%', background: isRainy ? '#4a5568' : (isSunny ? '#87CEEB' : '#a0c4ff') }}>
      <Canvas camera={{ position: [0, 6, 12], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={isSunny ? 1.5 : 0.5} />
        
        {/* সূর্য (যদি রোদ থাকে) */}
        {isSunny && <Sun />}

        {/* মেঘ (এবং কালো মেঘ) */}
        <CloudLayer weather={weather} />

        {/* গ্রাউন্ড (সবুজ মাটি) - খরা হলে বাদামি, বন্যা হলে নীল */}
        <Plane args={[12, 12]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <meshStandardMaterial color={isFlood ? "#1a535c" : (isDrought ? "#a0522d" : "#2d6a4f")} />
        </Plane>

        {/* নদী/জলাশয় */}
        <Plane args={[4, 1.5]} rotation={[-Math.PI / 2, 0, 0]} position={[2, -0.4, 0]}>
          <meshStandardMaterial color="#0077b6" transparent opacity={isFlood ? 0.9 : 0.8} />
        </Plane>

        {/* বাড়ি-ঘর */}
        <Box args={[1, 0.8, 1]} position={[-2, 0, 0]}><meshStandardMaterial color="#f8edeb" /></Box>
        <Box args={[1.2, 0.5, 1]} position={[-1.8, 0.25, 0]}><meshStandardMaterial color="#c1121f" /></Box>

        <Box args={[1, 0.8, 1]} position={[1, 0, 1]}><meshStandardMaterial color="#f8edeb" /></Box>
        <Box args={[1.2, 0.5, 1]} position={[1.2, 0.25, 1]}><meshStandardMaterial color="#c1121f" /></Box>

        <Box args={[1, 0.8, 1]} position={[-1, 0, -1.5]}><meshStandardMaterial color="#f8edeb" /></Box>
        <Box args={[1.2, 0.5, 1]} position={[-0.8, 0.25, -1.5]}><meshStandardMaterial color="#c1121f" /></Box>

        {/* গাছ */}
        <Sphere args={[0.4, 8]} position={[-3, 0.2, 1]}><meshStandardMaterial color="#2d6a4f" /></Sphere>
        <Box args={[0.1, 0.5, 0.1]} position={[-3, -0.2, 1]}><meshStandardMaterial color="#78350f" /></Box>
        <Sphere args={[0.4, 8]} position={[2.5, 0.2, -1]}><meshStandardMaterial color="#2d6a4f" /></Sphere>
        <Box args={[0.1, 0.6, 0.1]} position={[2.5, -0.2, -1]}><meshStandardMaterial color="#78350f" /></Box>

        {/* বৃষ্টি (যদি Rain হয়) */}
        {isRainy && <RainSystem />}

        {/* বন্যা হলে পানির স্তর বাড়ানো (নদী ও মাটিতে পানি দেখা) */}
        {isFlood && (
          <Plane args={[8, 8]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
            <meshStandardMaterial color="#0077b6" transparent opacity={0.3} />
          </Plane>
        )}

        <OrbitControls />
      </Canvas>
    </div>
  );
};

export default VillageScene;