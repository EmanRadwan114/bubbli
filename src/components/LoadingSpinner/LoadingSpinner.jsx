import React from "react";
import styled from "styled-components";

const LoadingSpinner = () => {
  return (
    <div className="relative bg-zinc-900/30">
      <StyledWrapper>
        <div className="spinner-container">
          <svg
            height="108px"
            width="108px"
            viewBox="0 0 128 128"
            className="loader"
          >
            <defs>
              <clipPath id="loader-eyes">
                <circle
                  transform="rotate(-40,64,64) translate(0,-56)"
                  r={8}
                  cy={64}
                  cx={64}
                  className="loader__eye1"
                />
                <circle
                  transform="rotate(40,64,64) translate(0,-56)"
                  r={8}
                  cy={64}
                  cx={64}
                  className="loader__eye2"
                />
              </clipPath>
              <linearGradient y2={1} x2={0} y1={0} x1={0} id="loader-grad">
                <stop stopColor="#000" offset="0%" />
                <stop stopColor="#fff" offset="100%" />
              </linearGradient>
              <linearGradient
                id="custom-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#c74029" />
                <stop offset="50%" stopColor="#c71000" />
                <stop offset="100%" stopColor="#c70029" />
              </linearGradient>
              <mask id="loader-mask">
                <rect
                  fill="url(#loader-grad)"
                  height={128}
                  width={128}
                  y={0}
                  x={0}
                />
              </mask>
            </defs>
            <g
              strokeDasharray="175.93 351.86"
              strokeWidth={12}
              strokeLinecap="round"
            >
              <g>
                <rect
                  clipPath="url(#loader-eyes)"
                  height={64}
                  width={128}
                  fill="url(#custom-gradient)"
                />
                <g stroke="url(#custom-gradient)" fill="none">
                  <circle
                    transform="rotate(180,64,64)"
                    r={56}
                    cy={64}
                    cx={64}
                    className="loader__mouth1"
                  />
                  <circle
                    transform="rotate(0,64,64)"
                    r={56}
                    cy={64}
                    cx={64}
                    className="loader__mouth2"
                  />
                </g>
              </g>
              <g mask="url(#loader-mask)">
                <rect
                  clipPath="url(#loader-eyes)"
                  height={64}
                  width={128}
                  fill="url(#custom-gradient)"
                />
                <g stroke="url(#custom-gradient)" fill="none">
                  <circle
                    transform="rotate(180,64,64)"
                    r={56}
                    cy={64}
                    cx={64}
                    className="loader__mouth1"
                  />
                  <circle
                    transform="rotate(0,64,64)"
                    r={56}
                    cy={64}
                    cx={64}
                    className="loader__mouth2"
                  />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1500;

  .spinner-container {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
    min-height: 200px;
  }

  .loader {
    width: 8em;
    height: 8em;
  }

  .loader__eye1,
  .loader__eye2,
  .loader__mouth1,
  .loader__mouth2 {
    animation: eye1 3s ease-in-out infinite;
  }

  .loader__eye1,
  .loader__eye2 {
    transform-origin: 64px 64px;
  }

  .loader__eye2 {
    animation-name: eye2;
  }

  .loader__mouth1 {
    animation-name: mouth1;
  }

  .loader__mouth2 {
    animation-name: mouth2;
    visibility: hidden;
  }

  @keyframes eye1 {
    from {
      transform: rotate(-260deg) translate(0, -56px);
    }
    50%,
    60% {
      animation-timing-function: cubic-bezier(0.17, 0, 0.58, 1);
      transform: rotate(-40deg) translate(0, -56px) scale(1);
    }
    to {
      transform: rotate(225deg) translate(0, -56px) scale(0.35);
    }
  }

  @keyframes eye2 {
    from {
      transform: rotate(-260deg) translate(0, -56px);
    }
    50% {
      transform: rotate(40deg) translate(0, -56px) rotate(-40deg) scale(1);
    }
    52.5% {
      transform: rotate(40deg) translate(0, -56px) rotate(-40deg) scale(1, 0);
    }
    55%,
    70% {
      animation-timing-function: cubic-bezier(0, 0, 0.28, 1);
      transform: rotate(40deg) translate(0, -56px) rotate(-40deg) scale(1);
    }
    to {
      transform: rotate(150deg) translate(0, -56px) scale(0.4);
    }
  }

  @keyframes mouth1 {
    from {
      animation-timing-function: ease-in;
      stroke-dasharray: 0 351.86;
      stroke-dashoffset: 0;
    }
    25% {
      animation-timing-function: ease-out;
      stroke-dasharray: 175.93 351.86;
      stroke-dashoffset: 0;
    }
    50% {
      animation-timing-function: steps(1, start);
      stroke-dasharray: 175.93 351.86;
      stroke-dashoffset: -175.93;
      visibility: visible;
    }
    75%,
    to {
      visibility: hidden;
    }
  }

  @keyframes mouth2 {
    from {
      animation-timing-function: steps(1, end);
      visibility: hidden;
    }
    50% {
      animation-timing-function: ease-in-out;
      visibility: visible;
      stroke-dashoffset: 0;
    }
    to {
      stroke-dashoffset: -351.86;
    }
  }
`;

export default LoadingSpinner;
