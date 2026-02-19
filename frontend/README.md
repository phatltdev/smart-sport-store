# Smart Sport Store - Frontend

Frontend của Smart Sport Store được xây dựng bằng Next.js 14 với TypeScript và Tailwind CSS.

## Các tính năng

- Form đăng ký tài khoản với các thông tin:
  - Họ tên
  - Giới tính (Nam/Nữ/Khác)
  - Ngày sinh
  - Email (dùng làm tên đăng nhập)
  - Mật khẩu (tối thiểu 6 ký tự)
  - Xác nhận mật khẩu
- Validation form ở cả client và server
- Giao diện đẹp mắt với Tailwind CSS
- Mật khẩu được hash tự động bởi backend

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

Để chạy ở chế độ development:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại http://localhost:3000

## Cấu hình

### API Endpoint

Frontend sẽ gọi API đến backend tại `http://localhost:8000` theo mặc định.

Bạn có thể thay đổi URL này bằng cách tạo file `.env.local`:

```
NEXT_PUBLIC_API_URL=http://your-backend-url
```

## Cấu trúc dự án

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Layout chính
│   │   ├── globals.css   # Global styles
│   │   └── register/     # Trang đăng ký
│   │       └── page.tsx
│   ├── components/       # Các component
│   │   └── RegisterForm.tsx
│   ├── lib/              # Các hàm tiện ích
│   │   └── api.ts        # API client
│   └── types/            # TypeScript types
│       └── user.ts
├── public/               # Static assets
└── package.json
```

## Truy cập trang đăng ký

Sau khi chạy ứng dụng, truy cập: http://localhost:3000/register

## Lưu ý quan trọng

1. **Backend phải đang chạy**: Trước khi sử dụng frontend, đảm bảo backend đã được khởi động và đang chạy tại `http://localhost:8000`

2. **CORS đã được cấu hình**: Backend đã cấu hình CORS để cho phép frontend truy cập API

3. **Mật khẩu được hash**: Backend sẽ tự động hash mật khẩu bằng bcrypt trước khi lưu vào database, không cần xử lý ở frontend

## Xây dựng production

```bash
npm run build
```

## Chạy production build

```bash
npm start
```

## Linting

```bash
npm run lint