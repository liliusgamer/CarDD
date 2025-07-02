import Header from "../../components/Header";

export default function LoginPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
        <h2>Đăng nhập</h2>
        <form>
          <input type="email" placeholder="Email" required style={{ width: '100%', padding: 8, margin: '8px 0' }} />
          <input type="password" placeholder="Mật khẩu" required style={{ width: '100%', padding: 8, margin: '8px 0' }} />
          <button type="submit" style={{ width: '100%', padding: 8, margin: '8px 0' }}>Đăng nhập</button>
        </form>
      </main>
    </>
  );
} 