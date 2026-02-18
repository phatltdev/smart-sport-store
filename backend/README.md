# Smart Sport Store Backend API

API backend cho hệ thống thương mại điện tử bán đồ thể thao với tích hợp AI.

## Cấu trúc dự án

```
backend/
├── main.py                 # Entry point của ứng dụng FastAPI
├── config.py               # Cấu hình ứng dụng (MongoDB, JWT)
├── database.py             # Database connection management
├── requirements.txt        # Danh sách các dependencies
├── .env                    # Biến môi trường (không commit lên git)
├── models/                 # Data models
│   ├── __init__.py
│   └── user.py            # User models (UserCreate, UserLogin, UserResponse...)
├── routes/                # API routes
│   ├── __init__.py
│   └── auth.py            # Authentication endpoints (login, register)
├── services/              # Business logic
│   ├── __init__.py
│   └── user_service.py    # User service layer
└── utils/                 # Utility functions
    ├── __init__.py
    └── auth.py            # Authentication utilities (JWT, password hashing)
```

## Cài đặt

### 1. Tạo virtual environment (khuyến nghị)

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Cài đặt dependencies

```bash
pip install -r requirements.txt
```

### 3. Cấu hình biến môi trường

File `.env` đã được tạo với cấu hình sau:

```env
MONGODB_URL=mongodb+srv://lethanhphat439_db_user:Dr9LBvLGTEx0caUV@cluster0.txrsm0j.mongodb.net/?appName=Cluster0
DATABASE_NAME=smart_sport_db
SECRET_KEY=your-secret-key-here-change-this-in-production-smart-sport-store-2024
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Chạy ứng dụng

### Cách 1: Sử dụng uvicorn trực tiếp

```bash
cd backend
python main.py
```

### Cách 2: Sử dụng uvicorn command

```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server sẽ chạy tại `http://localhost:8000`

## API Documentation

### Swagger UI
Mở trình duyệt và truy cập: `http://localhost:8000/docs`

### ReDoc
Mở trình duyệt và truy cập: `http://localhost:8000/redoc`

## API Endpoints

### Authentication

#### 1. Register - Đăng ký tài khoản mới
- **Endpoint:** `POST /api/auth/register`
- **Request Body:**
```json
{
  "full_name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "date_of_birth": "2000-01-01T00:00:00",
  "gender": "male",
  "password": "password123"
}
```
- **Response:** `201 Created`
```json
{
  "id": "507f1f77bcf86cd799439011",
  "full_name": "Nguyễn Văn A",
  "email": "nguyenvana@example.com",
  "date_of_birth": "2000-01-01T00:00:00",
  "gender": "male",
  "is_admin": false,
  "created_at": "2024-01-01T00:00:00"
}
```

#### 2. Login - Đăng nhập
- **Endpoint:** `POST /api/auth/login`
- **Request Body:**
```json
{
  "email": "nguyenvana@example.com",
  "password": "password123"
}
```
- **Response:** `200 OK`
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "full_name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "date_of_birth": "2000-01-01T00:00:00",
    "gender": "male",
    "is_admin": false,
    "created_at": "2024-01-01T00:00:00"
  }
}
```

### Health Check

#### 3. Root Endpoint
- **Endpoint:** `GET /`
- **Response:**
```json
{
  "message": "Chào mừng đến với Smart Sport Store API!",
  "version": "1.0.0",
  "status": "running",
  "docs": "/docs"
}
```

#### 4. Health Check
- **Endpoint:** `GET /health`
- **Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

## Database Schema

### Collection: `user`

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| _id | ObjectId | Auto | User ID |
| full_name | String | Yes | Họ tên người dùng |
| email | String | Yes | Email (đã validate) |
| date_of_birth | DateTime | Yes | Ngày sinh |
| gender | String | Yes | Giới tính (male/female/other) |
| hashed_password | String | Yes | Mật khẩu đã được hash (bcrypt) |
| is_admin | Boolean | No | Là admin hay không (mặc định: false) |
| created_at | DateTime | Auto | Ngày tạo tài khoản |

## Các field validators

- **full_name:** Tối thiểu 2 ký tự, tối đa 100 ký tự
- **email:** Phải là email hợp lệ
- **password:** Tối thiểu 6 ký tự, tối đa 100 ký tự
- **gender:** Chỉ chấp nhận: `male`, `female`, hoặc `other`

## Security

- Mật khẩu được hash sử dụng bcrypt
- JWT token với thời gian hết hạn 30 phút (có thể cấu hình trong .env)
- CORS được bật cho phép truy cập từ mọi origin (cho development)

## Testing với cURL

### Register
```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Nguyễn Văn A",
    "email": "nguyenvana@example.com",
    "date_of_birth": "2000-01-01T00:00:00",
    "gender": "male",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nguyenvana@example.com",
    "password": "password123"
  }'
```

## Dependencies

- **fastapi:** Web framework hiện đại
- **uvicorn:** ASGI server
- **pymongo:** MongoDB driver cho Python
- **pydantic:** Data validation
- **python-jose:** JWT token handling
- **passlib:** Password hashing
- **python-dotenv:** Quản lý biến môi trường

## Development Notes

- MongoDB connection được quản lý theo pattern singleton
- Password được hash trước khi lưu vào database
- Token JWT được tạo khi user đăng nhập thành công
- ObjectId từ MongoDB được convert sang string khi trả về response

## TODO

- [ ] Add token refresh endpoint
- [ ] Add forgot password functionality
- [ ] Add email verification
- [ ] Add rate limiting
- [ ] Add product management APIs
- [ ] Add order management APIs
- [ ] Add AI recommendation endpoints