"use client";
import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import Header from "../../../components/Header";

export default function AdminUsersPage() {
  const { isLoggedIn, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(null); // user id
  const [form, setForm] = useState({ username: "", email: "", password: "", is_staff: false, is_superuser: false });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/admin/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setError("Bạn không có quyền truy cập hoặc token hết hạn.");
      }
    } catch (err) {
      setError("Không thể kết nối tới server!");
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/admin/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowCreate(false);
        setForm({ username: "", email: "", password: "", is_staff: false, is_superuser: false });
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.detail || Object.values(data).flat().join(' ') || "Tạo user thất bại!");
      }
    } catch (err) {
      setError("Không thể kết nối tới server!");
    }
  };

  const handleEdit = (u) => {
    setShowEdit(u.id);
    setForm({ username: u.username, email: u.email, password: "", is_staff: u.is_staff, is_superuser: u.is_superuser });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${showEdit}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowEdit(null);
        setForm({ username: "", email: "", password: "", is_staff: false, is_superuser: false });
        fetchUsers();
      } else {
        const data = await res.json();
        setError(data.detail || Object.values(data).flat().join(' ') || "Cập nhật user thất bại!");
      }
    } catch (err) {
      setError("Không thể kết nối tới server!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa user này?")) return;
    setError("");
    try {
      const res = await fetch(`http://localhost:8000/api/admin/users/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchUsers();
      } else {
        setError("Xóa user thất bại!");
      }
    } catch (err) {
      setError("Không thể kết nối tới server!");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-lg">Bạn cần đăng nhập với tài khoản admin để truy cập trang này.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header isLoggedIn={isLoggedIn} />
      <div className="max-w-3xl mx-auto mt-10 bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Quản trị người dùng</h2>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {loading ? (
          <p>Đang tải danh sách người dùng...</p>
        ) : (
          <table className="w-full border text-sm mb-6">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 px-2 border">ID</th>
                <th className="py-2 px-2 border">Username</th>
                <th className="py-2 px-2 border">Email</th>
                <th className="py-2 px-2 border">Admin</th>
                <th className="py-2 px-2 border">Superuser</th>
                <th className="py-2 px-2 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="even:bg-gray-50">
                  <td className="py-2 px-2 border text-center">{u.id}</td>
                  <td className="py-2 px-2 border">{u.username}</td>
                  <td className="py-2 px-2 border">{u.email}</td>
                  <td className="py-2 px-2 border text-center">{u.is_staff ? "✔️" : ""}</td>
                  <td className="py-2 px-2 border text-center">{u.is_superuser ? "✔️" : ""}</td>
                  <td className="py-2 px-2 border text-center">
                    {showEdit === u.id ? (
                      <form onSubmit={handleUpdate} className="flex flex-col gap-1 items-center">
                        <input name="username" value={form.username} onChange={handleInput} className="px-2 py-1 border rounded w-24" required />
                        <input name="email" value={form.email} onChange={handleInput} className="px-2 py-1 border rounded w-32" required />
                        <input name="password" value={form.password} onChange={handleInput} className="px-2 py-1 border rounded w-24" placeholder="Mật khẩu mới (nếu đổi)" type="password" />
                        <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="is_staff" checked={form.is_staff} onChange={handleInput} />Admin</label>
                        <label className="flex items-center gap-1 text-xs"><input type="checkbox" name="is_superuser" checked={form.is_superuser} onChange={handleInput} />Superuser</label>
                        <div className="flex gap-1 mt-1">
                          <button type="submit" className="px-2 py-1 bg-green-600 rounded text-white text-xs">Lưu</button>
                          <button type="button" onClick={() => setShowEdit(null)} className="px-2 py-1 bg-gray-400 rounded text-white text-xs">Hủy</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(u)} className="px-2 py-1 bg-yellow-400 rounded text-white mr-2">Sửa</button>
                        <button onClick={() => handleDelete(u.id)} className="px-2 py-1 bg-red-500 rounded text-white">Xóa</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="mt-6 flex justify-end">
          {showCreate ? (
            <form onSubmit={handleCreate} className="flex flex-col gap-2 bg-gray-50 p-4 rounded shadow w-full max-w-md">
              <input name="username" value={form.username} onChange={handleInput} className="px-3 py-2 border rounded" placeholder="Tên đăng nhập" required />
              <input name="email" value={form.email} onChange={handleInput} className="px-3 py-2 border rounded" placeholder="Email" required />
              <input name="password" value={form.password} onChange={handleInput} className="px-3 py-2 border rounded" placeholder="Mật khẩu" type="password" required />
              <label className="flex items-center gap-2"><input type="checkbox" name="is_staff" checked={form.is_staff} onChange={handleInput} />Admin</label>
              <label className="flex items-center gap-2"><input type="checkbox" name="is_superuser" checked={form.is_superuser} onChange={handleInput} />Superuser</label>
              <div className="flex gap-2 mt-2">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded font-semibold shadow hover:bg-green-700 transition">Tạo</button>
                <button type="button" onClick={() => { setShowCreate(false); setForm({ username: "", email: "", password: "", is_staff: false, is_superuser: false }); }} className="px-4 py-2 bg-gray-400 text-white rounded font-semibold shadow">Hủy</button>
              </div>
            </form>
          ) : (
            <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-green-600 text-white rounded font-semibold shadow hover:bg-green-700 transition">Tạo user mới</button>
          )}
        </div>
      </div>
    </div>
  );
} 