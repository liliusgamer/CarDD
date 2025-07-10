"use client";
import Logo from "../components/Logo";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="flex flex-col items-center gap-6 p-8 bg-white/80 rounded-2xl shadow-xl max-w-md w-full">
        <Logo />
        <h1 className="text-3xl font-bold text-center text-blue-700">Chào mừng đến với DevShare Lite</h1>
        <p className="text-center text-gray-600 mb-4">Nơi chia sẻ kiến thức, hỏi đáp và kết nối cộng đồng IT!</p>
        <div className="flex flex-col gap-4 w-full">
          <Link href="/login" className="w-full py-3 rounded-lg bg-blue-600 text-white text-lg font-semibold text-center shadow hover:bg-blue-700 transition">Đăng nhập</Link>
          <Link href="/register" className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-lg font-semibold text-center shadow hover:from-purple-600 hover:to-blue-600 transition">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
}
