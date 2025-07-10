"use client";
import Header from "../../components/Header";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { isLoggedIn, logout } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setUser(userData);
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

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={logout} />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h2>Trang cá nhân</h2>
        <div style={{ marginBottom: 24 }}>
          <strong>Tên:</strong> <span>{user ? user.username : "Chưa đăng nhập"}</span><br />
          <strong>Email:</strong> <span>{user ? user.email : "Chưa đăng nhập"}</span>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3>Bài viết đã đăng</h3>
          {loading ? <p>Đang tải...</p> : (
            <ul>
              {posts.length === 0 ? <li>Chưa có bài viết nào.</li> :
                posts.map(post => (
                  <li key={post.id}><strong>{post.title}</strong> <span style={{color:'#888'}}>({new Date(post.created_at).toLocaleString()})</span></li>
                ))}
            </ul>
          )}
        </div>
        <div>
          <h3>Bài viết nháp</h3>
          {loading ? <p>Đang tải...</p> : (
            <ul>
              {drafts.length === 0 ? <li>Chưa có bài viết nháp nào.</li> :
                drafts.map(post => (
                  <li key={post.id}><strong>{post.title}</strong> <span style={{color:'#888'}}>({new Date(post.updated_at).toLocaleString()})</span></li>
                ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
} 