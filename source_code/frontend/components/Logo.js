export default function Logo() {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18" cy="18" r="18" fill="url(#paint0_linear)" />
        <path d="M12 18c0-3.3137 2.6863-6 6-6s6 2.6863 6 6-2.6863 6-6 6-6-2.6863-6-6zm6-4a4 4 0 100 8 4 4 0 000-8z" fill="#fff" />
        <path d="M18 10v2M18 24v2M10 18h2M24 18h2M13.757 13.757l1.414 1.414M20.829 20.829l1.414 1.414M13.757 22.243l1.414-1.414M20.829 15.171l1.414-1.414" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
        <defs>
          <linearGradient id="paint0_linear" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" />
            <stop offset="1" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
      <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-purple-400 bg-clip-text text-transparent tracking-tight">DevShare Lite</span>
    </div>
  );
} 