import Link from "next/link";
import Logo from "./Logo";
import useAuth from "../hooks/useAuth";
import { useState, useRef, useEffect } from "react";

export default function Header({ isLoggedIn: isLoggedInProp, onLogout }) {
  const { isLoggedIn, user, logout } = useAuth();
  const [dropdown, setDropdown] = useState(false);
  const menuRef = useRef();

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };
    if (dropdown) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdown]);

  const handleLogout = () => {
    setDropdown(false);
    if (onLogout) onLogout();
    else logout();
  };

  return (
    <header className="w-full bg-white shadow-md sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-4 py-2">
        <Link href={isLoggedIn ? "/home" : "/"} className="flex items-center gap-2">
          <Logo />
        </Link>
        <div className="flex items-center gap-4 text-base font-medium">
          <Link href={isLoggedIn ? "/home" : "/"} className="hover:text-blue-500 transition">Trang chủ</Link>
          <Link href="/post/create" className="hover:text-blue-500 transition">Tạo bài viết</Link>
        </div>
        <div className="flex items-center gap-4">
          {!isLoggedIn && (
            <>
              <Link href="/login" className="hover:text-blue-500 transition">Đăng nhập</Link>
              <Link href="/register" className="hover:text-blue-500 transition">Đăng ký</Link>
            </>
          )}
          {isLoggedIn && user && (
            <div className="relative" ref={menuRef}>
              <button
                className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100 transition border border-gray-200"
                onClick={() => setDropdown(v => !v)}
              >
                <span className="font-semibold text-blue-700">{user.username}</span>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              {dropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50 animate-fade-in">
                  <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Trang cá nhân</Link>
                  {user.is_staff && (
                    <Link href="/admin/users" className="block px-4 py-2 hover:bg-gray-100">Quản trị</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Đăng xuất</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
} 