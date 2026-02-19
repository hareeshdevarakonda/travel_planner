import React from "react";

const SidebarToggleIcon = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="relative w-12 h-12 flex items-center justify-center"
    >
      <svg
        viewBox="0 0 64 64"
        className="w-10 h-10 transition-all duration-300"
      >
        {/* Top Bar */}
        <rect
          x="10"
          y="18"
          width="36"
          height="6"
          rx="3"
          className={`transition-all duration-300 ${
            isOpen
              ? "rotate-45 translate-y-6 origin-center fill-white"
              : "fill-[#556B75]"
          }`}
        />

        {/* Middle Bar */}
        <rect
          x="10"
          y="29"
          width="36"
          height="6"
          rx="3"
          className={`transition-all duration-300 ${
            isOpen ? "opacity-0" : "fill-[#556B75]"
          }`}
        />

        {/* Bottom Bar */}
        <rect
          x="10"
          y="40"
          width="26"
          height="6"
          rx="3"
          className={`transition-all duration-300 ${
            isOpen
              ? "-rotate-45 -translate-y-6 origin-center fill-white"
              : "fill-[#556B75]"
          }`}
        />

        {/* Yellow Dot (only when closed) */}
        {!isOpen && (
          <circle
            cx="52"
            cy="21"
            r="6"
            fill="#FACC15"
            className="transition-opacity duration-300"
          />
        )}
      </svg>
    </button>
  );
};

export default SidebarToggleIcon;
