import React from "react";

const GradientTitle = React.memo(() => {
  return (
    <div className="relative mt-8 mb-8 text-center select-none">
      <h1 className="font-bold tracking-tight text-8xl font-pixel">
        <span
          className="relative inline-block text-transparent animate-gradient-slow bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(135deg, 
              #4f46e5 0%,
              #7c3aed 20%,
              #2563eb 40%,
              #ec4899 60%,
              #8b5cf6 80%,
              #4f46e5 100%
            )`,
            backgroundSize: "200% 200%",
            textShadow: "0 0 30px rgba(139, 92, 246, 0.3)",
          }}
        >
          MCGAGO ROUND PREDICT
        </span>
      </h1>
    </div>
  );
});

GradientTitle.displayName = "GradientTitle";
export default GradientTitle;
