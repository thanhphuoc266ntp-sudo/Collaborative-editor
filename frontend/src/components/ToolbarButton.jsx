import React from "react";

const ToolbarButton = ({ title, active, onRun, children, className = "" }) => {
  const handlePointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onRun(event);
  };

  return (
    <button
      type="button"
      tabIndex={-1}
      title={title}
      className={`tool-btn ${className} ${active ? "is-active" : ""}`}
      onPointerDownCapture={handlePointerDown}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
