# 🏃 Sport Shop - Trang Web Bán Hàng Thể Thao

Dự án trang web bán hàng thể thao được xây dựng với Next.js 14, React 18, TypeScript và Tailwind CSS.

## ✨ Tính năng

- 🎨 Giao diện hiện đại, responsive
- 🔍 Tìm kiếm sản phẩm bằng văn bản
- 📸 Tìm kiếm sản phẩm bằng hình ảnh (Image Search)
- 📜 Infinite Scroll - Tự động tải thêm sản phẩm khi cuộn xuống
- 🛒 Giỏ hàng
- ⭐ Hiển thị đánh giá và số lượng đã bán
- 🏷️ Phân loại sản phẩm theo danh mục
- 💰 Hiển thị giá và giảm giá

## 🚀 Cài đặt và Chạy dự án

### Yêu cầu

- Node.js 18.0 trở lên
- npm hoặc yarn

### Các bước cài đặt

1. Cài đặt các dependencies:

```bash
npm install
```

2. Chạy server development:

```bash
npm run dev
```

3. Mở trình duyệt và truy cập:

```
http://localhost:3000
```

### Các lệnh khác

```bash
# Build production
npm run build

# Chạy production
npm start

# Lint code
npm run lint
```

## 📁 Cấu trúc dự án

```
the_thao_fe/
├── app/                      # App directory (Next.js 14)
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # React components
│   ├── Header.tsx           # Header với search bar
│   ├── ImageSearchModal.tsx # Modal tìm kiếm bằng hình ảnh
│   ├── ProductList.tsx      # Danh sách sản phẩm với infinite scroll
│   └── ProductCard.tsx      # Card hiển thị sản phẩm
├── public/                  # Static files
│   └── images/              # Thư mục chứa hình ảnh
│       └── image1.jpg       # Hình ảnh mẫu
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.js       # Tailwind CSS config
├── next.config.js           # Next.js config
└── README.md               # Tài liệu này
```

## 🎯 Tính năng chi tiết

### 1. Tìm kiếm bằng văn bản
- Ô tìm kiếm ở header
- Sẵn sàng kết nối với API backend

### 2. Tìm kiếm bằng hình ảnh
- Click vào nút "Tìm bằng ảnh" trên header
- Kéo thả hoặc chọn file hình ảnh
- Hệ thống sẽ tìm sản phẩm tương tự (sẵn sàng kết nối API)

### 3. Infinite Scroll
- Tự động tải thêm 12 sản phẩm khi cuộn gần cuối trang
- Loading indicator khi đang tải
- Hiển thị thông báo khi hết sản phẩm

### 4. Hiển thị sản phẩm
- Grid responsive: 1-4 cột tùy theo kích thước màn hình
- Hình ảnh sản phẩm với hiệu ứng hover
- Giá, giảm giá, đánh giá, số lượng đã bán
- Nút thêm vào giỏ hàng

## 🔌 Tích hợp Backend

Dự án đã chuẩn bị sẵn các điểm tích hợp với backend API:

### API endpoints cần implement:

1. **GET /api/products** - Lấy danh sách sản phẩm
   - Query params: `page`, `limit`
   - Response: Array of products

2. **POST /api/search/text** - Tìm kiếm bằng văn bản
   - Body: `{ query: string }`
   - Response: Array of products

3. **POST /api/search/image** - Tìm kiếm bằng hình ảnh
   - Body: FormData with image file
   - Response: Array of similar products

4. **POST /api/cart/add** - Thêm vào giỏ hàng
   - Body: `{ productId: number, quantity: number }`
   - Response: Cart data

### Cách kết nối:

Tìm các comment `// TODO:` trong code để biết vị trí cần thêm API calls:
- `components/Header.tsx` - Text search
- `components/ImageSearchModal.tsx` - Image search
- `components/ProductList.tsx` - Load products
- `components/ProductCard.tsx` - Add to cart

## 🎨 Customization

### Thay đổi màu sắc chủ đạo:

Edit file `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Thay đổi các màu tại đây
      }
    }
  }
}
```

### Thay đổi số lượng sản phẩm mỗi trang:

Edit `components/ProductList.tsx`:

```typescript
const PRODUCTS_PER_PAGE = 12 // Thay đổi số này
```

## 📝 Ghi chú

- Hiện tại sử dụng dữ liệu mock với hình ảnh `image1.jpg` cho tất cả sản phẩm
- Khi backend API sẵn sàng, thay thế các TODO comments bằng API calls thực tế
- Tất cả components đều là client components (`'use client'`) để hỗ trợ interactive features

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Image Optimization**: next/image

## 📞 Hỗ trợ

Nếu gặp vấn đề khi cài đặt hoặc chạy dự án, vui lòng kiểm tra:

1. Node.js version >= 18.0
2. Đã chạy `npm install` thành công
3. Port 3000 không bị chiếm dụng

---

**Happy Coding! 🚀**

