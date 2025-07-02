import Image from "next/image";
import Header from "../components/Header";

export default function HomePage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h1>DevShare Lite</h1>
        <input type="text" placeholder="Tìm kiếm bài viết..." style={{ width: '100%', padding: 8, margin: '16px 0' }} />
        <div>
          {/* Danh sách bài viết sẽ render ở đây */}
          <p>Chưa có bài viết nào.</p>
        </div>
      </main>
    </>
  );
}
