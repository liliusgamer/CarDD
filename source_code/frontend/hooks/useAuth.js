"use client";
import { useState, useEffect } from "react";

export default function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  // Lấy thông tin user từ API
  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const userData = await res.json();
        
        // Lấy thông tin profile
        const profileRes = await fetch("http://localhost:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          return {
            ...userData,
            display_name: profileData.display_name,
            profile: profileData
          };
        }
        return userData;
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
    return null;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchUserInfo(token).then(userData => {
        if (userData) {
          setUser(userData);
        }
      });
    }
  }, []);

  const login = async (token, username, is_staff) => {
    localStorage.setItem("token", token);
    if (username) localStorage.setItem("username", username);
    if (is_staff !== undefined) localStorage.setItem("is_staff", is_staff);
    setIsLoggedIn(true);
    
    // Lấy thông tin đầy đủ từ API
    const userData = await fetchUserInfo(token);
    setUser(userData || { username, is_staff });
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