"use client";
import Logo from "../../components/Logo";
import Link from "next/link";
import useAuth from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

export default function HomeFeedPage() {
  const { isLoggedIn, user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [allTags, setAllTags] = useState([]);
  const pageSize = 10;
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    // Lấy tất cả tag
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
    fetchTags();
  }, []);

  useEffect(() => {
    if (isMounted && !isLoggedIn) {
      router.replace("/login");
      return;
    }
    if (!isMounted || !isLoggedIn) return;
    const fetchPosts = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      let url = `http://localhost:8000/api/posts/?draft=false&page=${page}`;
      if (search) url += `&q=${encodeURIComponent(search)}`;
      if (selectedTag) url += `&tag_id=${selectedTag}`;
      const res = await fetch(url,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {});
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
          setCount(data.length);
        } else {
          setPosts(data.results || []);
          setCount(data.count || 0);
        }
      } else {
        setPosts([]);
        setCount(0);
      }
      setLoading(false);
    };
    fetchPosts();
  }, [isMounted, isLoggedIn, page, router, search, selectedTag]);

  const reloadPosts = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8000/api/posts/?draft=false&page=${page}`,
      token ? { headers: { Authorization: `Bearer ${token}` } } : {});
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        setPosts(data);
        setCount(data.length);
      } else {
        setPosts(data.results || []);
        setCount(data.count || 0);
      }
    } else {
      setPosts([]);
      setCount(0);
    }
    setLoading(false);
  };

  const handleLike = async (postId, liked) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const url = `http://localhost:8000/api/posts/${postId}/${liked ? "unlike" : "like"}/`;
    await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    // Sau khi like/unlike, reload lại danh sách bài viết
    reloadPosts();
  };

  if (!isMounted) return null;
  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
      <Header isLoggedIn={isLoggedIn} onLogout={logout} />
      <div className="max-w-2xl mx-auto py-8 px-2">
        <div className="flex flex-col items-center mb-8">
          <Logo />
          <h1 className="text-3xl font-bold text-center text-blue-700 mt-2">DevShare Lite</h1>
          <p className="text-center text-gray-600 mb-2">Nơi chia sẻ kiến thức, hỏi đáp và kết nối cộng đồng IT!</p>
        </div>
        {/* Thanh tìm kiếm và lọc tag */}
        <form onSubmit={e => { e.preventDefault(); setPage(1); }} className="flex flex-wrap gap-2 mb-4 justify-center">
          <input
            type="text"
            placeholder="Tìm kiếm bài viết..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 min-w-[200px]"
          />
          <select
            value={selectedTag}
            onChange={e => { setSelectedTag(e.target.value); setPage(1); }}
            className="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Tất cả tag</option>
            {allTags.map(tag => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Tìm kiếm</button>
        </form>
        <div className="flex justify-end mb-4 gap-2">
          <Link href="/post/create" className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow hover:from-blue-600 hover:to-purple-600 transition">+ Tạo bài viết</Link>
          <button onClick={reloadPosts} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold shadow hover:bg-gray-300 transition">Tải lại bài viết</button>
        </div>
        <div className="bg-white/90 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-blue-700">Bài viết mới nhất</h2>
          {loading ? (
            <p>Đang tải bài viết...</p>
          ) : posts.length === 0 ? (
            <p>Chưa có bài viết nào.</p>
          ) : (
            <ul className="flex flex-col gap-6">
              {posts.map(post => (
                <li key={post.id} className="border-b pb-4 last:border-b-0 flex gap-3 items-start">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                    {post.author_avatar_url ? (
                      <img src={post.author_avatar_url.startsWith('/media/') ? `http://localhost:8000${post.author_avatar_url}` : post.author_avatar_url} alt="avatar" className="w-12 h-12 object-cover rounded-full" />
                    ) : (
                      <span>{post.author_username?.[0]?.toUpperCase() || "?"}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/post/${post.id}`} className="text-lg font-semibold text-blue-700 hover:underline">
                      {post.title}
                    </Link>
                    <div className="text-sm text-gray-500 mt-1">
                      Đăng bởi <span className="font-semibold text-purple-700">{post.author_username}</span> • {new Date(post.created_at).toLocaleString()}
                    </div>
                    <div className="mt-2 text-gray-700 line-clamp-3">
                      {post.content.length > 200 ? post.content.slice(0, 200) + "..." : post.content}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags && post.tags.map(tag => (
                        <span key={tag.id} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">#{tag.name}</span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        className={`flex items-center gap-1 px-3 py-1 rounded transition ${post.liked_by_user ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} hover:bg-blue-200`}
                        onClick={() => handleLike(post.id, post.liked_by_user)}
                        disabled={!isLoggedIn}
                        title={post.liked_by_user ? 'Bỏ thích' : 'Thích'}
                      >
                        {post.liked_by_user ? <FaThumbsUp /> : <FaRegThumbsUp />}
                        <span>{post.like_count}</span>
                      </button>
                    </div>
                    <Link href={`/post/${post.id}`} className="inline-block mt-2 text-blue-600 hover:underline text-sm">Xem chi tiết</Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {/* Phân trang */}
          {count > pageSize && (
            <div className="flex justify-center gap-2 mt-6">
              <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Trước</button>
              <span className="px-2">Trang {page}</span>
              <button disabled={page * pageSize >= count} onClick={() => setPage(page + 1)} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Sau</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 