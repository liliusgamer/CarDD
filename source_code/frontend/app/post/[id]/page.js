import Header from "../../../components/Header";

export default function PostDetailPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
        <h2>Tiêu đề bài viết</h2>
        <div style={{ margin: '16px 0', color: '#666' }}>
          <span>Tag1, Tag2</span>
        </div>
        <article style={{ marginBottom: 32 }}>
          <p>Nội dung bài viết sẽ hiển thị ở đây (Markdown hỗ trợ).</p>
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
      </main>
    </>
  );
} 