import React from "react";

const HelpTooltip = ({ text }) => {
  if (!text) return null;

  return (
    <span className="relative ml-1 inline-flex group">
      <span
        className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#d6b8ae] text-[10px] font-bold text-[#8f2e31]"
        aria-label={text}
        tabIndex={0}
      >
        ?
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-56 -translate-x-1/2 rounded-lg bg-[#2f2320] px-3 py-2 text-left text-xs font-normal leading-5 text-white shadow-lg group-hover:block group-focus-within:block">
        {text}
      </span>
    </span>
  );
};

export default HelpTooltip;
