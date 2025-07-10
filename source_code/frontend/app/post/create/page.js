"use client";
import Header from "../../../components/Header";
import useAuth from "../../../hooks/useAuth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const { isLoggedIn, logout } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]); // danh sách tag đã chọn
  const [allTags, setAllTags] = useState([]); // tất cả tag có sẵn
  const [tagInput, setTagInput] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Lấy danh sách tag có sẵn
    const fetchTags = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("http://localhost:8000/api/tags/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllTags(data);
      }
    };
    if (isLoggedIn) fetchTags();
  }, [isLoggedIn]);

  const handleAddTag = (e) => {
    e.preventDefault();
    const name = tagInput.trim();
    if (!name) return;
    // Nếu tag đã có sẵn thì lấy id, chưa có thì tạo mới
    const exist = allTags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (exist) {
      if (!tags.some(t => t.id === exist.id)) setTags([...tags, exist]);
    } else {
      // Tạo tag mới (chỉ tạo trên backend khi submit)
      setTags([...tags, { id: null, name }]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (idOrName) => {
    setTags(tags.filter(t => t.id ? t.id !== idOrName : t.name !== idOrName));
  };

  const handleSubmit = async (e, draft) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      // Tạo tag mới nếu có
      let tagIds = [];
      for (const tag of tags) {
        if (tag.id) {
          tagIds.push(tag.id);
        } else {
          // Tạo tag mới trên backend
          const res = await fetch("http://localhost:8000/api/tags/", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name: tag.name }),
          });
          if (res.ok) {
            const data = await res.json();
            tagIds.push(data.id);
          }
        }
      }
      // Tạo bài viết
      const res = await fetch("http://localhost:8000/api/posts/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          content,
          is_draft: draft,
          tag_ids: tagIds,
        }),
      });
      if (res.ok) {
        const post = await res.json();
        router.push(`/post/${post.id}`);
      } else {
        setError("Tạo bài viết thất bại!");
      }
    } catch (err) {
      setError("Không thể kết nối tới server!");
    }
    setLoading(false);
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={logout} />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h2>Tạo bài viết mới</h2>
        <form onSubmit={e => handleSubmit(e, false)}>
          <input type="text" placeholder="Tiêu đề bài viết" required value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 8, margin: '8px 0' }} />
          <textarea placeholder="Nội dung (Markdown hỗ trợ)" required rows={8} value={content} onChange={e => setContent(e.target.value)} style={{ width: '100%', padding: 8, margin: '8px 0' }} />
          <div style={{ margin: '8px 0' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="text" placeholder="Thêm tag..." value={tagInput} onChange={e => setTagInput(e.target.value)} style={{ flex: 1, padding: 8 }} />
              <button onClick={handleAddTag} style={{ padding: 8 }}>Thêm tag</button>
            </div>
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {tags.map(tag => (
                <span key={tag.id || tag.name} style={{ background: '#eee', padding: '4px 8px', borderRadius: 8 }}>
                  {tag.name} <button type="button" onClick={() => handleRemoveTag(tag.id || tag.name)} style={{ marginLeft: 4, color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
                </span>
              ))}
            </div>
          </div>
          <div style={{ margin: '8px 0' }}>
            <label><input type="checkbox" checked={isDraft} onChange={e => setIsDraft(e.target.checked)} /> Lưu ở trạng thái nháp</label>
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" disabled={loading} style={{ flex: 1, padding: 8 }} onClick={e => handleSubmit(e, true)}>Lưu nháp</button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: 8 }}>Đăng bài</button>
          </div>
        </form>
      </main>
    </>
  );
} 