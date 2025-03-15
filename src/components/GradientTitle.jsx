import React, { useMemo } from "react";

const GradientTitle = React.memo(() => {
  const titleStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(135deg, 
      #4f46e5 0%,
      #7c3aed 25%,
      #2563eb 50%,
      #8b5cf6 75%,
      #4f46e5 100%
    )`,
      backgroundSize: "200% 200%",
      textShadow: "0 0 20px rgba(139, 92, 246, 0.2)",
    }),
    []
  );

  return (
    <div className="relative mt-8 mb-8 text-center select-none">
      <h1 className="font-bold tracking-tight text-8xl font-pixel">
        <span
          className="relative inline-block text-transparent animate-gradient-slow bg-clip-text"
          style={titleStyle}
        >
          MCGAGO ROUND PREDICT
        </span>
      </h1>
    </div>
  );
});

GradientTitle.displayName = "GradientTitle";
export default GradientTitle;
