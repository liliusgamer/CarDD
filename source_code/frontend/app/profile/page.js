"use client";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const { isLoggedIn, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [editingUsername, setEditingUsername] = useState(false);
  const [editingDisplayName, setEditingDisplayName] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [displayNameError, setDisplayNameError] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        // Lấy thông tin user
        const resUser = await fetch("http://localhost:8000/api/auth/me/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resUser.ok) return;
        const userData = await resUser.json();
        
        // Lấy thông tin profile
        const resProfile = await fetch("http://localhost:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (resProfile.ok) {
          const profileData = await resProfile.json();
          setUser({ ...userData, profile: profileData });
        } else {
          setUser(userData);
        }
        
        // Lấy bài viết đã đăng
        const resPosts = await fetch(`http://localhost:8000/api/posts/?author=${userData.username}&draft=false`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const postData = resPosts.ok ? await resPosts.json() : [];
        setPosts(postData);
        // Lấy bài viết nháp
        const resDrafts = await fetch(`http://localhost:8000/api/posts/?author=${userData.username}&draft=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const draftData = resDrafts.ok ? await resDrafts.json() : [];
        setDrafts(draftData);
      } catch (err) {
        // Bỏ qua lỗi
      }
      setLoading(false);
    };
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  // Lấy avatar thật
  useEffect(() => {
    const fetchAvatar = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:8000/api/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAvatarUrl(data.avatar_url);
      }
    };
    if (isLoggedIn) fetchAvatar();
  }, [isLoggedIn]);

  // Upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("http://localhost:8000/api/profile/", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setAvatarUrl(data.avatar_url);
    }
  };

  // Cập nhật username
  const handleUpdateUsername = async () => {
    const trimmedUsername = newUsername.trim();
    if (!trimmedUsername) {
      setUsernameError("Username không được để trống");
      return;
    }
    if (trimmedUsername === user?.username) {
      setEditingUsername(false);
      setNewUsername("");
      setUsernameError("");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("username", trimmedUsername);
    
    try {
      const res = await fetch("http://localhost:8000/api/profile/", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      if (res.ok) {
        setUser({ ...user, username: trimmedUsername });
        setEditingUsername(false);
        setNewUsername("");
        setUsernameError("");
        // Reload lại dữ liệu bài viết vì username đã thay đổi
        window.location.reload();
      } else {
        const errorData = await res.json();
        setUsernameError(errorData.username?.[0] || "Cập nhật username thất bại");
      }
    } catch (err) {
      setUsernameError("Không thể kết nối tới server");
    }
  };

  const handleStartEditUsername = () => {
    setNewUsername(user?.username || "");
    setEditingUsername(true);
    setUsernameError("");
  };

  const handleCancelEditUsername = () => {
    setEditingUsername(false);
    setNewUsername("");
    setUsernameError("");
  };

  // Cập nhật display_name
  const handleUpdateDisplayName = async () => {
    const trimmedDisplayName = newDisplayName.trim();
    
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("display_name", trimmedDisplayName);
    
    try {
      const res = await fetch("http://localhost:8000/api/profile/", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      
      if (res.ok) {
        setUser({ ...user, display_name: trimmedDisplayName });
        setEditingDisplayName(false);
        setNewDisplayName("");
        setDisplayNameError("");
        // Reload lại dữ liệu
        window.location.reload();
      } else {
        const errorData = await res.json();
        setDisplayNameError(errorData.display_name?.[0] || "Cập nhật tên hiển thị thất bại");
      }
    } catch (err) {
      setDisplayNameError("Không thể kết nối tới server");
    }
  };

  const handleStartEditDisplayName = () => {
    const profile = user?.profile;
    setNewDisplayName(profile?.display_name || "");
    setEditingDisplayName(true);
    setDisplayNameError("");
  };

  const handleCancelEditDisplayName = () => {
    setEditingDisplayName(false);
    setNewDisplayName("");
    setDisplayNameError("");
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={logout} />
      <main className="max-w-xl mx-auto p-6 bg-white/90 rounded-2xl shadow-xl mt-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Trang cá nhân</h2>
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="relative w-20 h-20">
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" className="w-20 h-20 rounded-full object-cover border-2 border-blue-400" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-3xl font-bold">
                {user ? user.username[0]?.toUpperCase() : "?"}
              </div>
            )}
            <button
              className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-300 shadow hover:bg-blue-100"
              onClick={() => fileInputRef.current.click()}
              title="Đổi avatar"
              style={{ lineHeight: 0 }}
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="#2563eb" strokeWidth="2"/><path d="M16.5 3.5l4 4M2 12v7a2 2 0 002 2h16a2 2 0 002-2v-7M16.5 3.5L21 8M16.5 3.5H19a2 2 0 012 2v2.5M16.5 3.5L8.5 11.5M21 8v2.5M21 8l-8.5 8.5M3 21l8.5-8.5" stroke="#2563eb" strokeWidth="2"/></svg>
            </button>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleAvatarChange}
            />
          </div>
          <div className="text-lg font-semibold">
            {editingUsername ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-center"
                  style={{ width: '150px' }}
                  pattern="[a-zA-Z0-9_]+"
                  minLength="3"
                  maxLength="30"
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateUsername()}
                />
                <button
                  onClick={handleUpdateUsername}
                  className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelEditUsername}
                  className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">@{user ? user.username : "Chưa đăng nhập"}</span>
                {user && (
                  <button
                    onClick={handleStartEditUsername}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                    title="Chỉnh sửa username"
                  >
                    ✏️
                  </button>
                )}
              </div>
            )}
          </div>
          {usernameError && (
            <div className="text-red-500 text-sm">{usernameError}</div>
          )}
          
          {/* Display Name */}
          <div className="text-xl font-bold text-blue-700">
            {editingDisplayName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-center"
                  style={{ width: '200px' }}
                  maxLength="100"
                  onKeyPress={(e) => e.key === 'Enter' && handleUpdateDisplayName()}
                />
                <button
                  onClick={handleUpdateDisplayName}
                  className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  ✓
                </button>
                <button
                  onClick={handleCancelEditDisplayName}
                  className="px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{user?.profile?.display_name || user?.username || "Chưa đăng nhập"}</span>
                {user && (
                  <button
                    onClick={handleStartEditDisplayName}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                    title="Chỉnh sửa tên hiển thị"
                  >
                    ✏️
                  </button>
                )}
              </div>
            )}
          </div>
          {displayNameError && (
            <div className="text-red-500 text-sm">{displayNameError}</div>
          )}
          
          <div className="text-gray-500">{user ? user.email : "Chưa đăng nhập"}</div>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-bold text-blue-600 mb-2">Bài viết đã đăng</h3>
          {loading ? <p>Đang tải...</p> : (
            <ul className="space-y-2">
              {posts.length === 0 ? <li className="text-gray-500">Chưa có bài viết nào.</li> :
                posts.map(post => (
                  <li key={post.id} className="p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition">
                    <Link href={`/post/${post.id}`} className="font-semibold text-blue-700 hover:underline">
                      {post.title}
                    </Link>
                    <span className="ml-2 text-xs text-gray-500">({new Date(post.created_at).toLocaleString()})</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div>
          <h3 className="text-lg font-bold text-purple-600 mb-2">Bài viết nháp</h3>
          {loading ? <p>Đang tải...</p> : (
            <ul className="space-y-2">
              {drafts.length === 0 ? <li className="text-gray-500">Chưa có bài viết nháp nào.</li> :
                drafts.map(post => (
                  <li key={post.id} className="p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition">
                    <Link href={`/post/${post.id}`} className="font-semibold text-purple-700 hover:underline">
                      {post.title}
                    </Link>
                    <span className="ml-2 text-xs text-gray-500">({new Date(post.updated_at).toLocaleString()})</span>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
} 