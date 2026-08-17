function Icon({ name, size = 18, className = "", stroke = 2 }) {
  const common = { width: size, height: size, strokeWidth: stroke, className };

  switch (name) {
    case "Dashboard":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 13h8V3H3v10zM13 21h8V11h-8v10zM13 3v6h8V3h-8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Todo":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "MyTasks":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11l3 3L22 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Projects":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Team":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Calendar":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Milestone":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3v12" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 7l10-4v11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Checklist":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Notifications":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Search":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="11" cy="11" r="6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Settings":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19.4 15a1.8 1.8 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.8 1.8 0 0 0-1.82-.33 1.8 1.8 0 0 0-1 1.6V21a2 2 0 0 1-4 0v-.01a1.8 1.8 0 0 0-1-1.6 1.8 1.8 0 0 0-1.82.33l-.06.06A2 2 0 0 1 2.27 16.9l.06-.06A1.8 1.8 0 0 0 2.66 15a1.8 1.8 0 0 0-1.6-1H1a2 2 0 0 1 0-4h.06c.71 0 1.3-.45 1.6-1a1.8 1.8 0 0 0-.33-1.82L2.27 2.27A2 2 0 0 1 5.1.44l.06.06A1.8 1.8 0 0 0 7 1.83c.45.3 1 .33 1.6.33H9a2 2 0 0 1 4 0h.01c.6 0 1.15-.03 1.6-.33a1.8 1.8 0 0 0 1.64-.39l.06-.06A2 2 0 0 1 21.73 3.1l-.06.06c-.3.71-.33 1.3-.33 1.6V7a2 2 0 0 1 0 4v.01c-.3.71-.45 1.3-.33 1.6z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Report":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 17v-6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 17V7" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 17v-3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "Logout":
      return (
        <svg {...common} viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16 17l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export default Icon;
