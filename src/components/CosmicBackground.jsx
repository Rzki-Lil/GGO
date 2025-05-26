import React from "react";
import bg from "../assets/bg.gif";

const CosmicBackground = React.memo(() => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <img
        src={bg}
        alt="Cosmic Background"
        className="object-cover w-full h-full opacity-30" 
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          willChange: "transform",
          transform: "translate3d(0, 0, 0)", 
        }}
        loading="lazy" 
        decoding="async" 
      />
    </div>
  );
});

CosmicBackground.displayName = "CosmicBackground";
export default CosmicBackground;
