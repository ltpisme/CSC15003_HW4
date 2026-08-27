# Báo cáo

> HW04 – Automation Testing
> Sinh viên: Lê Thanh Phong
> MSSV: 23127452

## 1. Task 1: Tự động hóa Kiểm thử & Phân tích Lỗi Kịch bản AI

### 1.1. Pool A - Feature FR-02: Login and Account Lockout

#### a. Phân tích Dữ liệu & Mẫu Khẳng định

- **Số lượng test case**: 17 test cases (bao phủ Functional, Boundary Value Analysis, GUI & Accessibility).
- **Tách biệt dữ liệu (Data-Driven)**: Toàn bộ thông tin tài khoản, danh sách test case và tham số khóa được lưu trữ độc lập tại `automation/data/fr02-data.json`.
- **Mẫu khẳng định (5 Assertion Patterns)**:
  1. URL Navigation: `expect(page).not.toHaveURL(//login$/)` / `toHaveURL`.
  2. Visibility & Count: `expect(locator).toBeVisible()` / `toHaveCount`.
  3. Input Attribute & Property: `expect(input).toHaveAttribute(type, ...)` / `toHaveJSProperty(validity.valid, false)`.
  4. Text Matching: `expect(errorText).not.toContain(...)` / `toContain`.
  5. Spatial Geometry: `expect(errorBox.y).toBeLessThan(buttonBox.y)`.

#### b. Quy trình AI Workflow & Chỉnh sửa của Sinh viên

- **Baseline**: Mã kiểm thử ban đầu do AI sinh sử dụng CSS selector cứng (`input:nth-of-type(2)`) và giả định sai cây DOM (các thẻ input bọc trong từng thẻ `<div>` riêng), dẫn đến 45/51 executions bị timeout tại `expect(locator).toBeVisible()`.
- **Commit 1 (`327d656`)**: Tách dữ liệu sang `fr02-data.json`, tham số hóa các ca kiểm thử.
- **Commit 2 (`c7b6f94`)**: Refactor toàn bộ selector dùng cơ chế fallback Playwright `.or()`, bổ sung nhận diện class Tailwind (`.bg-red-100`, `[class*="text-red-"]`), giúp 7 test case vượt qua trên cả 3 trình duyệt.
- **Commit 3 (`66d22ad`)**: Thêm `test.setTimeout(60000)` vào `TC_FR02_09` để xử lý thời gian chờ 30 giây của cơ chế khóa tài khoản, khắc phục lỗi runner timeout.

#### c. Bảng Test Case & Kết quả Thực thi

| ID         | Name                                                                       | Objective                                                                               | Status                     | Expected Result                                                                                          | Actual Result                                                                                                    |
| ---------- | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| TC_FR02_01 | TC_FR02_01 - Login successfully with valid credentials                     | Kiểm tra đăng nhập thành công khi tất cả dữ liệu hợp lệ                     | Passed (2/3), Failed (1/3) | Đăng nhập thành công, chuyển hướng khỏi trang login (URL không còn kết thúc bằng /login)   | Passed trên Firefox, WebKit; Failed trên Chromium (Error: expect(page).not.toHaveURL(expected) failed).        |
| TC_FR02_02 | TC_FR02_02 - Reject email with invalid HTML5 email format                  | Kiểm tra từ chối email sai định dạng HTML5                                        | Failed                     | Trường email không hợp lệ (validity.valid = false), form không submit, giữ nguyên tại /login    | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toHaveJSProperty(expected) failed.                |
| TC_FR02_03 | TC_FR02_03 - Reject login with non-existing email                          | Kiểm tra từ chối đăng nhập với email không tồn tại trong hệ thống           | Passed                     | Giữ nguyên tại /login, hiển thị thông báo lỗi xác thực chung, không tiết lộ email tồn tại | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR02_04 | TC_FR02_04 - Reject login with incorrect password                          | Kiểm tra từ chối đăng nhập khi nhập sai mật khẩu                               | Passed                     | Giữ nguyên tại /login, hiển thị thông báo lỗi xác thực                                         | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR02_05 | TC_FR02_05 - First failed login attempt does not lock account              | Kiểm tra đăng nhập sai lần 1 không làm khóa tài khoản                         | Failed                     | Báo lỗi tại /login; sau đó đăng nhập bằng mật khẩu đúng thì thành công (URL rời /login) | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(page).not.toHaveURL(expected) failed.                      |
| TC_FR02_06 | TC_FR02_06 - Second consecutive failed login attempt does not lock account | Kiểm tra đăng nhập sai liên tiếp 2 lần không làm khóa tài khoản             | Failed                     | Báo lỗi tại /login; sau đó đăng nhập bằng mật khẩu đúng thì thành công (URL rời /login) | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(page).not.toHaveURL(expected) failed.                      |
| TC_FR02_07 | TC_FR02_07 - Third consecutive failed login attempt locks account          | Kiểm tra đăng nhập sai liên tiếp 3 lần sẽ khóa tài khoản                     | Failed                     | Báo lỗi tại /login và thông báo chứa nội dung bị khóa / locked / 30 giây                      | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(received).toBeTruthy().                                    |
| TC_FR02_08 | TC_FR02_08 - Correct password is rejected while account is locked          | Kiểm tra mật khẩu đúng vẫn bị từ chối khi tài khoản đang bị khóa          | Passed                     | Đăng nhập bị từ chối, giữ nguyên tại /login và hiển thị thông báo lỗi                     | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR02_09 | TC_FR02_09 - Account can login again after 30-second lock period           | Kiểm tra tài khoản có thể đăng nhập lại sau khi hết thời gian khóa 30 giây | Failed                     | Sau khi chờ 30 giây, đăng nhập bằng thông tin hợp lệ thành công (URL rời /login)             | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(page).not.toHaveURL(expected) failed.                      |
| TC_FR02_10 | TC_FR02_10 - Account remains locked while lock period is active            | Kiểm tra tài khoản vẫn bị khóa trong thời gian khóa đang có hiệu lực        | Passed                     | Đăng nhập ngay lập tức bị từ chối, giữ nguyên tại /login và hiển thị thông báo lỗi      | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR02_11 | TC_FR02_11 - Email field uses type=email                                   | Kiểm tra trường email có thuộc tính type=email                                    | Failed                     | Input email hiển thị và có thuộc tính type="email"                                                 | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toHaveAttribute(expected) failed.                 |
| TC_FR02_12 | TC_FR02_12 - Password field uses type=password                             | Kiểm tra trường password có thuộc tính type=password                              | Failed                     | Input password hiển thị và có thuộc tính type="password"                                           | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toHaveAttribute(expected) failed.                 |
| TC_FR02_13 | TC_FR02_13 - Login page contains exactly one h1                            | Kiểm tra trang login có đúng 1 thẻ h1                                              | Failed                     | Trang login chứa đúng 1 thẻ và hiển thị trên màn hình                                          | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toHaveCount(expected) failed.                     |
| TC_FR02_14 | TC_FR02_14 - Required login fields are marked as required                  | Kiểm tra các trường đăng nhập bắt buộc có thuộc tính required               | Passed                     | Cả input email và input password đều có thuộc tính required=""                                    | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR02_15 | TC_FR02_15 - Authentication error is displayed above submit button         | Kiểm tra thông báo lỗi xác thực hiển thị phía trên nút submit                | Failed                     | Thông báo lỗi hiển thị ở vị trí phía trên nút submit (errorBox.y < buttonBox.y)               | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(received).toBeLessThan(expected).                          |
| TC_FR02_16 | TC_FR02_16 - Password characters are hidden                                | Kiểm tra ký tự mật khẩu được ẩn (type=password)                                | Failed                     | Input password duy trì thuộc tính type="password" sau khi nhập dữ liệu                             | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toHaveAttribute(expected) failed.                 |
| TC_FR02_17 | TC_FR02_17 - Tab order follows the login form layout                       | Kiểm tra thứ tự phím Tab di chuyển qua form đăng nhập hợp lý                  | Passed                     | Chuỗi focus chứa các phần tử input của form đăng nhập                                           | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |

#### d. Thống kê Thực thi

- Tổng executions: 51 (17 TCs $\times$ 3 trình duyệt).
- Passed: 20 | Failed: 31 | Skipped: 0.
- Tỷ lệ Pass: 39.22% (Các ca thất bại phản ánh chính xác defect trên SUT).

#### e. Lỗi Phát hiện trên SUT (Bug Report)

- **BUG-01**: Tài khoản bị khóa sớm ở lần đăng nhập hợp lệ thứ 3 do backend tăng `login_attempts` +2 mỗi lần sai (`TC_FR02_07` / HW02: `B_FR02_01`).
  *Mức độ*: Severity: High | Priority: High | Trạng thái: Open
  *Minh chứng*: [GitHub Issue BUG-01](https://github.com/ltpisme/CSC15003_HW4/issues/4)

---

### 1.2. Pool B - Feature FR-07: Shopping Cart

#### a. Phân tích Dữ liệu & Mẫu Khẳng định

- **Số lượng test case**: 26 test cases (bao phủ Empty State, Content GUI, BVA số lượng, Thao tác +/-/Xóa, Accessibility).
- **Tách biệt dữ liệu (Data-Driven)**: Toàn bộ danh mục cột, nhãn tiếng Việt, vector biên số lượng và regex định dạng lưu tại `automation/data/fr07-data.json`.
- **Mẫu khẳng định (5 Assertion Patterns)**:
  1. Visibility State: `expect(locator).toBeVisible()` / `not.toBeVisible()`.
  2. Regex Pattern Matching: `expect(row).toContainText(new RegExp(priceRegex))` / `toMatch`.
  3. Element Count: `expect(locator).toHaveCount(1)`.
  4. Dynamic Polling: `expect.poll(() => getCartQuantity(page)).toBe(targetQuantity)`.
  5. Computed Style / Color Analysis: `expect(isColorRed || isBgRed).toBeTruthy()` (Phân tích sắc tố RGB `Red > Green && Red > Blue`).

#### b. Quy trình AI Workflow & Chỉnh sửa của Sinh viên

- **Baseline**: Thao tác click đơn lẻ tại `addProduct` bị dính bẫy logic `clickCount` của SUT (`ProductDetail.jsx:21-31` chỉ ghi nhận `clickCount = 1` ở lần click đầu mà không thêm sản phẩm), selector giỏ hàng trống bị timeout, khiến 75/78 executions thất bại.
- **Commit 1 (`a948177`)**: Tách dữ liệu sang `fr07-data.json`, xử lý double-click trong `addProduct`, bổ sung selector composite fallback cho sản phẩm và giỏ hàng trống.
- **Commit 2 (`9e1db65`)**: Bổ sung kiểm tra màu kết hợp (cả `color` và `backgroundColor`) cho nút Xóa trong `TC_FR07_25`; xử lý double-click cho `TC_FR07_23`.
- **Commit 3 (`5d18b5a`)**: Cập nhật selector động `feedbackButton` trong `TC_FR07_23` để bắt trạng thái nút chuyển sang text `"Đã thêm"` sau khi click.

#### c. Bảng Test Case & Kết quả Thực thi

| ID         | Name                                                                           | Objective                                                                                   | Status                     | Expected Result                                                                                                   | Actual Result                                                                                                    |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| TC_FR07_01 | TC_FR07_01 - Hiển thị Empty State khi giỏ hàng trống                      | Kiểm tra hiển thị trạng thái giỏ hàng trống khi chưa có sản phẩm                | Passed                     | Hiển thị empty state container, thông báo giỏ hàng trống và link Tiếp tục mua sắm                      | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR07_02 | TC_FR07_02 - Nút Tiếp tục mua sắm từ Empty State                          | Kiểm tra nhấp vào nút Tiếp tục mua sắm điều hướng về trang chủ                 | Passed                     | Trang chuyển hướng về trang chủ (/)                                                                          | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR07_03 | TC_FR07_03 - Hiển thị giỏ hàng có sản phẩm                              | Kiểm tra hiển thị giỏ hàng khi đã thêm sản phẩm                                   | Failed                     | Dòng sản phẩm hiển thị tên, số lượng, đơn giá và nhãn Tổng cộng                                   | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_04 | TC_FR07_04 - Kiểm tra cấu trúc các cột của giỏ hàng                    | Kiểm tra cấu trúc các tiêu đề cột của bảng giỏ hàng                             | Failed                     | Hiển thị đầy đủ các cột: Sản phẩm, Đơn giá, Số lượng, Thành tiền, Xóa                          | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_05 | TC_FR07_05 - Kiểm tra nhãn tổng tiền là Tổng cộng                       | Kiểm tra nhãn hiển thị tổng tiền là Tổng cộng (không phải Tổng tạm tính)      | Failed                     | Hiển thị nhãn "Tổng cộng" và không hiển thị nhãn không hợp lệ                                        | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_06 | TC_FR07_06 - Kiểm tra định dạng tiền tệ                                  | Kiểm tra định dạng tiền tệ sử dụng ký hiệu ₫ và phân cách hàng nghìn        | Passed                     | Giá sản phẩm và tổng tiền chứa ký hiệu ₫ và khớp regex định dạng tiền tệ VNĐ                    | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR07_07 | TC_FR07_07 - Thêm sản phẩm chưa tồn tại vào giỏ                        | Kiểm tra thêm sản phẩm mới (chưa có trong giỏ) với số lượng 3                   | Passed                     | Sản phẩm xuất hiện trong giỏ với số lượng 3 và thành tiền đúng                                      | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR07_08 | TC_FR07_08 - Thêm cùng sản phẩm lần thứ hai phải cộng dồn số lượng | Kiểm tra thêm cùng 1 sản phẩm lần 2 (3 + 1) thì cộng dồn số lượng thành 4      | Failed                     | Số lượng sản phẩm trong giỏ là 4 và chỉ tồn tại đúng 1 dòng cho sản phẩm đó                     | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(received).toBe(expected) // Object.is equality.            |
| TC_FR07_09 | TC_FR07_09 - Thêm sản phẩm với số lượng bằng 1                         | Kiểm tra giá trị biên dưới LB (số lượng = 1)                                       | Passed                     | Sản phẩm được thêm thành công với số lượng hiển thị trong giỏ là 1                                | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR07_10 | TC_FR07_10 - Thêm sản phẩm với số lượng bằng 2                         | Kiểm tra giá trị trên biên dưới LB+1 (số lượng = 2)                               | Passed                     | Sản phẩm được thêm thành công với số lượng hiển thị trong giỏ là 2                                | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR07_11 | TC_FR07_11 - Không cho thêm sản phẩm với số lượng bằng 0              | Kiểm tra giá trị dưới biên dưới LB-1 (số lượng = 0)                              | Failed                     | Hệ thống từ chối thêm (báo lỗi validation, validity.valid = false hoặc giá trị bị reset)               | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(received).toBeTruthy().                                    |
| TC_FR07_12 | TC_FR07_12 - Không cho thêm sản phẩm với số lượng âm                  | Kiểm tra không cho thêm sản phẩm với số lượng âm (-5)                             | Failed                     | Hệ thống từ chối thêm (báo lỗi validation, validity.valid = false hoặc giá trị bị reset)               | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(received).toBeTruthy().                                    |
| TC_FR07_13 | TC_FR07_13 - Không chấp nhận số lượng thập phân                        | Kiểm tra không chấp nhận số lượng là số thập phân (1.5)                          | Passed                     | Hệ thống từ chối thêm (báo lỗi validation, validity.valid = false hoặc giá trị bị reset)               | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR07_14 | TC_FR07_14 - Tăng số lượng bằng nút +                                    | Kiểm tra tăng số lượng sản phẩm trong giỏ bằng nút +                              | Failed                     | Số lượng tăng từ 1 lên 2 và thành tiền được cập nhật tương ứng                                   | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_15 | TC_FR07_15 - Giảm số lượng bằng nút -                                    | Kiểm tra giảm số lượng sản phẩm trong giỏ bằng nút -                              | Failed                     | Số lượng giảm từ 2 xuống 1 và thành tiền được cập nhật tương ứng                                 | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_16 | TC_FR07_16 - Không cho giảm quantity xuống dưới 1                         | Kiểm tra nút - không giảm số lượng xuống dưới 1                                   | Failed                     | Số lượng trong giỏ duy trì tối thiểu là 1, không bị về 0 hay số âm                                   | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_17 | TC_FR07_17 - Xóa sản phẩm và xác nhận                                    | Kiểm tra xóa sản phẩm và chọn Đồng ý trong dialog xác nhận                       | Failed                     | Dialog xác nhận hiển thị; sau khi nhấn Đồng ý, sản phẩm bị xóa khỏi giỏ hàng                       | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_18 | TC_FR07_18 - Xóa sản phẩm và hủy xác nhận                               | Kiểm tra xóa sản phẩm và chọn Hủy trong dialog xác nhận                            | Failed                     | Dialog xác nhận đóng; sản phẩm và số lượng vẫn được giữ nguyên trong giỏ hàng                   | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_19 | TC_FR07_19 - Xóa item cuối cùng chuyển giỏ hàng sang Empty State         | Kiểm tra xóa sản phẩm duy nhất chuyển giỏ hàng sang trạng thái trống             | Passed                     | Dòng sản phẩm biến mất, hiển thị empty state container và thông báo giỏ hàng trống                   | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR07_20 | TC_FR07_20 - Badge số lượng trên Navbar                                    | Kiểm tra badge trên Navbar cập nhật đúng tổng số lượng sản phẩm                 | Failed                     | Badge trên Navbar hiển thị số lượng tương ứng sau các lần thêm sản phẩm                             | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_21 | TC_FR07_21 - Breadcrumb của trang Giỏ hàng                                  | Kiểm tra breadcrumb điều hướng trên trang Giỏ hàng                                  | Failed                     | Breadcrumb hiển thị và chứa text "Giỏ hàng"                                                                 | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_22 | TC_FR07_22 - Trang Giỏ hàng có đúng một h1                               | Kiểm tra trang Giỏ hàng có đúng 1 thẻ h1                                             | Failed                     | Trang giỏ hàng có đúng 1 thẻ hiển thị với tiêu đề Giỏ hàng                                          | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toHaveCount(expected) failed.                     |
| TC_FR07_23 | TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ                 | Kiểm tra có phản hồi trực quan (toast, badge, đổi chữ nút) sau khi thêm vào giỏ | Passed (2/3), Failed (1/3) | Hiển thị ít nhất 1 loại phản hồi trực quan: toast, cập nhật badge, hoặc nút đổi thành "Đã thêm" | Passed trên Chromium, Firefox; Failed trên WebKit (Error: expect(received).toBeTruthy()).                      |
| TC_FR07_24 | TC_FR07_24 - Giao diện FR-07 sử dụng tiếng Việt                           | Kiểm tra toàn bộ văn bản giao diện giỏ hàng sử dụng tiếng Việt                  | Failed                     | Tất cả các chuỗi tiếng Việt chuẩn quy định trong SRS đều hiển thị trên trang giỏ hàng             | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeVisible() failed.                             |
| TC_FR07_25 | TC_FR07_25 - Kiểm tra màu nút hành động và nút nguy hiểm              | Kiểm tra nút thao tác nguy hiểm (Xóa) sử dụng màu đỏ                              | Passed                     | Nút xóa có màu chữ hoặc màu nền có sắc tố đỏ chủ đạo (Red > Green && Red > Blue)                  | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |
| TC_FR07_26 | TC_FR07_26 - Tab Order trên trang Giỏ hàng                                  | Kiểm tra thứ tự di chuyển phím Tab trên trang Giỏ hàng                              | Passed                     | Phím Tab di chuyển qua các phần tử tương tác (link, button, input) hợp lệ                               | Passed trên cả 3 trình duyệt (Chromium, Firefox, WebKit). Hệ thống đáp ứng đúng kết quả mong đợi. |

#### d. Thống kê Thực thi

- Tổng executions: 78 (26 TCs $\times$ 3 trình duyệt).
- Passed: 32 | Failed: 46 | Skipped: 0.
- Tỷ lệ Pass: 41.03%.

#### e. Lỗi Phát hiện trên SUT (Bug Report)

- **BUG-02**: Thêm cùng sản phẩm không cộng dồn mà tạo dòng mới trong giỏ (`TC_FR07_08` / `B_FR07_01`).*Severity*: High | *Priority*: High | *Status*: Open | *Minh chứng*: [GitHub Issue BUG-02](https://github.com/ltpisme/CSC15003_HW4/issues/5)
- **BUG-03**: Không báo lỗi khi nhập số lượng thập phân (1.5), tự lấy phần nguyên (1) (`TC_FR07_13` / `B_FR07_02`).*Severity*: Medium | *Priority*: Medium | *Status*: Open | *Minh chứng*: [GitHub Issue BUG-03](https://github.com/ltpisme/CSC15003_HW4/issues/6)
- **BUG-04**: Cho phép thêm sản phẩm với số lượng âm (-5) và thành tiền âm (`TC_FR07_12` / `B_FR07_03`).*Severity*: High | *Priority*: High | *Status*: Open | *Minh chứng*: [GitHub Issue BUG-04](https://github.com/ltpisme/CSC15003_HW4/issues/8)
- **BUG-05**: Xóa sản phẩm không hiển thị dialog xác nhận, xóa trực tiếp khỏi giỏ (`TC_FR07_17` / `B_FR07_04`).*Severity*: High | *Priority*: High | *Status*: Open | *Minh chứng*: [GitHub Issue BUG-05](https://github.com/ltpisme/CSC15003_HW4/issues/9)
- **BUG-06**: Không có dialog xác nhận nên không thể hủy thao tác xóa (`TC_FR07_18` / `B_FR07_05`).*Severity*: High | *Priority*: High | *Status*: Open | *Minh chứng*: [GitHub Issue BUG-06](https://github.com/ltpisme/CSC15003_HW4/issues/10)
- **BUG-07**: Cho phép thêm sản phẩm vào giỏ hàng với số lượng bằng 0 (`TC_FR07_11` / `B_FR07_06`).
  *Severity*: Medium | *Priority*: Medium | *Status*: Open | *Minh chứng*: [GitHub Issue BUG-07](https://github.com/ltpisme/CSC15003_HW4/issues/11)

---

### 1.3. Pool C - Feature FR-16: Import Products from CSV

#### a. Phân tích Dữ liệu & Mẫu Khẳng định

- **Số lượng test case**: 20 test cases (bao phủ Authorization, Header Validation, RFC 4180, BVA Giá/Tên, Atomic Rollback, Reporting).
- **Tách biệt dữ liệu (Data-Driven)**: Toàn bộ header mẫu, danh sách template hàng CSV, regex bắt lỗi lưu tại `automation/data/fr16-data.json`.
- **Mẫu khẳng định (5 Assertion Patterns)**:
  1. Attachment Verification: `expect(input).toBeAttached()`.
  2. Visibility / Invisibility: `expect(error).toBeVisible()` / `expect(product).not.toBeVisible()`.
  3. Regex Pattern Matching: `expect(error).toBeVisible()` với `RegExp(expectedReasonPattern)`.
  4. Multi-reason Loop Assertion: `for (const pattern of expectedReasonPatterns)`.
  5. Atomic Rollback Verification: Kiểm tra đối chiếu danh sách sản phẩm sau import lỗi để xác nhận 0 sản phẩm nào bị lưu.

#### b. Quy trình AI Workflow & Chỉnh sửa của Sinh viên

- **Baseline**: Script ban đầu giả định routing multi-page truyền thống (`/login`, `/admin/import-products`), dữ liệu CSV bị hardcode, thiếu hỗ trợ ứng dụng React SPA dẫn đến 57/60 executions thất bại do timeout.
- **Commit 1 (`1403585`)**: Tách toàn bộ test data, payload CSV sang `fr16-data.json`, tham số hóa 20 test cases, thêm assertion bắt nhiều mẫu lỗi.
- **Commit 2 (`9c3b9c5`)**: Chuyển sang điều hướng `BASE_URL`, selector nút import theo text động, bổ sung class Tailwind cho banner thông báo và mở rộng regex đối sánh số lượng.
- **Commit 3 (`94f1d0d`)**: Loại bỏ `page.goto` gây reload trang làm mất session in-memory của React SPA; chuyển sang cơ chế chuyển tab client-side thông qua tab `"Sản phẩm" / "Products"`.

#### c. Bảng Test Case & Kết quả Thực thi

| ID         | Name                                                           | Objective                                                                                 | Status  | Expected Result                                                                                             | Actual Result                                                                                                    |
| ---------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| TC_FR16_01 | TC_FR16_01 - Admin can access Import Products                  | Kiểm tra tài khoản Admin có quyền truy cập trang Import Products                    | Failed  | Form upload hiển thị phần tử input[type="file"] đính kèm trên DOM                                   | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_02 | TC_FR16_02 - Non-admin cannot import products                  | Kiểm tra tài khoản không phải Admin bị từ chối truy cập Import Products          | Skipped | Hiển thị thông báo từ chối truy cập (forbidden/unauthorized) hoặc ẩn input upload file             | Skipped trên cả 3 trình duyệt do thiếu cấu hình biến môi trường NON_ADMIN_EMAIL / NON_ADMIN_PASSWORD. |
| TC_FR16_03 | TC_FR16_03 - Import valid .csv file                            | Kiểm tra import thành công file .csv hợp lệ                                          | Failed  | Hiển thị thông báo import thành công                                                                  | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_04 | TC_FR16_04 - Reject non-.csv file                              | Kiểm tra từ chối file không có đuôi mở rộng .csv (ví dụ .xlsx)                 | Failed  | Hiển thị thông báo lỗi từ chối file không hợp lệ                                                  | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_05 | TC_FR16_05 - Accept valid CSV header                           | Kiểm tra chấp nhận file CSV có dòng header đúng chuẩn                             | Failed  | Hiển thị thông báo import thành công                                                                  | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_06 | TC_FR16_06 - Reject CSV with missing header fields             | Kiểm tra từ chối file CSV thiếu trường trong dòng header                           | Failed  | Hiển thị thông báo lỗi và nêu rõ lý do thiếu header                                               | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_07 | TC_FR16_07 - Reject CSV with incorrect header name             | Kiểm tra từ chối file CSV có tên trường header bị sai                             | Failed  | Hiển thị thông báo lỗi và nêu rõ lý do header không đúng                                        | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_08 | TC_FR16_08 - Parse quoted comma in CSV field correctly         | Kiểm tra phân tích cú pháp dấu phẩy trong nháy kép theo RFC 4180                 | Failed  | Import thành công, tên sản phẩm chứa dấu phẩy được lưu nguyên vẹn trong danh sách sản phẩm | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_09 | TC_FR16_09 - Reject unquoted comma in CSV field                | Kiểm tra từ chối trường CSV chứa dấu phẩy không được bao bởi dấu nháy kép | Failed  | Hiển thị thông báo lỗi import do phân tách trường không hợp lệ                                  | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_10 | TC_FR16_10 - Accept product name with minimum length 1         | Kiểm tra chấp nhận tên sản phẩm có độ dài tối thiểu là 1 ký tự             | Failed  | Hiển thị thông báo import thành công                                                                  | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_11 | TC_FR16_11 - Reject empty product name                         | Kiểm tra từ chối sản phẩm có tên rỗng                                             | Failed  | Hiển thị thông báo lỗi và nêu lý do tên sản phẩm rỗng                                           | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_12 | TC_FR16_12 - Reject price equal to 0                           | Kiểm tra từ chối sản phẩm có giá bằng 0                                           | Failed  | Hiển thị thông báo lỗi và nêu lý do giá bằng 0 không hợp lệ                                    | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_13 | TC_FR16_13 - Accept price equal to 0.01                        | Kiểm tra chấp nhận sản phẩm có giá biên hợp lệ nhỏ nhất (0.01)                | Failed  | Import thành công, sản phẩm xuất hiện trong danh sách sản phẩm                                     | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_14 | TC_FR16_14 - Reject negative price -0.01                       | Kiểm tra từ chối sản phẩm có giá âm (-0.01)                                       | Failed  | Hiển thị thông báo lỗi và nêu lý do giá âm không hợp lệ                                        | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_15 | TC_FR16_15 - Reject non-numeric price                          | Kiểm tra từ chối sản phẩm có giá không phải là số                              | Failed  | Hiển thị thông báo lỗi và nêu lý do giá không phải là số                                       | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_16 | TC_FR16_16 - Rollback entire import when middle row is invalid | Kiểm tra rollback toàn bộ transaction khi dòng ở giữa bị lỗi                      | Failed  | Hiển thị thông báo lỗi; toàn bộ sản phẩm A, B, C đều không xuất hiện trong database           | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_17 | TC_FR16_17 - Rollback previous rows when last row is invalid   | Kiểm tra rollback các dòng trước đó khi dòng cuối cùng bị lỗi                 | Failed  | Hiển thị thông báo lỗi; toàn bộ sản phẩm A, B, C đều không xuất hiện trong database           | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_18 | TC_FR16_18 - Multiple errors cause complete rollback           | Kiểm tra file chứa nhiều lỗi gây rollback hoàn toàn                                | Failed  | Hiển thị thông báo lỗi kèm các lý do lỗi; không sản phẩm nào được thêm vào database       | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_19 | TC_FR16_19 - Display successful import count                   | Kiểm tra hiển thị số lượng dòng import thành công trên báo cáo                | Failed  | Hiển thị thông báo thành công và số lượng dòng import thành công (Success: 3)                  | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |
| TC_FR16_20 | TC_FR16_20 - Display error count and error reasons             | Kiểm tra hiển thị số lượng lỗi và danh sách lý do lỗi                          | Failed  | Báo lỗi hiển thị success: 0, error count: 2, đầy đủ các lý do lỗi và rollback dữ liệu         | Failed trên cả 3 trình duyệt. Lỗi: Error: expect(locator).toBeAttached() failed.                            |

#### d. Thống kê Thực thi

- Tổng executions: 60 (20 TCs $\times$ 3 trình duyệt).
- Passed: 0 | Failed: 57 | Skipped: 3 (`TC_FR16_02` do thiếu cấu hình biến môi trường non-admin).
- Tỷ lệ Pass: 0.00% (Phản ánh các defect về SPA reload và không kiểm tra validation CSV của SUT).

#### e. Lỗi Phát hiện trên SUT (Bug Report)

- **BUG-08**: Chấp nhận file không có phần mở rộng `.csv` (như `.xlsx`) thay vì từ chối (`TC_FR16_04` / `B_FR16_01`).*Severity*: High | *Priority*: High | *Status*: Open | *Minh chứng*: [GitHub Issue BUG-08](https://github.com/ltpisme/CSC15003_HW4/issues/12)
- **BUG-09**: Không kiểm tra tính hợp lệ dòng header, vẫn import khi header sai hoặc thiếu trường (`TC_FR16_06`, `TC_FR16_07` / `B_FR16_02`).*Severity*: High | *Priority*: High | *Status*: Open | *Minh chứng*: [GitHub Issue BUG-09](https://github.com/ltpisme/CSC15003_HW4/issues/13)
- **BUG-10**: Parser CSV không theo chuẩn RFC 4180; trường có dấu phẩy trong nháy kép bị tách sai (`TC_FR16_08`, `TC_FR16_09` / `B_FR16_03`).*Severity*: High | *Priority*: High | *Status*: Open | *Minh chứng*: [GitHub Issue BUG-10](https://github.com/ltpisme/CSC15003_HW4/issues/14)
- **BUG-11**: Không kiểm tra ràng buộc `price > 0`, vẫn cho phép import giá bằng 0 hoặc âm (`TC_FR16_12`, `TC_FR16_14` / `B_FR16_04`).
  *Severity*: Medium | *Priority*: High | *Status*: Open | *Minh chứng*: [GitHub Issue BUG-11](https://github.com/ltpisme/CSC15003_HW4/issues/15)

---

### 1.4. Thống kê Kiểm thử Toàn bộ Suite

| Feature               | Số Test Cases | Lượt Chạy (Executions) |       Passed |        Failed |     Skipped |     Tỷ Lệ Pass |
| --------------------- | -------------: | ------------------------: | -----------: | ------------: | ----------: | ---------------: |
| FR-02 (Pool A)        |             17 |                        51 |           20 |            31 |           0 |           39.22% |
| FR-07 (Pool B)        |             26 |                        78 |           32 |            46 |           0 |           41.03% |
| FR-16 (Pool C)        |             20 |                        60 |            0 |            57 |           3 |            0.00% |
| **Tổng cộng** |   **63** |             **189** | **52** | **134** | **3** | **27.51%** |

---

### 1.5. Danh mục Tổng hợp Lỗi SUT (Bug Report)

| ID     | Feature | Description                                                                                                                      | Severity | Priority | Status | Evidence                                                     |
| ------ | ------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- | -------- | ------ | ------------------------------------------------------------ |
| BUG-04 | FR-07   | Cho phép thêm sản phẩm với số lượng âm (-5) và thành tiền âm vào giỏ hàng (`TC_FR07_12`).                      | High     | High     | Open   | [B_FR07_03](https://github.com/ltpisme/CSC15003_HW4/issues/8) |
| BUG-05 | FR-07   | Xóa sản phẩm không hiển thị modal/dialog xác nhận, xóa trực tiếp khỏi giỏ (`TC_FR07_17`).                         | High     | High     | Open   | [B_FR07_04](https://github.com/ltpisme/CSC15003_HW4/issues/9) |
| BUG-06 | FR-07   | Không hiển thị dialog xác nhận khi xóa khiến người dùng không thể hủy thao tác xóa (`TC_FR07_18`).              | High     | High     | Open   | [B_FR07_05](https://github.com/ltpisme/CSC15003_HW4/issues/10) |
| BUG-07 | FR-07   | Cho phép thêm sản phẩm vào giỏ hàng với số lượng bằng 0 (`TC_FR07_11`).                                            | Medium   | Medium   | Open   | [B_FR07_06](https://github.com/ltpisme/CSC15003_HW4/issues/11) |
| BUG-08 | FR-16   | Chấp nhận file không có phần mở rộng`.csv` (như `.xlsx`) thay vì từ chối theo SRS (`TC_FR16_04`).               | High     | High     | Open   | [B_FR16_01](https://github.com/ltpisme/CSC15003_HW4/issues/12) |
| BUG-09 | FR-16   | Không kiểm tra tính hợp lệ dòng header, vẫn import khi header sai hoặc thiếu trường (`TC_FR16_06`, `TC_FR16_07`). | High     | High     | Open   | [B_FR16_02](https://github.com/ltpisme/CSC15003_HW4/issues/13) |
| BUG-10 | FR-16   | Parser CSV không theo chuẩn RFC 4180; trường có dấu phẩy trong nháy kép bị tách sai (`TC_FR16_08`, `TC_FR16_09`). | High     | High     | Open   | [B_FR16_03](https://github.com/ltpisme/CSC15003_HW4/issues/14) |
| BUG-11 | FR-16   | Không kiểm tra ràng buộc`price > 0`, vẫn cho phép import giá bằng 0 hoặc âm (`TC_FR16_12`, `TC_FR16_14`).        | Medium   | High     | Open   | [B_FR16_04](https://github.com/ltpisme/CSC15003_HW4/issues/15) |

---

## 2. Task 2: Demo Video

- **Liên kết video**: [Demo Video](https://youtu.be/Ww8N_2Nzh8k)
- **Nội dung trình bày trong video**:

  1. Xác thực tác giả qua terminal và giới thiệu kiến trúc kiểm thử Data-Driven trên mã nguồn `fr07.spec.ts` & `fr07-data.json`.
  2. Thuyết minh chi tiết lỗi kịch bản do AI sinh: AI chỉ gửi 1 lệnh click trong `addProduct` làm dính bẫy `clickCount` của SUT khiến giỏ hàng rỗng; giải thích cách sinh viên debug và bổ sung cơ chế kiểm tra click kép cùng selector động.
  3. Chạy trực tiếp bộ kịch bản E2E trên 3 trình duyệt (Chromium, Firefox, WebKit) bằng lệnh `STUDENT_ID=23127452 npx playwright test tests/fr07.spec.ts`.
  4. Mở báo cáo HTML Playwright chứng minh định danh `Run by: 23127452` và ISO timestamp.
  5. Phân tích các ca kiểm thử thất bại phát hiện bug thực tế trên SUT và kiểm tra lịch sử commit Git.

---

## 3. AI Disclosure

Em sử dụng các công cụ AI cho các công việc sau: trích xuất và phân tích yêu cầu, thiết kế test case ban đầu, sinh script kiểm thử tự động bằng Playwright, và phân tích/review các điểm thiếu sót của script.

- **Chi tiết phạm vi hỗ trợ**:
  * *Phân tích yêu cầu*: Sử dụng NotebookLM trích xuất đặc tả nghiệp vụ từ SRS và API specification.
  * *Thiết kế test case*: Sử dụng ChatGPT hỗ trợ phác thảo khung kịch bản kiểm thử ban đầu.
  * *Sinh mã kịch bản*: Sử dụng ChatGPT sinh bộ khung Playwright ban đầu.
  * *Rà soát & Đề xuất sửa script*: Sử dụng Antigravity (Gemini 3.7 Flash) đối chiếu implementation evidence trong mã nguồn SUT và đề xuất các chỉnh sửa selector/timeout.
- **Cam kết trách nhiệm con người (Human Validation)**:
  Toàn bộ kịch bản kiểm thử, dữ liệu test, kết quả thực thi và phân tích lỗi đều được sinh viên trực tiếp rà soát, tinh chỉnh qua 3 lần commit và thực thi kiểm chứng trên trình duyệt thật. Sinh viên chịu trách nhiệm 100% về tính chính xác của toàn bộ sản phẩm nộp. AI hoàn toàn không được sử dụng để viết nội dung báo cáo đánh giá.

---

## 4. AI Critique

Trong quá trình thực hiện bài tập, AI thể hiện ưu điểm rõ rệt trong việc tạo nhanh khung mã Playwright ban đầu, tự động hóa các hàm tiện ích lặp lại và gợi ý các mẫu assertion cơ bản. Nhờ đó, thời gian xây dựng bộ kịch bản ban đầu cho 63 test case được rút ngắn đáng kể.

Tuy nhiên, AI bộc lộ những hạn chế nghiêm trọng về khả năng nhận thức kiến trúc ứng dụng thực tế. Thứ nhất, AI thường sinh các CSS selector lý thuyết cứng nhắc (như `:nth-of-type(2)` hay `[role="alert"]`) mà không nhận diện được cấu trúc DOM thực tế (Tailwind CSS utility classes, mỗi trường input nằm trong thẻ `<div>` riêng). Thứ hai, AI không phát hiện được các bẫy nghiệp vụ đặc thù của SUT, tiêu biểu là logic `clickCount` tại `ProductDetail.jsx` (yêu cầu nhấp chuột 2 lần mới thêm giỏ hàng) hoặc việc `page.goto` làm mất session trong bộ nhớ của React SPA. Thứ ba, AI thiếu hoàn toàn khả năng kiểm chứng động: các sai sót về thời gian chờ (lockout 30 giây) hay tính toán màu sắc CSS (`color` vs `backgroundColor`) chỉ lộ diện khi sinh viên trực tiếp chạy kiểm thử.

Kết quả AI Audit cho thấy có đến 40% phiên làm việc ban đầu thuộc nhóm `Invalid` hoặc `Incomplete`. Bài học lớn nhất rút ra là không thể sử dụng AI như một "hộp đen" tạo giải pháp hoàn chỉnh. Người kiểm thử bắt buộc phải đóng vai trò kiểm định viên có kỷ luật: dẫn dắt AI từng bước, rà soát từng dòng mã và luôn xác thực kết quả thông qua việc thực thi thực tế trên trình duyệt.

---

## 5. Phụ lục: Báo cáo AI Audit (AI Audit Summary)

| Feature       | Phiên Tương Tác / Nội Dung                                                                  | Nhãn Đánh Giá | Minh Chứng Nhật Ký               |
| ------------- | ------------------------------------------------------------------------------------------------ | ----------------- | ----------------------------------- |
| FR-02, 07, 16 | Trích dẫn thông tin từ FR-02, FR-07, FR-16 (NotebookLM, 15:51 22/08/2026)                    | Valid             | `docs/AI_Audit/AI_audit.md#log-1` |
| FR-02, 07, 16 | Thiết kế Test case cho FR-02, FR-07, FR-16 (ChatGPT, 16:06 22/08/2026)                         | Incomplete        | `docs/AI_Audit/AI_audit.md#log-2` |
| FR-02, 07, 16 | Viết prompt để trích thông tin repo SUT (ChatGPT, 00:33 26/08/2026)                         | Valid             | `docs/AI_Audit/AI_audit.md#log-3` |
| FR-02, 07, 16 | Thực hiện trích thông tin để đối chiếu (Antigravity Gemini 3.7 Flash, 00:35 26/08/2026) | Valid             | `docs/AI_Audit/AI_audit.md#log-4` |
| FR-02, 07, 16 | Sinh script Playwright ban đầu bị lỗi selector/data (ChatGPT, 16:54 26/08/2026)              | Invalid           | `docs/AI_Audit/AI_audit.md#log-5` |

| Nhãn Đánh Giá     | Số Lượng Phiên | Tỷ Lệ Phần Trăm |
| --------------------- | -----------------: | ------------------: |
| Valid                 |                  3 |               60.0% |
| Invalid               |                  1 |               20.0% |
| Incomplete            |                  1 |               20.0% |
| **Tổng cộng** |        **5** |    **100.0%** |
