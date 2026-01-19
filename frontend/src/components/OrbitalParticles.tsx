import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  orbitRadius: number;
  startAngle: number;
}

const OrbitalParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate orbital particles
    const newParticles: Particle[] = [];
    
    // Inner orbit particles
    for (let i = 0; i < 8; i++) {
      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.6 + 0.3,
        duration: Math.random() * 8 + 12,
        delay: Math.random() * -20,
        orbitRadius: 180 + Math.random() * 40,
        startAngle: (i / 8) * 360,
      });
    }

    // Outer orbit particles
    for (let i = 8; i < 14; i++) {
      newParticles.push({
        id: i,
        x: 0,
        y: 0,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.4 + 0.2,
        duration: Math.random() * 12 + 18,
        delay: Math.random() * -25,
        orbitRadius: 260 + Math.random() * 60,
        startAngle: ((i - 8) / 6) * 360,
      });
    }

    // Floating particles (non-orbital)
    for (let i = 14; i < 22; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 400 - 200,
        y: Math.random() * 300 - 150,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        duration: Math.random() * 6 + 4,
        delay: Math.random() * -10,
        orbitRadius: 0,
        startAngle: 0,
      });
    }

    setParticles(newParticles);
  }, []);

  return (
    <div className="hidden lg:block absolute right-[10%] bottom-[25%] w-[360px] h-[240px] pointer-events-none">
      {/* Center reference point */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={particle.orbitRadius > 0 ? "animate-orbit" : "animate-float-particle"}
            style={{
              position: "absolute",
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              borderRadius: "50%",
              background: particle.id < 8 
                ? `radial-gradient(circle, hsl(24 100% 60%), hsl(24 100% 40%))`
                : `radial-gradient(circle, hsl(190 90% 70%), hsl(190 90% 50%))`,
              boxShadow: particle.id < 8
                ? `0 0 ${particle.size * 2}px hsl(24 100% 60% / 0.6)`
                : `0 0 ${particle.size * 2}px hsl(190 90% 60% / 0.5)`,
              opacity: particle.opacity,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              ...(particle.orbitRadius > 0
                ? {
                    transform: `rotate(${particle.startAngle}deg) translateX(${particle.orbitRadius}px)`,
                    transformOrigin: "center center",
                  }
                : {
                    left: `${particle.x}px`,
                    top: `${particle.y}px`,
                  }),
            }}
          />
        ))}

        {/* Orbital ring hints */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
          style={{ width: "380px", height: "380px" }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/5"
          style={{ width: "560px", height: "560px" }}
        />
      </div>
    </div>
  );
};

export default OrbitalParticles;
