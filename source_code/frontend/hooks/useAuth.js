"use client";
import { useState, useEffect } from "react";

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const isStaff = localStorage.getItem("is_staff") === "true";
    setIsLoggedIn(!!token);
    setUser(username ? { username, is_staff: isStaff } : null);
  }, []);

  const login = (token, username, is_staff) => {
    localStorage.setItem("token", token);
    if (username) localStorage.setItem("username", username);
    if (is_staff !== undefined) localStorage.setItem("is_staff", is_staff);
    setIsLoggedIn(true);
    setUser(username ? { username, is_staff } : null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("is_staff");
    setIsLoggedIn(false);
    setUser(null);
  };

  return { isLoggedIn, user, login, logout };
} 