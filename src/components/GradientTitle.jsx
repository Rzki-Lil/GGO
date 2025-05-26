import React, { useMemo } from "react";

const GradientTitle = React.memo(() => {
  const titleStyle = useMemo(
    () => ({
      backgroundImage: `linear-gradient(135deg,
        #f97316 0%,
        #ea580c 30%,
        #c2410c 50%,
        #a200ff 70%,
        #9a3412 100%
      )`,
      backgroundSize: "200% 200%",
      textShadow: "0 0 10px rgba(249, 115, 22, 0.15)",
      willChange: "background-position",
      transform: "translate3d(0,0,0)",
    }),
    []
  );

  return (
    <div className="relative mt-8 mb-8 text-center select-none">
      <h1 className="font-bold tracking-tight text-7xl font-pixel">
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
