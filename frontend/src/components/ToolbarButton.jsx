import React from "react";

const ToolbarButton = ({
  title,
  active,
  onRun,
  children,
  className = "",
  disabled = false,
}) => {
  const handlePointerDown = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (disabled) return;

    if (typeof onRun === "function") {
      onRun(event);
    }
  };

  return (
    <button
      type="button"
      tabIndex={-1}
      title={title}
      disabled={disabled}
      className={`tool-btn ${className} ${active ? "is-active" : ""} ${
        disabled ? "is-disabled" : ""
      }`}
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
