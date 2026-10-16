# API Pulse - Web API Tester (GET, POST, PUT, DELETE)

Giao diện Web API Tester đa năng chạy trực tiếp trên trình duyệt, phong cách Dark Mode cao cấp (tương tự Postman / Insomnia thu nhỏ).

## 🚀 Hướng dẫn mở và sử dụng

### 1. Khởi chạy Backend API
Mở Visual Studio và bấm **F5** (hoặc mở terminal và gõ `dotnet run`).
- API sẽ chạy ở:
  - **HTTPS**: `https://localhost:7271`
  - **HTTP**: `http://localhost:5081`

### 2. Mở Giao diện Web Tester
- Chỉ cần nhấp đúp (Double-click) vào file `index.html` trong thư mục `api-tester-web/` để mở trên Google Chrome, Microsoft Edge, hoặc bất kỳ trình duyệt nào.
- Hoặc mở nhanh bằng lệnh trong PowerShell:
  ```powershell
  Start-Process "c:\Users\quang\source\repos\API app stt\api-tester-web\index.html"
  ```

---

## ⚡ Các tính năng nổi bật
1. **Thanh Presets (API mẫu của dự án)**:
   - `GET /api/courts`: Lấy tất cả danh sách sân.
   - `GET /api/courts?sportType=Badminton`: Lọc sân theo môn Cầu lông.
   - `GET /api/courts/1`: Xem chi tiết sân có ID = 1.
   - `POST /api/courts`: Thêm mới sân (tự động nạp Body JSON mẫu).
   - `PUT /api/courts/1`: Sửa thông tin sân ID = 1 (tự động nạp Body JSON cập nhật).
   - `DELETE /api/courts/1`: Xóa sân ID = 1.
2. **Đầy đủ 4 phương thức**: GET, POST, PUT, DELETE (và PATCH).
3. **Chuyển cổng nhanh**: Nút chuyển đổi nhanh giữa cổng **HTTPS (7271)** và **HTTP (5081)** ở góc trên.
4. **Body JSON Editor**: Hỗ trợ nút **Beautify JSON** (tự căn lề), mẫu dữ liệu nhanh và kiểm tra lỗi cú pháp JSON real-time.
5. **Đồng bộ Params**: Tự động đồng bộ 2 chiều giữa bảng Query Parameters và thanh địa chỉ URL.
6. **Lịch sử Request**: Tự động lưu 30 request gần nhất vào LocalStorage để bấm lại bất cứ lúc nào.
7. **Phím tắt**: Nhấn `Ctrl + Enter` (hoặc `Cmd + Enter`) để gửi request siêu nhanh.
8. **Dark / Light Mode**: Chuyển đổi giao diện sáng/tối linh hoạt.
