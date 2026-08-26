# FR-02 — Requirements and Scope

## 1. Sources

| Source | Relevant information |
|---|---|
| `README.md:21-25` | Tài khoản mặc định: Admin (`admin@eshop.com` / `Admin123!`), User (`test@eshop.com` / `Test1234!`). |
| `README.md:38-45` | Đặc tả nghiệp vụ FR-02: Đăng nhập & Khóa tài khoản (input email/mật khẩu, tăng đếm sai 1 đơn vị, sai $\ge 3$ lần liên tiếp khóa 30s demo, thông báo lỗi phù hợp không lộ nguyên nhân, thành công trả JWT token lưu client gửi kèm `Authorization: Bearer <token>`, trường email dùng `type="email"` có HTML5 validation). |
| `README.md:245-249` | Tiêu chuẩn giao diện chung (FR-21): ngôn ngữ tiếng Việt, nút submit màu xanh dương, mỗi trang đúng 1 thẻ `<h1>`, Tab order từ trên xuống dưới, trái sang phải. |
| `README.md:250-257` | Yêu cầu Form (FR-22): ký hiệu `*` ở trường bắt buộc, email `type="email"`, mật khẩu `type="password"`, thông báo lỗi xuất hiện **trên** nút submit. |
| `README.md:262` | Nút Đăng xuất phải có nhãn "Đăng xuất" (không phải "Thoát"). |
| `README.md:278-280` | Yêu cầu bảo mật (SEC-01: mật khẩu không lưu plaintext, SEC-02: API yêu cầu JWT, SEC-03: API Admin kiểm tra role `admin` trong token). |
| `api_specification.md:23-33` | Đặc tả API 1.2: `POST /api/login`, body JSON `{ "email", "password" }`, trả về HTTP 200 cùng JWT `token` và `user`. |
| `analysis/FR02_login_account_lockout.md:1-388` | Phân tích nghiệp vụ, domain & boundary testing cho FR-02. |

## 2. Functional Scope

Dựa trên tài liệu đặc tả trong repository:
- **Đăng nhập người dùng**: Người dùng nhập Email và Mật khẩu để xác thực tài khoản trên hệ thống EShop.
- **Xác thực và cấp quyền**: Khi thông tin xác thực chính xác, hệ thống cấp JWT Token để client lưu trữ và đính kèm vào header `Authorization: Bearer <token>` cho các request cần xác thực tiếp theo.
- **Xử lý đăng nhập sai**: Hệ thống ghi nhận các lần đăng nhập sai liên tiếp; mỗi lần sai tăng bộ đếm thêm 1 đơn vị.
- **Khóa tài khoản (Account Lockout)**: Khi số lần đăng nhập sai đạt ngưỡng từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây (môi trường demo). Trong thời gian khóa, hệ thống từ chối đăng nhập và trả thông báo lỗi phù hợp, không làm lộ chi tiết nguyên nhân.
- **Yêu cầu giao diện form**:
  - Nhãn/tiêu đề tiếng Việt, tiêu đề trang dùng thẻ `<h1>`.
  - Trường Email có `type="email"` (validate HTML5 format) và dấu `*`.
  - Trường Mật khẩu có `type="password"` (ẩn ký tự) và dấu `*`.
  - Nút đăng nhập có nhãn tiếng Việt, màu xanh dương.
  - Thông báo lỗi hiển thị **phía trên** nút submit.
  - Sau khi đăng nhập, hiển thị nút "Đăng xuất" (không phải "Thoát").

## 3. Actors / Entry Points

- **Khách hàng / Người dùng Web (Customer)**:
  - Entry point UI: Trang Đăng nhập Web (`/login`).
  - Header Web: Link "Đăng nhập" dẫn tới `/login`.
- **Quản trị viên (Admin)**:
  - Entry point UI: Màn hình Admin Login (`http://localhost:5174`).
- **Client / Test Automation Scripts**:
  - Entry point API: `POST http://localhost:3000/api/login`.

## 4. Inputs

| Input | Type | Source | Constraints |
|---|---|---|---|
| `email` | String | Form input / JSON body | Bắt buộc (`*`), định dạng email hợp lệ (`type="email"` HTML5) (`README.md:33,44,253`), JSON body `POST /api/login` (`api_specification.md:26-30`). |
| `password` | String | Form input / JSON body | Bắt buộc (`*`), mật khẩu dạng che khuất `type="password"` (`README.md:254`), JSON body `POST /api/login` (`api_specification.md:26-30`). |

## 5. Outputs / Observable Results

| Result | Evidence |
|---|---|
| Phản hồi API đăng nhập thành công: HTTP 200 kèm JSON `{ message: "Login successful", token: "...", user: {...} }` | `api_specification.md:32-33`, `analysis/FR02_login_account_lockout.md:71` |
| Token JWT được lưu phía client (`localStorage`) và đính kèm header `Authorization: Bearer <token>` | `README.md:43`, `analysis/FR02_login_account_lockout.md:72,219` |
| Chuyển hướng người dùng về trang chủ (`/`) sau khi đăng nhập thành công | `analysis/FR02_login_account_lockout.md:72` |
| Header hiển thị thông tin chào người dùng và nút "Đăng xuất" | `README.md:262` |
| Phản hồi API khi thông tin đăng nhập sai: HTTP 401 `{ error: "Invalid email or password" }` | `analysis/FR02_login_account_lockout.md:50,60,82` |
| Phản hồi API khi tài khoản bị khóa: HTTP 403 `{ error: "Tài khoản đã bị khóa. Vui lòng thử lại sau." }` | `analysis/FR02_login_account_lockout.md:54,93` |
| Thông báo lỗi hiển thị trên giao diện người dùng phía trên nút submit | `README.md:255` |

## 6. Preconditions

- Người dùng đã có tài khoản được tạo/seed trong CSDL (ví dụ: `test@eshop.com` / `Test1234!`, `admin@eshop.com` / `Admin123!`).
- Tài khoản không đang trong trạng thái bị tạm khóa (`locked_until` là NULL hoặc thời điểm hiện tại đã vượt qua `locked_until`).
- Backend server (`http://localhost:3000`) đang hoạt động và kết nối được SQLite database.

## 7. Postconditions

- **Đăng nhập thành công**:
  - Bộ đếm số lần đăng nhập sai (`login_attempts`) được reset về `0`.
  - Trạng thái khóa (`locked_until`) được reset về `NULL`.
  - Client nhận và lưu JWT token, cập nhật trạng thái đã xác thực.
- **Đăng nhập thất bại (chưa vượt ngưỡng khóa)**:
  - Bộ đếm số lần đăng nhập sai được tăng lên.
  - Tài khoản vẫn chưa bị khóa (`locked_until` giữ nguyên NULL).
  - Không cấp JWT token.
- **Đăng nhập thất bại (đạt hoặc vượt ngưỡng khóa $\ge 3$)**:
  - Bộ đếm số lần đăng nhập sai được cập nhật.
  - Thời điểm kết thúc khóa (`locked_until`) được thiết lập.
  - Các yêu cầu đăng nhập tiếp theo trong thời gian khóa bị từ chối với HTTP 403.

## 8. Explicit Constraints / Rules

- **Quy tắc đếm lần sai**: Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên **đúng 1 đơn vị** (`README.md:41`).
- **Quy tắc khóa tài khoản**: Nếu đăng nhập sai từ **3 lần trở lên** liên tiếp, tài khoản bị tạm khóa **30 giây** (môi trường demo) (`README.md:42`).
- **Bảo mật thông tin**: Thông báo lỗi trả về không để lộ chi tiết nguyên nhân (không phân biệt tài khoản không tồn tại hay sai mật khẩu) (`README.md:42`).
- **Quy chuẩn Form**:
  - Email phải dùng `type="email"` (`README.md:44, 253`).
  - Mật khẩu phải dùng `type="password"` (`README.md:254`).
  - Thông báo lỗi phải xuất hiện **trên** nút submit (`README.md:255`).
  - Nút đăng xuất phải có nhãn "Đăng xuất" (`README.md:262`).
  - Nút hành động submit màu xanh dương (`README.md:245`).

## 9. Unknown / Not Found

- Cơ chế mở khóa thủ công (Admin unlock API hoặc email unlock link): *Not found in repository evidence* (chỉ có cơ chế tự hết hạn thời gian khóa).
- Giới hạn độ dài tối đa/tối thiểu của email tại màn hình đăng nhập (ngoài HTML5 validation): *Not explicitly specified in repository evidence*.
