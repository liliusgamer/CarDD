"use client";
import Header from "../../../../components/Header";
import useAuth from "../../../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function EditPostPage() {
  const { isLoggedIn, logout } = useAuth();
  const params = useParams();
  const router = useRouter();
  const postId = params?.id;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState([]); // tag đã chọn
  const [allTags, setAllTags] = useState([]); // tất cả tag
  const [tagInput, setTagInput] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Lấy dữ liệu bài viết
    const fetchPost = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setIsDraft(data.is_draft);
        setTags(data.tags || []);
      } else {
        setError("Không tìm thấy bài viết hoặc bạn không có quyền chỉnh sửa.");
      }
      setLoading(false);
    };
    // Lấy tất cả tag
    const fetchTags = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8000/api/tags/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAllTags(data);
      }
    };
    if (postId) {
      fetchPost();
      fetchTags();
    }
  }, [postId]);

  const handleAddTag = (e) => {
    e.preventDefault();
    const name = tagInput.trim();
    if (!name) return;
    const exist = allTags.find(t => t.name.toLowerCase() === name.toLowerCase());
    if (exist) {
      if (!tags.some(t => t.id === exist.id)) setTags([...tags, exist]);
    } else {
      setTags([...tags, { id: null, name }]);
    }
    setTagInput("");
  };

  const handleRemoveTag = (idOrName) => {
    setTags(tags.filter(t => t.id ? t.id !== idOrName : t.name !== idOrName));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!window.confirm("Bạn có chắc chắn muốn lưu thay đổi cho bài viết này?")) return;
    setError("");
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Bạn cần đăng nhập lại để chỉnh sửa bài viết.");
      setLoading(false);
      return;
    }
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
      // Gửi cập nhật bài viết
      const res = await fetch(`http://localhost:8000/api/posts/${postId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          content,
          is_draft: isDraft,
          tag_ids: tagIds,
        }),
      });
      if (res.status === 401) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        setLoading(false);
        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        return;
      }
      if (res.ok) {
        toast.success("Cập nhật bài viết thành công!");
        router.push(`/post/${postId}`);
      } else {
        setError("Cập nhật bài viết thất bại!");
        toast.error("Cập nhật bài viết thất bại!");
      }
    } catch (err) {
      setError("Không thể kết nối tới server!");
      toast.error("Không thể kết nối tới server!");
    }
    setLoading(false);
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} onLogout={logout} />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h2>Chỉnh sửa bài viết</h2>
        {loading ? <p>Đang tải...</p> : (
          <form onSubmit={handleSubmit}>
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
            <button type="submit" style={{ padding: 12, background: '#2563eb', color: '#fff', borderRadius: 8, fontWeight: 'bold', minWidth: 120 }} disabled={loading}>Lưu thay đổi</button>
          </form>
        )}
      </main>
    </>
  );
} 