# FR-02 — Testable Behavior

## 1. Entry Points

| ID | Entry point | Evidence |
|---|---|---|
| TB-02-EP-01 | UI Web Route `/login` | `frontend-web/src/App.jsx:52`, `frontend-web/src/pages/Login.jsx:5` |
| TB-02-EP-02 | UI Header Link `"Đăng nhập"` trên Web | `frontend-web/src/App.jsx:33` |
| TB-02-EP-03 | UI Form Admin Login tại `http://localhost:5174` | `frontend-admin/src/App.jsx:188-215` |
| TB-02-EP-04 | API Endpoint `POST /api/login` | `backend/server.js:32-66`, `api_specification.md:24` |
| TB-02-EP-05 | API Endpoint `GET /api/users/me` (Hydration / Token check) | `backend/server.js:112-116` |

## 2. Observable Behaviors

| ID | Action / Condition | Observable Result | Evidence |
|---|---|---|---|
| TB-02-OB-01 | Nhập đúng email (`test@eshop.com`) và đúng mật khẩu (`Test1234!`) trên form Web rồi submit | - Gọi API `POST /api/login`<br>- Nhận HTTP 200 kèm JWT token<br>- `localStorage.getItem("token")` được gán token<br>- Điều hướng về `/`<br>- Header hiển thị text `"Chào, Test User"` và nút `"Thoát"` | `backend/server.js:46-52`, `frontend-web/src/context/AuthContext.jsx:26-35`, `frontend-web/src/pages/Login.jsx:15-16`, `frontend-web/src/App.jsx:27-29` |
| TB-02-OB-02 | Nhập sai mật khẩu lần 1 trên Web form (tài khoản chưa từng sai, attempts = 0) | - Gọi API `POST /api/login`<br>- Nhận HTTP 401 `{ error: "Invalid email or password" }`<br>- UI Web hiển thị thẻ đỏ với text `"Đăng nhập thất bại. Vui lòng kiểm tra lại."` bên dưới nút submit<br>- Trong CSDL: `login_attempts` tăng từ 0 lên 2, `locked_until` vẫn là NULL | `backend/server.js:54-63`, `frontend-web/src/pages/Login.jsx:18,66` |
| TB-02-OB-03 | Nhập sai mật khẩu lần 2 liên tiếp trên Web form (attempts hiện tại = 2) | - Gọi API `POST /api/login`<br>- Nhận HTTP 401 `{ error: "Invalid email or password" }`<br>- UI Web hiển thị text `"Đăng nhập thất bại. Vui lòng kiểm tra lại."`<br>- Trong CSDL: `login_attempts` tăng lên 4, `locked_until` được ghi nhận timestamp tương lai (Now + 180s) | `backend/server.js:54-63` |
| TB-02-OB-04 | Gửi request đăng nhập khi tài khoản đang trong thời gian khóa (lần thứ 3+) | - Gọi API `POST /api/login`<br>- Backend trả HTTP 403 `{ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." }`<br>- Trên UI Web: vẫn hiển thị text `"Đăng nhập thất bại. Vui lòng kiểm tra lại."` (do catch handler nuốt message backend) | `backend/server.js:40-44`, `frontend-web/src/pages/Login.jsx:18,66` |
| TB-02-OB-05 | Gửi request đăng nhập sau khi thời gian khóa 180s đã trôi qua với mật khẩu đúng | - Backend kiểm tra `new Date() < new Date(user.locked_until)` trả về false (hết hạn khóa)<br>- Nhận HTTP 200 thành công<br>- CSDL cập nhật `login_attempts = 0`, `locked_until = NULL` | `backend/server.js:40,46-50` |
| TB-02-OB-06 | Đăng nhập tài khoản non-admin (`test@eshop.com`) trên giao diện Admin | - Backend trả HTTP 200 kèm JWT token<br>- Frontend Admin hiển thị alert browser `"Bạn không phải là admin!"`<br>- Không lưu token vào `adminToken`, giữ nguyên màn hình login | `frontend-admin/src/App.jsx:65-68` |
| TB-02-OB-07 | Đăng nhập tài khoản admin (`admin@eshop.com` / `Admin123!`) trên giao diện Admin | - Backend trả HTTP 200 kèm JWT token<br>- `localStorage.getItem("adminToken")` được lưu<br>- Ẩn form login, hiển thị giao diện Dashboard quản trị | `frontend-admin/src/App.jsx:69-70,223-292` |
| TB-02-OB-08 | Click nút `"Thoát"` trên Navbar Web | - `localStorage.removeItem("token")`<br>- Reset user context về null<br>- Xóa header Authorization của Axios<br>- Navbar chuyển về hiển thị link `"Đăng nhập"` và `"Đăng ký"` | `frontend-web/src/context/AuthContext.jsx:37-41`, `frontend-web/src/App.jsx:31-36` |

## 3. Validation Behaviors

| ID | Input / Condition | Expected Observable Result | Evidence |
|---|---|---|---|
| TB-02-VAL-01 | Bỏ trống email và submit form Web | Trình duyệt kích hoạt HTML5 native validation "Please fill out this field" do input có thuộc tính `required` (không gửi API request) | `frontend-web/src/pages/Login.jsx:34` |
| TB-02-VAL-02 | Bỏ trống password và submit form Web | Trình duyệt kích hoạt HTML5 native validation do input có thuộc tính `required` (không gửi API request) | `frontend-web/src/pages/Login.jsx:44` |
| TB-02-VAL-03 | Nhập chuỗi không phải định dạng email (ví dụ: `invaliduser`) vào ô email trên Web | Form vẫn cho phép submit bình thường và gửi API request (do input có `type="text"`, không có HTML5 email format validation) | `frontend-web/src/pages/Login.jsx:30` |
| TB-02-VAL-04 | Gửi request `POST /api/login` với body rỗng `{}` hoặc email không tồn tại | Backend trả HTTP 401 `{ error: "Invalid email or password" }` | `backend/server.js:37-38` |

## 4. Error Behaviors

| ID | Error Condition | Observable Result | Evidence |
|---|---|---|---|
| TB-02-ERR-01 | Email không tồn tại trong hệ thống | API trả HTTP 401 `{ error: "Invalid email or password" }`; Web UI hiển thị `"Đăng nhập thất bại. Vui lòng kiểm tra lại."` | `backend/server.js:37-38`, `frontend-web/src/pages/Login.jsx:18` |
| TB-02-ERR-02 | Mật khẩu không khớp giá trị trong CSDL | API trả HTTP 401 `{ error: "Invalid email or password" }`; Web UI hiển thị `"Đăng nhập thất bại. Vui lòng kiểm tra lại."` | `backend/server.js:63`, `frontend-web/src/pages/Login.jsx:18` |
| TB-02-ERR-03 | Đăng nhập khi tài khoản đang bị khóa (`locked_until > now`) | API trả HTTP 403 `{ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." }`; Web UI hiển thị `"Đăng nhập thất bại. Vui lòng kiểm tra lại."` | `backend/server.js:40-44`, `frontend-web/src/pages/Login.jsx:18` |
| TB-02-ERR-04 | Admin login với tài khoản non-admin | Trình duyệt hiển thị native alert `"Bạn không phải là admin!"` | `frontend-admin/src/App.jsx:66` |
| TB-02-ERR-05 | Admin login thất bại (sai email hoặc mật khẩu) | Trình duyệt hiển thị native alert `"Đăng nhập thất bại"` | `frontend-admin/src/App.jsx:72` |

## 5. State Transitions

| ID | Initial State | Action | Resulting State | Evidence |
|---|---|---|---|---|
| TB-02-ST-01 | `login_attempts = 0`, `locked_until = NULL` | Nhập sai mật khẩu lần 1 | `login_attempts = 2`, `locked_until = NULL` | `backend/server.js:54,60` |
| TB-02-ST-02 | `login_attempts = 2`, `locked_until = NULL` | Nhập sai mật khẩu lần 2 | `login_attempts = 4`, `locked_until = ISO_STRING (Now + 180s)` | `backend/server.js:54,57,60` |
| TB-02-ST-03 | `login_attempts = 4`, `locked_until = FUTURE_TIME` | Gửi request đăng nhập bất kỳ | Giữ nguyên trạng thái khóa, trả về HTTP 403 | `backend/server.js:40-44` |
| TB-02-ST-04 | `login_attempts = 4`, `locked_until = PAST_TIME` (sau 180s) | Nhập đúng mật khẩu | `login_attempts = 0`, `locked_until = NULL`, cấp JWT token | `backend/server.js:40,46-52` |
| TB-02-ST-05 | `login_attempts = 2`, `locked_until = NULL` | Nhập đúng mật khẩu | `login_attempts = 0`, `locked_until = NULL`, cấp JWT token | `backend/server.js:46-52` |

## 6. API-observable Behaviors

| ID | Request | Expected Response | Evidence |
|---|---|---|---|
| TB-02-API-01 | `POST /api/login` với `{ "email": "test@eshop.com", "password": "Test1234!" }` | HTTP 200 `{ message: "Login successful", token: "<JWT>", user: { id: 2, name: "Test User", email: "test@eshop.com", role: "user", login_attempts: 0, locked_until: null, ... } }` | `backend/server.js:46-52` |
| TB-02-API-02 | `POST /api/login` với `{ "email": "test@eshop.com", "password": "WrongPassword" }` (chưa khóa) | HTTP 401 `{ error: "Invalid email or password" }` | `backend/server.js:63` |
| TB-02-API-03 | `POST /api/login` với email của tài khoản đang bị khóa | HTTP 403 `{ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." }` | `backend/server.js:40-44` |
| TB-02-API-04 | `GET /api/users/me` với Header `Authorization: Bearer <valid_token>` | HTTP 200 trả về object thông tin user tương ứng | `backend/server.js:112-116` |
| TB-02-API-05 | `GET /api/users/me` không có Header `Authorization` | HTTP 401 `{ error: "Unauthorized" }` | `backend/server.js:103` |

## 7. Persistence Behaviors

| ID | Action | Persisted Data / State | Evidence |
|---|---|---|---|
| TB-02-PER-01 | Đăng nhập thành công trên Web | `localStorage.getItem("token")` lưu chuỗi JWT | `frontend-web/src/context/AuthContext.jsx:32` |
| TB-02-PER-02 | Tải lại trang (F5) sau khi đã đăng nhập | `useEffect` trong `AuthContext` đọc token từ `localStorage`, gọi `GET /api/users/me` phục hồi state `user` | `frontend-web/src/context/AuthContext.jsx:8,10-24` |
| TB-02-PER-03 | Click "Thoát" trên Web | `localStorage.getItem("token")` trả về `null` | `frontend-web/src/context/AuthContext.jsx:40` |
| TB-02-PER-04 | Đăng nhập thành công trên Admin | `localStorage.getItem("adminToken")` lưu chuỗi JWT | `frontend-admin/src/App.jsx:70` |
| TB-02-PER-05 | Đăng nhập sai trên backend | Giá trị `login_attempts` và `locked_until` được ghi cố định vào SQLite CSDL bảng `users` | `backend/server.js:60` |

## 8. Automation Review Notes

Những điểm khác biệt giữa đặc tả (`README.md` / `api_specification.md`) và triển khai thực tế (`backend/server.js`, `Login.jsx`):

1. **Số lần sai để bị khóa (2 lần thay vì 3 lần)**:
   - *Implementation*: `newAttempts = user.login_attempts + 2` (`backend/server.js:54`). Sau lần sai thứ 2, `newAttempts = 4 >= 3`, kích hoạt khóa ngay lập tức.
   - *Rủi ro automation*: Test automation kỳ vọng thử sai 3 lần mới bị khóa sẽ fail nếu assert số lần hoặc assert trạng thái sau lần 2.
2. **Thời gian khóa tài khoản (180 giây thay vì 30 giây)**:
   - *Implementation*: `Date.now() + 180000` (`backend/server.js:57`).
   - *Rủi ro automation*: Test sleep 30 giây rồi thử lại sẽ nhận HTTP 403 (fail), vì tài khoản vẫn bị khóa tới 180 giây.
3. **Response code tại request kích hoạt khóa là 401 chứ không phải 403**:
   - *Implementation*: Request thứ 2 đặt `locked_until` nhưng vẫn trả về HTTP 401 (`backend/server.js:63`). Phải đến request thứ 3 (trong thời gian khóa) backend mới trả HTTP 403 (`backend/server.js:40-44`).
4. **Thông báo lỗi trên Web UI bị nuốt**:
   - *Implementation*: `frontend-web/src/pages/Login.jsx:18` luôn hiển thị `"Đăng nhập thất bại. Vui lòng kiểm tra lại."`.
   - *Rủi ro automation*: Assert UI hiển thị text `"Tài khoản đã bị khóa..."` hoặc `"Invalid email or password"` trên Web sẽ luôn FAIL.
5. **Selector và thuộc tính HTML của Web Form**:
   - Input email: `input[type="text"]` (không phải `input[type="email"]`) (`Login.jsx:30`).
   - Input password: `input[type="text"]` (không phải `input[type="password"]`) (`Login.jsx:40`).
   - Heading form: `h2` với text `"Đăng Ký"` (không phải `"Đăng nhập"`, không có thẻ `h1`) (`Login.jsx:24`).
   - Nút submit: Text `"Sign In"` (không phải `"Đăng nhập"`) (`Login.jsx:58`).
   - Nút đăng xuất: Text `"Thoát"` (không phải `"Đăng xuất"`) (`App.jsx:29`).
   - Vị trí error box: Nằm dưới nút submit (`Login.jsx:66`), không nằm phía trên như yêu cầu FR-22.
6. **Admin Login dùng Browser Alert native**:
   - *Implementation*: `frontend-admin/src/App.jsx:66,72` dùng `alert()`. Automation kiểm tra Admin UI cần xử lý dialog listener (`page.on('dialog')`).

## 9. Unknown / Ambiguous Behaviors

- **Hành vi reset bộ đếm khi đăng nhập sai cách quãng**: Nếu user nhập sai 1 lần (attempts = 2), sau đó không thao tác trong 1 ngày rồi nhập sai tiếp, hệ thống không có cơ chế timeout để reset `login_attempts` về 0 sau một khoảng thời gian không hoạt động (chỉ reset khi đăng nhập thành công) (`backend/server.js:46-64`).
- **Hành vi mở khóa đồng thời từ nhiều client**: SQLite xử lý tuần tự qua `db.get` và `db.run`, không có transaction lock rõ ràng cho endpoint login (`backend/server.js:35-65`).
