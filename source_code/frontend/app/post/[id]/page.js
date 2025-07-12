"use client";
import Header from "../../../components/Header";
import useAuth from "../../../hooks/useAuth";
import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

export default function PostDetailPage() {
  const { isLoggedIn, logout, user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const postId = params?.id;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");
  const [replyTo, setReplyTo] = useState(null); // id comment đang trả lời
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");
  const editingInputRef = useRef();
  // Bình luận sẽ làm sau, tạm để dữ liệu mẫu

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/posts/${postId}/`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      if (res.ok) {
        const data = await res.json();
        setPost(data);
      }
      setLoading(false);
    };
    if (postId) fetchPost();
  }, [postId]);

  // Fetch comments
  const fetchComments = async () => {
    if (!postId) return;
    setCommentLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/comments/?post=${postId}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {});
    if (res.ok) {
      const data = await res.json();
      setComments(data);
    }
    setCommentLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Gửi bình luận mới hoặc reply
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    setCommentLoading(true);
    setCommentError("");
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8000/api/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        post: postId,
        content: commentContent,
        parent: replyTo || null,
      }),
    });
    if (res.ok) {
      setCommentContent("");
      setReplyTo(null);
      // Reload toàn bộ comment để cập nhật reply vào đúng vị trí
      fetchComments();
    } else {
      const error = await res.json();
      setCommentError(error && typeof error === 'object' ? JSON.stringify(error) : String(error));
    }
    setCommentLoading(false);
  };

  // Hàm gửi chỉnh sửa bình luận
  const handleEditComment = async (commentId) => {
    if (!editingContent.trim()) return;
    setCommentLoading(true);
    setCommentError("");
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/comments/${commentId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ content: editingContent }),
    });
    if (res.ok) {
      setEditingCommentId(null);
      setEditingContent("");
      fetchComments();
    } else {
      const error = await res.json();
      setCommentError(error && typeof error === 'object' ? JSON.stringify(error) : String(error));
    }
    setCommentLoading(false);
  };

  // Hàm xóa bình luận
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) return;
    setCommentLoading(true);
    setCommentError("");
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/comments/${commentId}/`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      fetchComments();
    } else {
      const error = await res.json();
      setCommentError(error && typeof error === 'object' ? JSON.stringify(error) : String(error));
    }
    setCommentLoading(false);
  };

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    if (!token || !post) return;
    const url = `http://localhost:8000/api/posts/${postId}/${post.liked_by_user ? "unlike" : "like"}/`;
    await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    // Reload lại bài viết
    const res = await fetch(`http://localhost:8000/api/posts/${postId}/`, token ? { headers: { Authorization: `Bearer ${token}` } } : {});
    if (res.ok) {
      const data = await res.json();
      setPost(data);
    }
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={logout} />
      <main style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
        {loading ? (
          <p>Đang tải bài viết...</p>
        ) : post ? (
          <>
            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                {post.author_avatar_url ? (
                  <img src={post.author_avatar_url.startsWith('/media/') ? `http://localhost:8000${post.author_avatar_url}` : post.author_avatar_url} alt="avatar" className="w-12 h-12 object-cover rounded-full" />
                ) : (
                  <span>{post.author_username?.[0]?.toUpperCase() || "?"}</span>
                )}
              </div>
              <div>
                <div className="font-semibold text-blue-700">{post.author_username}</div>
                <div className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</div>
              </div>
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded transition ml-4 ${post.liked_by_user ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} hover:bg-blue-200`}
                onClick={handleLike}
                disabled={!isLoggedIn}
                title={post.liked_by_user ? 'Bỏ thích' : 'Thích'}
              >
                {post.liked_by_user ? <FaThumbsUp /> : <FaRegThumbsUp />}
                <span>{post.like_count}</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags && post.tags.length > 0 && (
                post.tags.map(tag => (
                  <span key={tag.id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">#{tag.name}</span>
                ))
              )}
            </div>
            <article style={{ marginBottom: 32 }}>
              <div style={{ whiteSpace: 'pre-line', fontSize: 17 }}>{post.content}</div>
            </article>
            <section>
              <h3>Bình luận</h3>
              <form style={{ marginBottom: 16 }} onSubmit={handleCommentSubmit}>
                <textarea
                  placeholder={replyTo ? "Trả lời bình luận..." : "Viết bình luận..."}
                  rows={3}
                  style={{ width: '100%', padding: 8, margin: '8px 0' }}
                  value={commentContent}
                  onChange={e => setCommentContent(e.target.value)}
                  disabled={commentLoading}
                />
                {replyTo && (
                  <div style={{ marginBottom: 8 }}>
                    <span style={{ color: '#2563eb' }}>Đang trả lời bình luận #{replyTo}</span>
                    <button type="button" onClick={() => setReplyTo(null)} style={{ marginLeft: 8, color: 'red' }}>Hủy</button>
                  </div>
                )}
                <button type="submit" style={{ padding: 8 }} disabled={commentLoading || !commentContent.trim()}>
                  {commentLoading ? "Đang gửi..." : replyTo ? "Gửi trả lời" : "Gửi bình luận"}
                </button>
              </form>
              {commentError && (
                <div style={{ color: 'red', marginBottom: 8 }}>Lỗi gửi bình luận: {commentError}</div>
              )}
              <ul>
                {commentLoading && <li>Đang tải bình luận...</li>}
                {!commentLoading && comments.length === 0 && <li>Chưa có bình luận nào.</li>}
                {!commentLoading && comments.filter(c => !c.parent).map(c => (
                  <li
                    key={c.id}
                    className="border rounded-lg shadow-md p-3 mb-4 bg-white"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 18, overflow: 'hidden' }}>
                        {c.author_avatar_url ? (
                          <img src={c.author_avatar_url.startsWith('/media/') ? `http://localhost:8000${c.author_avatar_url}` : c.author_avatar_url} alt="avatar" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                          <span>{c.author_username?.[0]?.toUpperCase() || '?'}</span>
                        )}
                      </div>
                      <div>
                        <b>{c.author_username}</b> <span style={{ color: '#888', fontSize: 12 }}>{new Date(c.created_at).toLocaleString()}</span>
                        {c.updated_at && c.updated_at !== c.created_at && (
                          <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>(đã chỉnh sửa)</span>
                        )}
                      </div>
                    </div>
                    {editingCommentId === c.id ? (
                      <div style={{ margin: '8px 0' }}>
                        <textarea
                          ref={editingInputRef}
                          value={editingContent}
                          onChange={e => setEditingContent(e.target.value)}
                          rows={2}
                          style={{ width: '100%', padding: 6 }}
                        />
                        <button onClick={() => handleEditComment(c.id)} style={{ marginRight: 8, color: '#2563eb' }}>Lưu</button>
                        <button onClick={() => { setEditingCommentId(null); setEditingContent(""); }} style={{ color: 'red' }}>Hủy</button>
                      </div>
                    ) : (
                      <div>
                        <div>{c.content}</div>
                        <button onClick={() => setReplyTo(c.id)} style={{ color: '#2563eb', fontSize: 13, marginTop: 4, marginRight: 8 }}>Trả lời</button>
                        {(user && (user.username === c.author_username || user.is_staff)) && (
                          <>
                            <button onClick={() => { setEditingCommentId(c.id); setEditingContent(c.content); }} style={{ color: '#f59e42', fontSize: 13, marginRight: 8 }}>Chỉnh sửa</button>
                            <button onClick={() => handleDeleteComment(c.id)} style={{ color: '#ef4444', fontSize: 13 }}>Xóa</button>
                          </>
                        )}
                      </div>
                    )}
                    {/* Hiển thị reply lồng dưới */}
                    {c.replies && c.replies.length > 0 && (
                      <ul style={{ marginLeft: 24, marginTop: 8 }}>
                        {c.replies.map(r => (
                          <li
                            key={r.id}
                            className="border rounded-lg shadow p-2 mb-2 bg-white"
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#3b82f6,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 16, overflow: 'hidden' }}>
                                {r.author_avatar_url ? (
                                  <img src={r.author_avatar_url.startsWith('/media/') ? `http://localhost:8000${r.author_avatar_url}` : r.author_avatar_url} alt="avatar" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%' }} />
                                ) : (
                                  <span>{r.author_username?.[0]?.toUpperCase() || '?'}</span>
                                )}
                              </div>
                              <div>
                                <b>{r.author_username}</b> <span style={{ color: '#888', fontSize: 12 }}>{new Date(r.created_at).toLocaleString()}</span>
                                {r.updated_at && r.updated_at !== r.created_at && (
                                  <span style={{ color: '#888', fontSize: 12, marginLeft: 8 }}>(đã chỉnh sửa)</span>
                                )}
                              </div>
                            </div>
                            {editingCommentId === r.id ? (
                              <div style={{ margin: '8px 0' }}>
                                <textarea
                                  ref={editingInputRef}
                                  value={editingContent}
                                  onChange={e => setEditingContent(e.target.value)}
                                  rows={2}
                                  style={{ width: '100%', padding: 6 }}
                                />
                                <button onClick={() => handleEditComment(r.id)} style={{ marginRight: 8, color: '#2563eb' }}>Lưu</button>
                                <button onClick={() => { setEditingCommentId(null); setEditingContent(""); }} style={{ color: 'red' }}>Hủy</button>
                              </div>
                            ) : (
                              <div>
                                <div>{r.content}</div>
                                <button onClick={() => setReplyTo(c.id)} style={{ color: '#2563eb', fontSize: 13, marginTop: 2, marginRight: 8 }}>Trả lời</button>
                                {(user && (user.username === r.author_username || user.is_staff)) && (
                                  <>
                                    <button onClick={() => { setEditingCommentId(r.id); setEditingContent(r.content); }} style={{ color: '#f59e42', fontSize: 13, marginRight: 8 }}>Chỉnh sửa</button>
                                    <button onClick={() => handleDeleteComment(r.id)} style={{ color: '#ef4444', fontSize: 13 }}>Xóa</button>
                                  </>
                                )}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
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