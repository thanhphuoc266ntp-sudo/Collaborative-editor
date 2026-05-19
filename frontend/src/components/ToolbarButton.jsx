import React from "react";

const ToolbarButton = ({ title, active, onRun, children, className = "" }) => {
  return (
    <button
      type="button"
      title={title}
      className={`tool-btn ${className} ${active ? "is-active" : ""}`}
      onMouseDown={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onRun();
      }}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
