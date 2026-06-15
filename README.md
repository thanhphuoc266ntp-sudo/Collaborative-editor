# MyDocs Collaborative Editor

## Giới thiệu

MyDocs là một ứng dụng soạn thảo tài liệu cộng tác realtime, dành cho việc tạo, quản lý và chia sẻ nội dung văn bản trong môi trường nhóm. Ứng dụng kết hợp giữa giao diện React thân thiện với khả năng đồng bộ chỉnh sửa trực tuyến bằng công nghệ CRDT thông qua Yjs và Hocuspocus.

## Người thực hiện

- Nguyễn Thành Phước
- MSSV: 24521410
- Ngành: An toàn thông tin
- Dự án thực hiện cho mục đích học tập / đồ án lập trình web.

## Tính năng chính

- Đăng ký tài khoản với xác thực email bằng OTP
- Đăng nhập bằng username/password hoặc Google OAuth
- Khôi phục và đặt lại mật khẩu qua mã OTP email
- Tạo, đổi tên, xóa tài liệu
- Quản lý thư mục cá nhân và thư mục tùy chỉnh
- Chia sẻ tài liệu theo email với quyền `viewer` hoặc `editor`
- Chia sẻ tài liệu bằng liên kết công khai
- Xem tài liệu được chia sẻ với mình
- - Chỉnh sửa tài liệu cộng tác realtime với trạng thái đồng bộ, hiển thị tên và vị trí con trỏ của người dùng đang tham gia
## Kiến trúc dự án

- `backend/`
  - API server Express
  - MongoDB + Mongoose
  - JWT authentication
  - Realtime collaboration server với `@hocuspocus/server` và `Yjs`
- `frontend/`
  - React + React Router
  - Tiptap editor với `@tiptap/react`
  - Kết nối realtime bằng `@hocuspocus/provider`
  - Giao diện quản lý tài liệu, thư mục và chia sẻ

## Công nghệ sử dụng

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Yjs
- Hocuspocus
- React
- Tiptap
- Axios
- Google OAuth

## Cài đặt và chạy dự án

### Backend

1. Chuyển vào thư mục backend:

```bash
cd backend
```

2. Cài đặt phụ thuộc:

```bash
npm install
```

3. Tạo file `.env` và cấu hình các biến môi trường cần thiết:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `BREVO_API_KEY`

4. Chạy server backend:

```bash
npm start
```

### Frontend

1. Chuyển vào thư mục frontend:

```bash
cd frontend
```

2. Cài đặt phụ thuộc:

```bash
npm install
```

3. Tạo file `.env` với các biến môi trường như:

- `VITE_API_URL`
- `VITE_COLLAB_URL`
- `VITE_GOOGLE_CLIENT_ID`

4. Chạy ứng dụng frontend:

```bash
npm run dev
```

### Chạy đồng thời cả frontend và backend

Từ thư mục gốc dự án:

```bash
npm install
npm run dev
```

## Chú ý

- Cần cấu hình đúng `VITE_COLLAB_URL` để frontend kết nối được tới realtime collaboration server.
- Backend cần có `JWT_SECRET` và các thông tin email/Google OAuth hợp lệ để xác thực và gửi OTP.

## Cấu trúc thư mục chính

- `backend/`
  - `server.js`
  - `routes/`
  - `controllers/`
  - `models/`
  - `middleWare/`
- `frontend/`
  - `src/`
  - `src/pages/`
  - `src/components/`
  - `src/services/`

## Liên hệ

- Địa chỉ email: 24521410@gm.uit.edu.vn
