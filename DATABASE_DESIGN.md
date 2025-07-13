# THIẾT KẾ CƠ SỞ DỮ LIỆU - DEVSHARE LITE

## 📊 Tổng quan

DevShare Lite sử dụng **SQLite** làm cơ sở dữ liệu quan hệ (RDBMS) với Django ORM. SQLite được lựa chọn vì tính đơn giản, hiệu suất tốt cho ứng dụng vừa và nhỏ, và không cần cài đặt server database riêng biệt.

## 🗄️ Sơ đồ quan hệ thực thể (ERD)

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      User       │    │     Profile     │    │      Post       │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄───┤ user (FK)       │    │ id (PK)         │
│ username        │    │ display_name    │    │ title           │
│ email           │    │ avatar          │    │ content         │
│ password        │    └─────────────────┘    │ author (FK)     │
│ is_staff        │                           │ is_draft        │
│ is_superuser    │                           │ created_at      │
│ date_joined     │                           │ updated_at      │
└─────────────────┘                           └─────────────────┘
                                                       │
                                                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Tag        │    │   Post_Tags     │    │    Comment      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │◄───┤ post_id (FK)    │    │ id (PK)         │
│ name            │    │ tag_id (FK)     │    │ post (FK)       │
└─────────────────┘    └─────────────────┘    │ author (FK)     │
                                              │ content         │
                                              │ parent (FK)     │
                                              │ created_at      │
                                              │ updated_at      │
                                              └─────────────────┘
                                                       │
                                                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Like       │    │   User_Posts    │    │  User_Comments  │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ user_id (FK)    │    │ user_id (FK)    │
│ post (FK)       │    │ post_id (FK)    │    │ comment_id (FK) │
│ user (FK)       │    └─────────────────┘    └─────────────────┘
│ created_at      │
└─────────────────┘
```

## 📋 Chi tiết các bảng

### 1. **User** (Django Auth User)
Bảng người dùng cơ bản từ Django Auth System.

| Trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|--------|-------------|-------|-----------|
| `id` | Integer | Khóa chính | PK, Auto Increment |
| `username` | CharField(150) | Tên đăng nhập | Unique, Not Null |
| `email` | EmailField | Email người dùng | Not Null |
| `password` | CharField | Mật khẩu (hashed) | Not Null |
| `is_staff` | Boolean | Quyền admin | Default: False |
| `is_superuser` | Boolean | Superuser | Default: False |
| `date_joined` | DateTimeField | Ngày tạo tài khoản | Auto Now Add |

**Quy tắc username:**
- Chỉ chứa chữ cái, số, dấu gạch dưới (`[a-zA-Z0-9_]`)
- Độ dài 3-30 ký tự
- Không được trùng lặp

### 2. **Profile**
Bảng mở rộng thông tin người dùng.

| Trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|--------|-------------|-------|-----------|
| `id` | Integer | Khóa chính | PK, Auto Increment |
| `user` | OneToOneField | Liên kết với User | FK, Unique |
| `display_name` | CharField(100) | Tên hiển thị | Optional, Blank |
| `avatar` | ImageField | Ảnh đại diện | Optional, Upload to 'avatars/' |

**Mối quan hệ:**
- `Profile.user` → `User.id` (One-to-One)

### 3. **Post**
Bảng bài viết chính.

| Trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|--------|-------------|-------|-----------|
| `id` | Integer | Khóa chính | PK, Auto Increment |
| `title` | CharField(255) | Tiêu đề bài viết | Not Null |
| `content` | TextField | Nội dung bài viết | Not Null |
| `author` | ForeignKey | Tác giả bài viết | FK → User, Not Null |
| `is_draft` | Boolean | Trạng thái nháp | Default: False |
| `created_at` | DateTimeField | Ngày tạo | Auto Now Add |
| `updated_at` | DateTimeField | Ngày cập nhật | Auto Now |

**Mối quan hệ:**
- `Post.author` → `User.id` (Many-to-One)

### 4. **Tag**
Bảng tag để phân loại bài viết.

| Trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|--------|-------------|-------|-----------|
| `id` | Integer | Khóa chính | PK, Auto Increment |
| `name` | CharField(50) | Tên tag | Unique, Not Null |

### 5. **Post_Tags** (Many-to-Many)
Bảng trung gian liên kết Post và Tag.

| Trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|--------|-------------|-------|-----------|
| `post_id` | Integer | ID bài viết | FK → Post |
| `tag_id` | Integer | ID tag | FK → Tag |

**Mối quan hệ:**
- `Post.tags` ↔ `Tag.posts` (Many-to-Many)

### 6. **Comment**
Bảng bình luận cho bài viết.

| Trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|--------|-------------|-------|-----------|
| `id` | Integer | Khóa chính | PK, Auto Increment |
| `post` | ForeignKey | Bài viết được bình luận | FK → Post, Not Null |
| `author` | ForeignKey | Tác giả bình luận | FK → User, Not Null |
| `content` | TextField | Nội dung bình luận | Not Null |
| `parent` | ForeignKey | Bình luận cha (reply) | FK → Comment, Optional |
| `created_at` | DateTimeField | Ngày tạo | Auto Now Add |
| `updated_at` | DateTimeField | Ngày cập nhật | Auto Now |

**Mối quan hệ:**
- `Comment.post` → `Post.id` (Many-to-One)
- `Comment.author` → `User.id` (Many-to-One)
- `Comment.parent` → `Comment.id` (Self-referencing, Many-to-One)

### 7. **Like**
Bảng tương tác like/unlike bài viết.

| Trường | Kiểu dữ liệu | Mô tả | Ràng buộc |
|--------|-------------|-------|-----------|
| `id` | Integer | Khóa chính | PK, Auto Increment |
| `post` | ForeignKey | Bài viết được like | FK → Post, Not Null |
| `user` | ForeignKey | User like bài viết | FK → User, Not Null |
| `created_at` | DateTimeField | Ngày like | Auto Now Add |

**Mối quan hệ:**
- `Like.post` → `Post.id` (Many-to-One)
- `Like.user` → `User.id` (Many-to-One)
- **Unique Constraint**: `(post, user)` - Một user chỉ like một bài viết một lần

## 🔗 Các mối quan hệ chính

### 1. **User - Profile** (One-to-One)
```sql
-- Mỗi user có một profile
User (1) ←→ (1) Profile
```

### 2. **User - Post** (One-to-Many)
```sql
-- Một user có thể tạo nhiều bài viết
User (1) ←→ (N) Post
```

### 3. **User - Comment** (One-to-Many)
```sql
-- Một user có thể viết nhiều bình luận
User (1) ←→ (N) Comment
```

### 4. **Post - Tag** (Many-to-Many)
```sql
-- Một bài viết có thể có nhiều tag, một tag có thể thuộc nhiều bài viết
Post (N) ←→ (N) Tag
```

### 5. **Post - Comment** (One-to-Many)
```sql
-- Một bài viết có thể có nhiều bình luận
Post (1) ←→ (N) Comment
```

### 6. **Comment - Comment** (Self-referencing)
```sql
-- Bình luận có thể reply bình luận khác
Comment (1) ←→ (N) Comment (parent-child)
```

### 7. **User - Like** (Many-to-Many)
```sql
-- User có thể like nhiều bài viết, bài viết có thể được nhiều user like
User (N) ←→ (N) Post (thông qua bảng Like)
```

## 🎯 Lý do lựa chọn SQLite

### ✅ Ưu điểm:
1. **Đơn giản**: Không cần cài đặt server database riêng
2. **Hiệu suất**: Tốt cho ứng dụng vừa và nhỏ
3. **Portable**: File database có thể di chuyển dễ dàng
4. **ACID**: Đảm bảo tính toàn vẹn dữ liệu
5. **Django Support**: Hỗ trợ tốt với Django ORM

### ❌ Nhược điểm:
1. **Concurrent Access**: Hạn chế khi nhiều user cùng ghi
2. **Scalability**: Không phù hợp cho ứng dụng lớn
3. **Network Access**: Không thể truy cập từ xa

## 🔒 Bảo mật và Quyền truy cập

### 1. **Authentication**
- Sử dụng JWT (JSON Web Token) cho xác thực
- Token có thời hạn và có thể refresh

### 2. **Authorization**
- **Public**: Xem bài viết công khai, đăng ký, đăng nhập
- **Authenticated**: Tạo/sửa/xóa bài viết, bình luận, like
- **Staff**: Quản lý user, xem tất cả bài viết (kể cả draft)

### 3. **Data Protection**
- Password được hash bằng Django's password hashers
- Avatar upload được validate và sanitize
- SQL injection được ngăn chặn bởi Django ORM

## 📈 Indexes và Performance

### 1. **Primary Indexes**
- `User.id` (Auto)
- `Post.id` (Auto)
- `Comment.id` (Auto)
- `Tag.id` (Auto)

### 2. **Foreign Key Indexes**
- `Post.author_id`
- `Comment.post_id`
- `Comment.author_id`
- `Like.post_id`
- `Like.user_id`

### 3. **Unique Indexes**
- `User.username`
- `Tag.name`
- `Like.post_id + Like.user_id` (Composite)

### 4. **Search Indexes**
- `Post.title` (Full-text search)
- `Post.content` (Full-text search)
- `Post.created_at` (Sorting)

## 🔄 Migration History

```
0001_initial.py          - Tạo bảng Post
0002_tag_post_tags.py    - Tạo bảng Tag và Post-Tags
0003_comment.py          - Tạo bảng Comment
0004_comment_updated_at.py - Thêm updated_at cho Comment
0005_comment_parent.py   - Thêm parent cho Comment (reply)
0006_profile.py          - Tạo bảng Profile
0007_like.py             - Tạo bảng Like
0008_profile_display_name.py - Thêm display_name cho Profile
```

## 🚀 Kế hoạch mở rộng

### 1. **Short-term**
- Thêm bảng `Notification` cho thông báo
- Thêm bảng `Bookmark` cho bookmark bài viết
- Thêm bảng `Report` cho báo cáo nội dung

### 2. **Long-term**
- Chuyển sang PostgreSQL cho production
- Thêm Elasticsearch cho tìm kiếm nâng cao
- Thêm Redis cho caching
- Thêm bảng `Category` cho phân loại bài viết
