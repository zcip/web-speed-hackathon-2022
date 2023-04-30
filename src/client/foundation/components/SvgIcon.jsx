import React from "react";

export default function SvgIcon({ children, viewBox, width }) {
  return (
    <svg
      aria-hidden
      focusable={false}
      style={{
        display: "inline-flex",
        fontSize: "inherit",
        height: "1em",
        verticalAlign: "-0.125em",
        width
      }}
      viewBox={viewBox}
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}
