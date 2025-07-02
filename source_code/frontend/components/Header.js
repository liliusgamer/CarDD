import Link from "next/link";

export default function Header() {
  return (
    <nav style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
      <Link href="/">Trang chủ</Link>
      <Link href="/login">Đăng nhập</Link>
      <Link href="/register">Đăng ký</Link>
      <Link href="/profile">Cá nhân</Link>
      <Link href="/post/create">Tạo bài viết</Link>
    </nav>
  );
} 