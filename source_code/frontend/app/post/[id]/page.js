"use client";
import Header from "../../../components/Header";
import useAuth from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PostDetailPage() {
  const { isLoggedIn, logout } = useAuth();
  const params = useParams();
  const postId = params?.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  // Bình luận sẽ làm sau, tạm để dữ liệu mẫu

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const res = await fetch(`http://localhost:8000/api/posts/${postId}/`);
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      }
      setLoading(false);
    };
    if (postId) fetchPost();
  }, [postId]);

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={logout} />
      <main style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
        {loading ? (
          <p>Đang tải bài viết...</p>
        ) : post ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <div style={{ margin: '16px 0', color: '#666' }}>
              {post.tags && post.tags.length > 0 && (
                <span>{post.tags.map(tag => tag.name).join(", ")}</span>
              )}
            </div>
            <article style={{ marginBottom: 32 }}>
              <div style={{ whiteSpace: 'pre-line' }}>{post.content}</div>
            </article>
            <section>
              <h3>Bình luận</h3>
              <form style={{ marginBottom: 16 }}>
                <textarea placeholder="Viết bình luận..." rows={3} style={{ width: '100%', padding: 8, margin: '8px 0' }} />
                <button type="submit" style={{ padding: 8 }}>Gửi bình luận</button>
              </form>
              <ul>
                <li>Chưa có bình luận nào.</li>
              </ul>
            </section>
          </>
        ) : (
          <p>Không tìm thấy bài viết.</p>
        )}
      </main>
    </>
  );
} 