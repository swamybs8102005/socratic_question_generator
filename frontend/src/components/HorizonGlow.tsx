import React from "react";

const HorizonGlow: React.FC = () => {
  return (
    <>
      <style>{`
        .horizon-glow {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 80vw;
          height: 200px;
          pointer-events: none;
        }

        @media (min-width: 1024px) {
          .horizon-glow {
            left: 80%;
            width: 65vw;
          }
        }

        .horizon-curve {
          position: absolute;
          inset: 0;
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          overflow: hidden;
        }

        .horizon-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            transparent,
            hsl(210, 70%, 80%),
            hsl(200, 90%, 85%),
            hsl(210, 70%, 80%),
            transparent
          );
          box-shadow: 0 0 20px 8px hsl(200 80% 70% / 0.4);
          border-radius: 50% 50% 0 0 / 100% 100% 0 0;
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>

      <div className="horizon-glow">
        <div className="horizon-curve">
          <div className="horizon-line" />
        </div>
      </div>
    </>
  );
};

export default HorizonGlow;
