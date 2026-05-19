import React from "react";

const ToolbarButton = ({
  title,
  active,
  onMouseDown,
  children,
  className = "",
}) => {
  return (
    <button
      type="button"
      title={title}
      className={`tool-btn ${className} ${active ? "is-active" : ""}`}
      onMouseDown={onMouseDown}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
