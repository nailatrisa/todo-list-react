function LogoNS({ className = "", size = 40 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background persegi dengan sudut melengkung */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="10"
        fill="url(#nsGradient)"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.2"
      />

      {/* Huruf N */}
      <path
        d="M11 28V12L20 24V12"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Huruf S */}
      <path
        d="M29 12H23V19H29V26H23"
        stroke="white"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Gradien latar */}
      <defs>
        <linearGradient id="nsGradient" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default LogoNS;