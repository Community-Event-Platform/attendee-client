# EventHub — Attendee Client

Mô tả
-
Frontend dành cho người tham dự (attendee) của nền tảng EventHub. Ứng dụng được xây dựng bằng React + Vite, dùng Tailwind/Bootstrap cho giao diện, kết nối đến API Laravel của dự án.

Tính năng chính
-
- Hiển thị danh sách sự kiện, tìm kiếm và lọc theo danh mục
- Xem chi tiết sự kiện, đăng ký tham dự và trạng thái đăng ký
- Xác thực người dùng (OAuth / local auth) và quản lý phiên
- Thông báo và danh sách thông báo cho người dùng

Tech stack
-
- React (v19) + Vite
- TailwindCSS / Bootstrap
- Axios để gọi API
- Zustand cho state management (nếu có)

Yêu cầu môi trường
-
- Node.js 18+ và npm
- Một backend API sẵn có (ví dụ: https://api.example.com)

Cài đặt & chạy (phát triển)
-
1. Cài phụ thuộc:

```bash
npm install
```

2. Tạo file môi trường `.env` (copy từ `.env.example` nếu có) và chỉnh `VITE_API_URL`:

```env
# Đặt endpoint API (ví dụ: https://api.example.com). KHÔNG commit giá trị thật.
VITE_API_URL=<API_BASE_URL>
```

3. Chạy dev server:

```bash
npm run dev
```

Lệnh hữu ích
-
- `npm run dev` — chạy môi trường phát triển (HMR)
- `npm run build` — build production
- `npm run preview` — preview build
- `npm run lint` — chạy ESLint

Hướng dẫn build và deploy
-
- Xây dựng tĩnh: `npm run build` sẽ tạo thư mục `dist/`.
- Triển khai `dist/` lên hosting tĩnh hoặc phục vụ thông qua backend (ví dụ: Laravel `public/` hoặc Nginx).

Tài nguyên & liên kết
-
- API docs / Postman collection: xem `community-event-api/Community Event Platform.postman_collection.json`
- Thiết kế (Figma): (nếu có, thêm link tại đây)

Đóng góp
-
1. Fork → tạo branch tính năng → PR vào `main` (chỉ merge lên `main` sau review).
2. Tuân thủ quy tắc lint và format trước khi mở PR.

Liên hệ
-
Nếu cần trợ giúp, liên hệ với nhóm dự án hoặc mở issue trong kho chứa.

License
-
Miễn trừ trách nhiệm: kiểm tra file `LICENSE` (nếu có) hoặc mặc định sử dụng MIT.
