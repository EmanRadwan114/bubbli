import React from "react";
import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Button = styled.button`
  border-radius: 8px;
  border: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};
`;

const Loader = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  &::after {
    content: "";
    width: 1em;
    height: 1em;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: ${spin} 0.6s linear infinite;
  }
`;

const LoadingButton = ({ loading, children, onClick, ...props }) => {
  return (
    <Button onClick={onClick} disabled={loading} {...props}>
      {loading ? (
        <Loader>
          <span>Loading...</span>
        </Loader>
      ) : (
        children
      )}
    </Button>
  );
};

export default LoadingButton;
