import Header from "../../components/Header";

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h2>Trang cá nhân</h2>
        <div style={{ marginBottom: 24 }}>
          <strong>Tên:</strong> <span>Chưa đăng nhập</span><br />
          <strong>Email:</strong> <span>Chưa đăng nhập</span>
        </div>
        <div style={{ marginBottom: 24 }}>
          <h3>Bài viết đã đăng</h3>
          <ul>
            <li>Chưa có bài viết nào.</li>
          </ul>
        </div>
        <div>
          <h3>Bài viết nháp</h3>
          <ul>
            <li>Chưa có bài viết nháp nào.</li>
          </ul>
        </div>
      </main>
    </>
  );
} 