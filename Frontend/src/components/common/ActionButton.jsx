import { useState } from "react";

const ActionButton = ({ icon: Icon, label, onClick, className = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={`w-14 h-14 rounded-full bg-[#c1965e] text-white flex items-center justify-center text-xl transition-all duration-300 hover:bg-[#bf9456] hover:scale-110 hover:shadow-lg ${className}`}
        aria-label={label}
      >
        <Icon size={22} />
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap z-50 pointer-events-none animate-fade-in">
          {label}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900" />
        </div>
      )}
    </div>
  );
};

export default ActionButton;
