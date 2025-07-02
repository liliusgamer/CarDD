import Header from "../../../components/Header";

export default function CreatePostPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h2>Tạo bài viết mới</h2>
        <form>
          <input type="text" placeholder="Tiêu đề bài viết" required style={{ width: '100%', padding: 8, margin: '8px 0' }} />
          <textarea placeholder="Nội dung (Markdown hỗ trợ)" required rows={8} style={{ width: '100%', padding: 8, margin: '8px 0' }} />
          <input type="text" placeholder="Tags (cách nhau bởi dấu phẩy)" style={{ width: '100%', padding: 8, margin: '8px 0' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={{ flex: 1, padding: 8 }}>Lưu nháp</button>
            <button type="submit" style={{ flex: 1, padding: 8 }}>Đăng bài</button>
          </div>
        </form>
      </main>
    </>
  );
} 