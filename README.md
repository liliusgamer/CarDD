# DevShare Lite

## Thông tin tác giả
**- Tên trường**: ĐH Phenikaa
**- MSSV:** 23010541
**- Họ tên:** Lê Phạm Thành Đạt

## 📋 Tổng quan dự án

**DevShare Lite** là nền tảng chia sẻ kiến thức, hỏi đáp và kết nối cộng đồng IT. Sản phẩm tập trung vào trải nghiệm nhẹ, hiện đại, dễ sử dụng với các chức năng cốt lõi:
- Đăng ký/đăng nhập bảo mật (JWT)
- Tạo, chỉnh sửa, xóa bài viết (hỗ trợ Markdown, nháp)
- Hệ thống tag phân loại bài viết
- Bình luận lồng nhau, reply, chỉnh sửa, xóa
- Like/Unlike bài viết
- Tìm kiếm, lọc bài viết theo tag
- Quản lý profile cá nhân, avatar, tên hiển thị
- Admin panel quản lý user

## 🛠️ Công nghệ sử dụng

### Backend (Django)
- **Django 5.x**: Framework web mạnh mẽ, bảo mật, tích hợp sẵn admin panel
- **Django REST Framework**: Xây dựng API RESTful nhanh chóng
- **djangorestframework-simplejwt**: Xác thực JWT, stateless, phù hợp SPA
- **Django CORS Headers**: Hỗ trợ frontend-backend tách biệt
- **SQLite**: Database nhẹ, dễ setup cho dev
- **Pillow**: Xử lý ảnh (avatar)

**Lý do chọn Django:**
- Tích hợp sẵn admin, bảo mật tốt, dễ mở rộng
- DRF giúp tách biệt API, dễ phát triển frontend độc lập
- JWT phù hợp cho ứng dụng SPA, mobile

### Frontend (Next.js)
- **Next.js 15.x**: React framework hỗ trợ SSR/SSG, tối ưu SEO
- **React 19.x**: UI hiện đại, component-based
- **Tailwind CSS 3.x**: CSS utility-first, phát triển UI nhanh, responsive
- **React Hot Toast**: Thông báo realtime
- **React Icons**: Bộ icon đa dạng
- **React Markdown**: Render nội dung markdown

**Lý do chọn Next.js + Tailwind:**
- Routing, tối ưu SEO, build nhanh
- Tailwind giúp UI đẹp, responsive, dễ custom
- React 19 nhiều tính năng mới, tối ưu hiệu năng

## 📁 Cấu trúc thư mục dự án

```
source_code/
├── backend/                # Django backend
│   ├── devshare/           # Project settings, config
│   ├── forum/              # App chính: models, views, serializers, migrations
│   ├── media/              # Upload files (avatars)
│   ├── manage.py           # Django CLI
│   └── db.sqlite3          # Database
│
└── frontend/               # Next.js frontend
    ├── app/                # App router (Next.js 13+)
    │   ├── home/           # Trang chủ
    │   ├── login/          # Đăng nhập
    │   ├── register/       # Đăng ký
    │   ├── post/           # Quản lý bài viết
    │   ├── profile/        # Trang cá nhân
    │   └── admin/          # Admin panel
    ├── components/         # Reusable components
    ├── hooks/              # Custom React hooks
    └── public/             # Static assets (ảnh, icon)
```

## 🚀 Hướng dẫn cài đặt & khởi chạy

### Yêu cầu hệ thống
- Python 3.8+
- Node.js 18+
- npm hoặc yarn

### 1. Clone dự án
```bash
git clone <repository-url>
cd DevShare-Lite
```

### 2. Cài đặt Backend
```bash
cd source_code/backend
python -m venv venv
# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
# Cài dependencies
pip install -r requirements.txt
# Nếu chưa có requirements.txt:
pip install django djangorestframework djangorestframework-simplejwt django-cors-headers Pillow
pip freeze > requirements.txt
# Migrate database
python manage.py makemigrations
python manage.py migrate
# Tạo superuser (admin)
python manage.py createsuperuser
# Chạy server
python manage.py runserver
```
Backend chạy tại: http://localhost:8000

### 3. Cài đặt Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend chạy tại: http://localhost:3000

### 4. Cấu hình biến môi trường
- **Backend**: Tạo file `.env` trong `source_code/backend/`:
  ```env
  SECRET_KEY=your-secret-key
  DEBUG=True
  ALLOWED_HOSTS=localhost,127.0.0.1
  CORS_ALLOWED_ORIGINS=http://localhost:3000
  ```
- **Frontend**: Tạo file `.env.local` trong `source_code/frontend/`:
  ```env
  NEXT_PUBLIC_API_URL=http://localhost:8000
  ```

### 5. Truy cập & sử dụng
- Truy cập `http://localhost:3000` để sử dụng frontend
- Truy cập `http://localhost:8000/admin` để vào Django admin
- Đăng ký tài khoản mới hoặc dùng superuser để quản trị

---
