import React from "react";

const ToolbarButton = ({
  title,
  active = false,
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

  const handleMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <button
      type="button"
      tabIndex={-1}
      title={title}
      disabled={disabled}
      aria-pressed={active}
      aria-disabled={disabled}
      className={`tool-btn ${className} ${active ? "is-active" : ""} ${
        disabled ? "is-disabled" : ""
      }`}
      onPointerDownCapture={handlePointerDown}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export default ToolbarButton;
