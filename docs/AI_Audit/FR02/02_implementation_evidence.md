# FR-02 — Implementation Evidence

## 1. Relevant Files

| File | Role | Relevant area |
|---|---|---|
| `backend/server.js` | Backend API | Route `POST /api/login` (lines 32-66), middleware `authenticateToken` (lines 100-110), route `GET /api/users/me` (lines 112-116). |
| `backend/database.js` | Database Schema & Seed | Bảng `users` (lines 50-61), seed accounts (lines 91-94). |
| `frontend-web/src/context/AuthContext.jsx` | Frontend State | Context quản lý `user`, `token`, `login`, `logout`, cấu hình Axios Authorization header (lines 1-51). |
| `frontend-web/src/pages/Login.jsx` | Frontend UI | Màn hình đăng nhập Web: form submit, input fields, error handling (lines 1-70). |
| `frontend-web/src/App.jsx` | Frontend Routing & Layout | Khai báo route `/login` (line 52), Header hiển thị trạng thái đăng nhập / nút "Thoát" (lines 15-39). |
| `frontend-admin/src/App.jsx` | Admin Frontend UI & Auth | Màn hình Admin login (lines 188-215), hàm `handleLogin` (lines 61-74), logout (lines 264-272). |

## 2. Frontend Evidence

### 2.1 Routes / Pages

- Route Web: `/login` trỏ tới component `Login` (`frontend-web/src/App.jsx:52`).
- Chuyển hướng thành công: `navigate('/')` chuyển về trang chủ (`frontend-web/src/pages/Login.jsx:16`).
- Giao diện Admin: Khi chưa có token (`!token`), hiển thị form đăng nhập tại chỗ thay vì chuyển route riêng (`frontend-admin/src/App.jsx:188-215`).

### 2.2 UI Elements

| Element | Selector / Text / Identifier | Behavior | Evidence |
|---|---|---|---|
| Tiêu đề Form Web | `h2.text-2xl` với text `"Đăng Ký"` | Hiển thị tiêu đề là "Đăng Ký" (thay vì "Đăng nhập") | `frontend-web/src/pages/Login.jsx:24` |
| Label Email Web | `label` với text `"Username"` | Nhãn hiển thị là "Username" | `frontend-web/src/pages/Login.jsx:28` |
| Input Email Web | `input[type="text"]` liên kết state `email` | `type="text"` (không phải `type="email"`), có thuộc tính `required` | `frontend-web/src/pages/Login.jsx:29-35` |
| Label Password Web | `label` với text `"Mật khẩu"` | Nhãn hiển thị là "Mật khẩu" | `frontend-web/src/pages/Login.jsx:38` |
| Input Password Web | `input[type="text"]` liên kết state `password` | `type="text"` (mật khẩu bị hiển thị dạng rõ/plain-text, không phải `type="password"`), có `required` | `frontend-web/src/pages/Login.jsx:39-45` |
| Link Quên mật khẩu Web | `a[href="/forgot-password"]` với text `"Quên mật khẩu?"` | Điều hướng sang trang quên mật khẩu | `frontend-web/src/pages/Login.jsx:50` |
| Button Submit Web | `button[type="submit"]` với text `"Sign In"` | Gửi form đăng nhập, class `bg-blue-600 text-white`, `tabIndex={1}` | `frontend-web/src/pages/Login.jsx:53-59` |
| Link Đăng ký Web | `Link[to="/register"]` với text `"Đăng ký ngay"` | Điều hướng sang trang đăng ký | `frontend-web/src/pages/Login.jsx:62` |
| Error Box Web | `div.bg-red-100.text-red-700` | Nằm **dưới** nút submit (`Login.jsx:66`), hiển thị text cố định `"Đăng nhập thất bại. Vui lòng kiểm tra lại."` | `frontend-web/src/pages/Login.jsx:18,66` |
| Header User Greeting Web | `span` chứa HTML `"Chào, ${user.name}"` | Hiển thị tên người dùng đã đăng nhập trong Navbar | `frontend-web/src/App.jsx:27` |
| Button Logout Web | `button.bg-red-500` với text `"Thoát"` | Đăng xuất người dùng (nhãn là "Thoát", không phải "Đăng xuất") | `frontend-web/src/App.jsx:29` |
| Tiêu đề Form Admin | `h2` với text `"Admin Login"` | Tiêu đề form đăng nhập admin | `frontend-admin/src/App.jsx:195` |
| Input Email Admin | `input[placeholder="Email"]` (mặc định type text) | Nhập email đăng nhập admin | `frontend-admin/src/App.jsx:197-201` |
| Input Password Admin | `input[type="password"][placeholder="Password"]` | Nhập mật khẩu admin | `frontend-admin/src/App.jsx:202-208` |
| Button Login Admin | `button.bg-blue-600` với text `"Login"` | Submit form admin login | `frontend-admin/src/App.jsx:209-211` |

### 2.3 User Interaction

| Action | Preconditions | Behavior | Evidence |
|---|---|---|---|
| Nhập Email & Mật khẩu và click "Sign In" (Web) | Form có input | Gọi `login(email, password)`. Nếu thành công chuyển hướng về `/`. Nếu lỗi, hiển thị thông báo lỗi dưới form. | `frontend-web/src/pages/Login.jsx:12-20` |
| Click "Thoát" trên Header (Web) | Đã đăng nhập (`user !== null`) | Gọi `logout()`, xóa token trong `localStorage`, reset `user = null`, `token = null`, xóa header `Authorization` của Axios. | `frontend-web/src/context/AuthContext.jsx:37-41`, `frontend-web/src/App.jsx:29` |
| Nhập thông tin và click "Login" (Admin) | Chưa đăng nhập (`!token`) | Gọi `POST /api/login`. Kiểm tra `res.data.user.role !== "admin"`. Nếu không phải admin thì `alert("Bạn không phải là admin!")`. Nếu là admin, lưu `adminToken` vào `localStorage`. Nếu thất bại `alert("Đăng nhập thất bại")`. | `frontend-admin/src/App.jsx:61-74` |
| Click "Đăng xuất" trên Sidebar (Admin) | Đã đăng nhập admin | Xóa state `token = ""` và xóa `adminToken` trong `localStorage`. | `frontend-admin/src/App.jsx:264-271` |

### 2.4 Client-side Validation / State

| Behavior | Evidence |
|---|---|
| Thuộc tính `required` trên input email và password của Web form | `frontend-web/src/pages/Login.jsx:34,44` |
| Format validation trên Web: Không có regex hoặc type="email"; dùng `type="text"` | `frontend-web/src/pages/Login.jsx:30,40` |
| Quản lý state token Web: Lưu `localStorage.getItem("token")` và `localStorage.setItem("token", res.data.token)` | `frontend-web/src/context/AuthContext.jsx:8,32` |
| Quản lý state token Admin: Lưu `localStorage.getItem("adminToken")` và `localStorage.setItem("adminToken", res.data.token)` | `frontend-admin/src/App.jsx:7,70` |
| Ẩn thông báo lỗi backend: Web `catch` block gán cứng text `"Đăng nhập thất bại. Vui lòng kiểm tra lại."`, bỏ qua nội dung lỗi (kể cả lỗi 403 khóa tài khoản) từ server | `frontend-web/src/pages/Login.jsx:17-19` |

## 3. Backend Evidence

### 3.1 API Endpoints

| Method | Endpoint | Input | Response | Evidence |
|---|---|---|---|---|
| `POST` | `/api/login` | Body JSON: `{ "email": string, "password": string }` | Thành công (200): `{ message: "Login successful", token: string, user: object }`<br>Sai thông tin (401): `{ error: "Invalid email or password" }`<br>Bị khóa (403): `{ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." }`<br>Lỗi DB (500): `{ error: string }` | `backend/server.js:32-66` |
| `GET` | `/api/users/me` | Header: `Authorization: Bearer <token>` | Thành công (200): User record JSON từ bảng `users`<br>Chưa đăng nhập (401): `{ error: "Unauthorized" }`<br>Token không hợp lệ (403): `{ error: "Forbidden" }` | `backend/server.js:100-116` |

### 3.2 Business Logic

| Rule | Implementation | Evidence |
|---|---|---|
| Tìm kiếm tài khoản | Truy vấn CSDL bằng email: `SELECT * FROM users WHERE email = ?` | `backend/server.js:35` |
| Kiểm tra tài khoản tồn tại | Nếu không tìm thấy user: trả về HTTP 401 `{ error: "Invalid email or password" }` | `backend/server.js:37-38` |
| Kiểm tra trạng thái khóa | So sánh thời gian hiện tại với `locked_until`: `if (user.locked_until && new Date() < new Date(user.locked_until))` → trả HTTP 403 `{ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." }` | `backend/server.js:40-44` |
| So khớp mật khẩu | So sánh trực tiếp chuỗi thuần: `user.password === password` (không băm/hash) | `backend/server.js:46` |
| Xử lý khi đăng nhập thành công | Reset trạng thái: `UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?`. Ký JWT token: `jwt.sign({ id: user.id, role: user.role }, SECRET_KEY)`. Trả về HTTP 200 kèm `token` và `user`. | `backend/server.js:47-52` |
| Xử lý khi đăng nhập thất bại (Logic tăng bộ đếm) | Tăng bộ đếm thêm **2** đơn vị: `const newAttempts = user.login_attempts + 2;` | `backend/server.js:54` |
| Ngưỡng khóa tài khoản & thời gian khóa | Nếu `newAttempts >= 3`, đặt `lockedUntil = new Date(Date.now() + 180000).toISOString()` (khóa trong **180,000 ms = 3 phút**). Cập nhật DB: `UPDATE users SET login_attempts = ?, locked_until = ? WHERE id = ?`. Trả HTTP 401 `{ error: "Invalid email or password" }`. | `backend/server.js:55-63` |
| Cấu trúc và thời hạn JWT | JWT payload gồm `{ id, role }`, ký bằng `SECRET_KEY = "super_secret_key_that_should_not_be_here"`. Không thiết lập tham số hết hạn (`expiresIn`), token có hiệu lực vô thời hạn. | `backend/server.js:9,51,105` |

### 3.3 Error Handling

| Condition | Result | Evidence |
|---|---|---|
| Lỗi truy vấn database khi login | HTTP 500 `{ error: err.message }` | `backend/server.js:36` |
| Email không tồn tại trong CSDL | HTTP 401 `{ error: "Invalid email or password" }` | `backend/server.js:37-38` |
| Tài khoản đang bị khóa (`locked_until` ở tương lai) | HTTP 403 `{ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." }` | `backend/server.js:40-44` |
| Mật khẩu sai (kể cả lần kích hoạt khóa) | HTTP 401 `{ error: "Invalid email or password" }` | `backend/server.js:63` |
| Thiếu Header Authorization trên protected routes | HTTP 401 `{ error: "Unauthorized" }` | `backend/server.js:103` |
| Token sai chữ ký hoặc bị hỏng | HTTP 403 `{ error: "Forbidden" }` | `backend/server.js:106` |

## 4. Database Evidence

| Table / Collection | Field | Meaning / Usage | Evidence |
|---|---|---|---|
| `users` | `id` | Khóa chính (INTEGER PRIMARY KEY AUTOINCREMENT), lưu trong JWT payload | `backend/database.js:51` |
| `users` | `name` | Tên người dùng | `backend/database.js:52` |
| `users` | `email` | Địa chỉ email dùng để định danh khi đăng nhập | `backend/database.js:53` |
| `users` | `password` | Mật khẩu lưu dưới dạng bản rõ (plaintext) | `backend/database.js:54` |
| `users` | `role` | Quyền người dùng (`'user'` hoặc `'admin'`) | `backend/database.js:55` |
| `users` | `login_attempts` | Số lần đăng nhập sai (INTEGER DEFAULT 0) | `backend/database.js:56` |
| `users` | `locked_until` | Thời điểm hết hạn khóa tài khoản (DATETIME) | `backend/database.js:57` |
| `users` | `reset_token` | Token phục vụ reset mật khẩu | `backend/database.js:58` |
| `users` | `shipping_address` | Địa chỉ giao hàng | `backend/database.js:59` |
| `users` | `phone` | Số điện thoại | `backend/database.js:60` |

Seed Data mặc định trong CSDL:
- Admin: `INSERT INTO users (name, email, password, role) VALUES ('Admin User', 'admin@eshop.com', 'Admin123!', 'admin')` (`backend/database.js:92`).
- User test: `INSERT INTO users (name, email, password, role) VALUES ('Test User', 'test@eshop.com', 'Test1234!', 'user')` (`backend/database.js:93`).

## 5. State / Persistence

| State / Data | Storage | Behavior | Evidence |
|---|---|---|---|
| JWT Token (Web) | `localStorage.getItem("token")` / `setItem("token", ...)` | Được lưu sau khi đăng nhập thành công; xóa khi logout | `frontend-web/src/context/AuthContext.jsx:8,32,40` |
| User Profile (Web) | React state `user` trong `AuthContext` | Hydrate từ token qua `GET /api/users/me` khi load lại trang | `frontend-web/src/context/AuthContext.jsx:7,14-17,33` |
| Axios Auth Header (Web) | `axios.defaults.headers.common["Authorization"]` | Tự động đính kèm `Bearer <token>` vào tất cả request Axios | `frontend-web/src/context/AuthContext.jsx:12,22` |
| JWT Token (Admin) | `localStorage.getItem("adminToken")` / `setItem("adminToken", ...)` | Lưu sau khi login admin thành công; xóa khi logout | `frontend-admin/src/App.jsx:7,70,267` |
| Login attempts counter | CSDL SQLite bảng `users.login_attempts` | Tăng 2 sau mỗi lần sai, reset 0 khi thành công | `backend/server.js:48,60` |
| Lockout timestamp | CSDL SQLite bảng `users.locked_until` | Ghi ISO string (Now + 180s) khi attempts $\ge 3$, reset NULL khi thành công | `backend/server.js:48,57,60` |

## 6. Cross-layer Flow

### 6.1 Luồng Đăng nhập Thành công

```
[User trên Web/Admin UI]
       │ Nhập email, password -> Click Submit
       ▼
[Frontend UI]
       │ Gọi AuthContext.login(email, password) / handleLogin()
       ▼
[HTTP Request]
       │ POST http://localhost:3000/api/login { email, password }
       ▼
[Backend server.js]
       │ 1. db.get("SELECT * FROM users WHERE email = ?")
       │ 2. Kiểm tra locked_until (NULL hoặc đã qua) -> Cho phép tiếp tục
       │ 3. user.password === password (Khớp chuỗi)
       │ 4. db.run("UPDATE users SET login_attempts = 0, locked_until = NULL WHERE id = ?")
       │ 5. jwt.sign({ id, role }, SECRET_KEY)
       │ 6. res.json({ message: "Login successful", token, user })
       ▼
[Frontend Response Handling]
       │ Web: setToken(token), localStorage.setItem("token", token), setUser(user), navigate('/')
       │ Admin: kiểm tra role === 'admin', setToken(token), localStorage.setItem("adminToken", token)
       ▼
[Cập nhật UI]
       │ Web: Header hiển thị "Chào, <name>" và nút "Thoát"
       │ Admin: Ẩn form login, hiển thị Dashboard quản trị
```

### 6.2 Luồng Đăng nhập Sai và Kích hoạt Khóa (Lockout)

```
[User nhập sai mật khẩu lần 1 (login_attempts = 0)]
       │
       ▼
[Backend server.js]
       │ newAttempts = 0 + 2 = 2
       │ newAttempts < 3 -> lockedUntil = null
       │ UPDATE users SET login_attempts = 2, locked_until = null
       │ Trả HTTP 401 { error: "Invalid email or password" }
       ▼
[User nhập sai mật khẩu lần 2 (login_attempts = 2)]
       │
       ▼
[Backend server.js]
       │ newAttempts = 2 + 2 = 4
       │ newAttempts >= 3 -> lockedUntil = Date.now() + 180000 (3 phút)
       │ UPDATE users SET login_attempts = 4, locked_until = ISO_STRING
       │ Trả HTTP 401 { error: "Invalid email or password" }  <-- Vẫn trả 401 ở lần kích hoạt
       ▼
[User gửi request đăng nhập lần tiếp theo trong vòng 3 phút (Lần 3+)]
       │
       ▼
[Backend server.js]
       │ new Date() < new Date(user.locked_until) là TRUE
       │ Trả HTTP 403 { error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." }
```

## 7. Important Implementation Details

1. **Bộ đếm tăng 2 thay vì 1**: Backend `server.js:54` thực hiện `newAttempts = user.login_attempts + 2`. Do đó, chỉ cần **2 lần nhập sai** (0 → 2 → 4) là tài khoản đã kích hoạt khóa, thay vì 3 lần như đặc tả nghiệp vụ.
2. **Thời gian khóa là 180 giây (3 phút) thay vì 30 giây**: Backend `server.js:57` sử dụng `Date.now() + 180000` (180s = 3 phút), khác với đặc tả 30s trong `README.md:42`.
3. **Response tại lần kích hoạt khóa vẫn là 401**: Tại lần sai thứ 2 (khiến `locked_until` được ghi vào CSDL), backend trả về HTTP 401 chứ chưa trả 403. HTTP 403 chỉ xuất hiện ở request **kế tiếp**.
4. **Web Frontend nuốt lỗi backend**: `frontend-web/src/pages/Login.jsx:18` gán cứng error string `"Đăng nhập thất bại. Vui lòng kiểm tra lại."`, khiến thông báo HTTP 403 ("Tài khoản đã bị khóa...") không bao giờ hiển thị lên UI Web.
5. **Sai lệch HTML Elements trên Web Form**:
   - Tiêu đề thẻ `<h2>` ghi là `"Đăng Ký"` (`Login.jsx:24`).
   - Nhãn email ghi là `"Username"` (`Login.jsx:28`).
   - Input email là `type="text"` (`Login.jsx:30`).
   - Input password là `type="text"` (`Login.jsx:40`).
   - Nút submit ghi là `"Sign In"` (`Login.jsx:58`).
   - Nút logout trên Header ghi là `"Thoát"` (`App.jsx:29`).
   - Vị trí error box nằm **bên dưới** nút submit (`Login.jsx:66`).
6. **Mật khẩu lưu dạng plaintext**: CSDL lưu mật khẩu dạng chuỗi rõ không băm, so khớp bằng `===` (`backend/server.js:46`, `backend/database.js:54`).
7. **JWT Token không hết hạn**: `jwt.sign` không truyền option `expiresIn` (`backend/server.js:51`).
8. **Admin Role check chỉ ở Client-side**: Endpoint `/api/login` trả token cho mọi role; việc chặn non-admin chỉ do frontend admin thực hiện qua `res.data.user.role !== "admin"` (`frontend-admin/src/App.jsx:65-68`).

## 8. Unknown / Not Found

- Endpoint riêng biệt để Admin mở khóa tài khoản trước thời hạn: *Not found in repository evidence*.
- Ghi nhận lịch sử IP / thiết bị đăng nhập: *Not found in repository evidence*.
- Cơ chế CAPTCHA hoặc Rate limiting ở mức IP: *Not found in repository evidence*.
