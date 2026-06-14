# MyDocs Collaborative Editor

## Tổng quan

MyDocs là một ứng dụng chỉnh sửa tài liệu cộng tác realtime. Dự án gồm hai phần chính:

- `backend/`: API server Express, MongoDB/Mongoose, JWT authentication, Hocuspocus realtime collaboration.
- `frontend/`: React application, routing, authentication UI, tài liệu và editor realtime bằng Tiptap.

## Kiến trúc chính

### Backend

- Express server với các route API dưới `/api`
- MongoDB qua Mongoose
- JWT cho xác thực người dùng
- Hocuspocus realtime server với Yjs để đồng bộ tài liệu theo cơ chế CRDT
- Lưu trạng thái Yjs (`yState`) vào MongoDB trong model `Document`

### Frontend

- React + `react-router-dom`
- Authentication flow cho login/register/forgot password
- Editor realtime dùng `@hocuspocus/provider` và `Tiptap`
- API wrapper bằng Axios
- Token JWT tự động thêm vào header Authorization

## Tính năng chính

### 1. Authentication

- Đăng ký tài khoản bằng username/email/password
- Xác thực OTP qua email khi đăng ký
- Đăng nhập bằng username/password
- Đăng nhập Google OAuth
- Quên mật khẩu và đặt lại mật khẩu bằng OTP email

### 2. Quản lý tài liệu

- Tạo tài liệu mới
- Xem danh sách tài liệu của chính mình
- Xem danh sách tài liệu được chia sẻ với mình
- Mở tài liệu theo ID
- Đổi tên tài liệu
- Xóa tài liệu

### 3. Folder / categories

- Hệ thống có thư mục mặc định:
  - `Tất cả tài liệu`
  - `Công việc`
  - `Học tập`
  - `Ghi chú`
- Người dùng có thể tạo thư mục tùy chỉnh
- Người dùng có thể xóa thư mục tùy chỉnh
- Tài liệu gắn với `folderId`
- Giao diện lọc tài liệu theo thư mục

### 4. Chia sẻ và phân quyền

- Chủ tài liệu có thể:
  - chia sẻ tài liệu với người dùng khác theo email
  - gán quyền `viewer` hoặc `editor`
  - bật/tắt chia sẻ bằng link
- Link chia sẻ cho phép người dùng khác truy cập và được thêm vào collaborator tự động
- Vai trò quy định:
  - `owner`: toàn quyền
  - `editor`: có thể chỉnh sửa
  - `viewer`: chỉ xem

### 5. Realtime collaboration

- Backend dùng `@hocuspocus/server` và `crossws` để tạo websocket realtime tại `/collaboration`
- Frontend dùng `HocuspocusProvider` để kết nối Yjs document
- Tài liệu đồng bộ realtime giữa các client
- Trạng thái kết nối hiển thị với các thông báo:
  - `Đang kết nối...`
  - `Đã kết nối`
  - `Đã đồng bộ tài liệu`
  - `Mất kết nối`
  - `Lỗi xác thực realtime`

## Luồng người dùng

### Trước khi đăng nhập

- Trang `Login`
- Trang `Register`
- Trang `ForgotPassword`
- Nếu đã đăng nhập, chuyển thẳng tới `/editor`

### Sau khi đăng nhập

- Người dùng vào trang chính `/editor`
- Sidebar hiển thị:
  - Tài liệu của tôi
  - Thư mục dự án
  - Đã chia sẻ với tôi
- Các hành động chính:
  - tạo tài liệu mới
  - mở tài liệu
  - xóa tài liệu
  - chuyển thư mục tài liệu
  - đổi tên tài liệu
  - bật chia sẻ link
  - đăng xuất

### Chỉnh sửa tài liệu

- Mở tài liệu và kết nối realtime
- Dùng trình soạn thảo Tiptap với Collaboration
- Nếu không có quyền edit, chỉ xem được nội dung
- Có thông báo xung đột và đồng bộ khi có thay đổi từ người khác

## Các endpoint API chính

### Auth

- `POST /api/auth/register`
- `POST /api/auth/verify-registration`
- `POST /api/auth/login`
- `POST /api/auth/google-login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Document

- `POST /api/documents` hoặc `POST /api/documents/create`
- `GET /api/documents`
- `GET /api/documents/shared-with-me`
- `GET /api/documents/:documentId`
- `PUT /api/documents/:documentId/title`
- `PUT /api/documents/:documentId/folder`
- `PUT /api/documents/:documentId/link-sharing`
- `POST /api/documents/:documentId/share`
- `DELETE /api/documents/:documentId`

### Folder

- `GET /api/folders`
- `POST /api/folders`
- `DELETE /api/folders/:folderId`

## Thành phần quan trọng trong code

### Backend

- `backend/server.js`
- `backend/controllers/authController.js`
- `backend/routes/auth.js`
- `backend/routes/document.js`
- `backend/routes/folder.js`
- `backend/middleWare/auth.js`
- `backend/models/User.js`
- `backend/models/Document.js`
- `backend/models/Folder.js`

### Frontend

- `frontend/src/App.jsx`
- `frontend/src/pages/Editor.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Register.jsx`
- `frontend/src/pages/ForgotPassword.jsx`
- `frontend/src/components/EditorComponent.jsx`
- `frontend/src/components/TiptapEditor.jsx`
- `frontend/src/services/api.js`

## Kết luận

Đây là một hệ thống soạn thảo tài liệu realtime hoàn chỉnh, với:

- quản lý người dùng và xác thực
- quản lý tài liệu và thư mục
- chia sẻ file và phân quyền
- chỉnh sửa cộng tác realtime bằng CRDT
- React UI thân thiện
