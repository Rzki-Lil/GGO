import React from "react";

const CosmicBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-indigo-900/50 via-purple-900/30 to-black"></div>

      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-full animate-float-slow bg-gradient-radial from-purple-500/20 via-fuchsia-500/10 to-transparent"></div>
        <div className="absolute w-full h-full animate-float-medium bg-gradient-radial from-blue-500/20 via-indigo-500/10 to-transparent"></div>
      </div>

      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute animate-star-pulse"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: `rgba(255, 255, 255, ${
                Math.random() * 0.7 + 0.3
              })`,
              borderRadius: "50%",
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`meteor-${i}`}
          className="absolute animate-meteor"
          style={{
            top: `${Math.random() * 50}%`,
            right: `${Math.random() * 70}%`,
            width: "2.5px",
            height: "2.5px",
            background: "white",
            boxShadow: "0 0 20px 2px white",
            animationDelay: `${i * 4}s`,
            transform: "rotate(-45deg)",
          }}
        />
      ))}
    </div>
  );
});

CosmicBackground.displayName = "CosmicBackground";
export default CosmicBackground;
