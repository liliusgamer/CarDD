import Header from "../../components/Header";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
        <h2>Đăng ký</h2>
        <form>
          <input type="text" placeholder="Tên của bạn" required style={{ width: '100%', padding: 8, margin: '8px 0' }} />
          <input type="email" placeholder="Email" required style={{ width: '100%', padding: 8, margin: '8px 0' }} />
          <input type="password" placeholder="Mật khẩu" required style={{ width: '100%', padding: 8, margin: '8px 0' }} />
          <button type="submit" style={{ width: '100%', padding: 8, margin: '8px 0' }}>Đăng ký</button>
        </form>
      </main>
    </>
  );
} 