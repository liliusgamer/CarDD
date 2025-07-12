# DEVSHARE-LITE

## 📋 Tổng quan dự án

**DevShare Lite** là một nền tảng chia sẻ kiến thức và hỏi đáp dành cho cộng đồng IT. Đây là phiên bản nhẹ của một hệ thống forum với các chức năng cơ bản nhưng đầy đủ để phục vụ nhu cầu chia sẻ kiến thức và tương tác trong cộng đồng.

### 🚀 Các chức năng chính đã thực hiện:

- **🔐 Hệ thống xác thực**: Đăng ký, đăng nhập với JWT token
- **📝 Quản lý bài viết**: Tạo, chỉnh sửa, xóa bài viết với hỗ trợ draft
- **🏷️ Hệ thống tag**: Gắn tag cho bài viết để phân loại
- **💬 Bình luận**: Hỗ trợ bình luận và reply cho bài viết
- **👍 Like/Unlike**: Tương tác với bài viết
- **🔍 Tìm kiếm**: Tìm kiếm bài viết theo tiêu đề và nội dung
- **👤 Quản lý profile**: Cập nhật avatar và thông tin cá nhân
- **👨‍💼 Admin panel**: Quản lý người dùng cho admin
- **📱 Responsive UI**: Giao diện đẹp và thân thiện với mobile

## 🛠️ Công nghệ sử dụng

### Backend (Django)
- **Django 5.2.3**: Framework web chính
- **Django REST Framework**: API RESTful
- **Django CORS Headers**: Xử lý CORS cho frontend
- **djangorestframework-simplejwt**: JWT authentication
- **SQLite**: Database (phù hợp cho development)
- **Pillow**: Xử lý hình ảnh (avatar)

**Lý do lựa chọn:**
- Django cung cấp admin panel mạnh mẽ và bảo mật cao
- DRF hỗ trợ tốt cho việc xây dựng API
- JWT giúp xác thực stateless, phù hợp cho SPA

### Frontend (Next.js)
- **Next.js 15.3.4**: React framework với SSR/SSG
- **React 19.0.0**: UI library
- **Tailwind CSS 3.4.3**: Utility-first CSS framework
- **React Hot Toast**: Thông báo toast
- **React Icons**: Icon library
- **React Markdown**: Render markdown content

**Lý do lựa chọn:**
- Next.js cung cấp routing và optimization tốt
- Tailwind CSS giúp phát triển UI nhanh và responsive
- React 19 với các tính năng mới nhất

## 📁 Cấu trúc thư mục dự án

```
DevShare-Lite/
├── source_code/
│   ├── backend/                 # Django backend
│   │   ├── devshare/           # Django project settings
│   │   ├── forum/              # Main app với models, views, serializers
│   │   ├── media/              # Upload files (avatars)
│   │   ├── manage.py           # Django management script
│   │   └── db.sqlite3          # SQLite database
│   │
│   └── frontend/               # Next.js frontend
│       ├── app/                # App router (Next.js 13+)
│       │   ├── home/           # Trang chủ
│       │   ├── login/          # Trang đăng nhập
│       │   ├── register/       # Trang đăng ký
│       │   ├── post/           # Quản lý bài viết
│       │   ├── profile/        # Trang profile
│       │   └── admin/          # Admin panel
│       ├── components/         # Reusable components
│       ├── hooks/              # Custom React hooks
│       └── public/             # Static assets
```

## 🚀 Hướng dẫn cài đặt và khởi chạy

### Yêu cầu hệ thống
- Python 3.8+
- Node.js 18+
- npm hoặc yarn

### Bước 1: Clone dự án
```bash
git clone <repository-url>
cd DevShare-Lite
```

### Bước 2: Cài đặt Backend

```bash
cd source_code/backend

# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Cài đặt dependencies
pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers
pip install Pillow

# Tạo file requirements.txt
pip freeze > requirements.txt

# Chạy migrations
python manage.py makemigrations
python manage.py migrate

# Tạo superuser (admin)
python manage.py createsuperuser

# Chạy server
python manage.py runserver
```

Backend sẽ chạy tại: `http://localhost:8000`

### Bước 3: Cài đặt Frontend

```bash
cd source_code/frontend

# Cài đặt dependencies
npm install

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3000`

### Bước 4: Kiểm tra hoạt động

1. Truy cập `http://localhost:3000` để xem frontend
2. Truy cập `http://localhost:8000/admin` để vào Django admin
3. Đăng ký tài khoản mới hoặc sử dụng superuser đã tạo

## 🔧 Cấu hình môi trường

### Backend Environment Variables
Tạo file `.env` trong thư mục `backend/`:

```env
SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend Environment Variables
Tạo file `.env.local` trong thư mục `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 📊 Database Schema

Dự án sử dụng các model chính:

- **User**: Người dùng (extend từ Django User)
- **Post**: Bài viết với title, content, author, tags
- **Comment**: Bình luận với support reply
- **Tag**: Tag để phân loại bài viết
- **Profile**: Thông tin bổ sung cho user (avatar)
- **Like**: Tương tác like/unlike bài viết

## 🔐 API Endpoints

### Authentication
- `POST /api/register/` - Đăng ký
- `POST /api/token/` - Đăng nhập
- `GET /api/me/` - Thông tin user hiện tại

### Posts
- `GET /api/posts/` - Danh sách bài viết
- `POST /api/posts/` - Tạo bài viết
- `GET /api/posts/{id}/` - Chi tiết bài viết
- `PUT /api/posts/{id}/` - Cập nhật bài viết
- `DELETE /api/posts/{id}/` - Xóa bài viết
- `POST /api/posts/{id}/like/` - Like bài viết
- `POST /api/posts/{id}/unlike/` - Unlike bài viết

### Comments
- `GET /api/comments/` - Danh sách bình luận
- `POST /api/comments/` - Tạo bình luận

### Tags
- `GET /api/tags/` - Danh sách tags

### Profile
- `GET /api/profile/` - Thông tin profile
- `PUT /api/profile/` - Cập nhật profile

## 🎨 Tính năng UI/UX

- **Responsive Design**: Hoạt động tốt trên desktop và mobile
- **Modern UI**: Sử dụng Tailwind CSS với gradient và shadow
- **Toast Notifications**: Thông báo real-time
- **Loading States**: UX tốt với loading indicators
- **Search & Filter**: Tìm kiếm và lọc theo tag
- **Pagination**: Phân trang cho danh sách bài viết
<<<<<<< HEAD

## 🚀 Deployment

### Backend (Django)
```bash
# Production settings
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
STATIC_ROOT = '/path/to/static/'
MEDIA_ROOT = '/path/to/media/'

# Sử dụng PostgreSQL thay vì SQLite
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

### Frontend (Next.js)
```bash
# Build production
npm run build

# Start production server
npm start
```

## 🤝 Đóng góp

1. Fork dự án
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án này được phát hành dưới MIT License.

## 📞 Liên hệ

Nếu có câu hỏi hoặc góp ý, vui lòng tạo issue trên repository.

---

**DevShare Lite** - Nơi chia sẻ kiến thức, hỏi đáp và kết nối cộng đồng IT! 🚀
=======
>>>>>>> b54d03e0cddb1d5b86902f00276bc5f930b7ed86
