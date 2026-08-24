### **1. Đặc tả Yêu cầu Hệ thống (SRS) và Giao diện (GUI) cho FR-02**

**Yêu cầu nghiệp vụ của chức năng FR-02: Đăng nhập & Khóa tài khoản**
* **Người dùng nhập Email và Mật khẩu.**
* **Sau mỗi lần đăng nhập sai, hệ thống tăng bộ đếm lên đúng 1 đơn vị.**
* **Nếu đăng nhập sai từ 3 lần trở lên liên tiếp, tài khoản bị tạm khóa 30 giây** (trong môi trường demo). Hệ thống trả về thông báo lỗi phù hợp; không để lộ chi tiết nguyên nhân.
* **Đăng nhập thành công trả về JWT Token.** Token này được lưu phía client và gửi kèm tất cả các yêu cầu có xác thực qua header `Authorization: Bearer <token>`.
* **Trường email phải dùng `type="email"`** (có validate định dạng HTML5).

**Tài khoản mặc định được cấu hình sẵn trong hệ thống:**
* **Admin:** `admin@eshop.com` / `Admin123!`
* **User test:** `test@eshop.com` / `Test1234!`

**Yêu cầu Giao diện (GUI Requirements) và Biểu mẫu (Form Requirements) liên quan:**
* **Nhất quán ngôn ngữ:** Toàn bộ giao diện sử dụng tiếng Việt (trừ các thuật ngữ kỹ thuật chuẩn).
* **Nhất quán màu sắc:** Các nút hành động tích cực (Submit, Mua hàng) dùng màu xanh dương. Các nút nguy hiểm hoặc hủy bỏ dùng màu đỏ.
* **Tiêu đề trang:** Mỗi trang chỉ có **đúng một thẻ `<h1>`** mô tả nội dung trang.
* **Tab Order:** Thứ tự focus bằng phím Tab phải đi từ trên xuống dưới, từ trái sang phải.
* **Trường bắt buộc:** Tất cả các trường bắt buộc phải có ký hiệu `*` bên cạnh nhãn.
* **Trường Email:** Phải sử dụng thuộc tính `type="email"`.
* **Trường Mật khẩu:** Phải sử dụng thuộc tính `type="password"` để ẩn ký tự.
* **Thông báo lỗi:** Phải xuất hiện **trên** nút submit, không hiển thị bên dưới.

---

### **2. Đặc tả API Đăng nhập**
* **Endpoint:** `POST /api/login`
* **Body (JSON):** *(Không được mô tả chi tiết trường dữ liệu trong tài liệu đặc tả API)*
* **Phản hồi thành công (200 OK):** Trả về chuỗi JWT token và thông tin user.

---

### **3. Phân tích Kỹ thuật Kiểm thử (Domain Testing & Boundary Value Analysis) cho FR-02**

#### **Phân tích Domain Testing:**
* **Input:** Email, mật khẩu và số lần đăng nhập.
* **Output:** Đăng nhập thành công, đăng nhập thất bại và bị khóa tài khoản 30 giây.
* **Điều kiện kiểm thử (Conditions):**
  | STT | Biến | Mô tả |
  | --- | --- | --- |
  | **C1** | Email | Email phải đúng format email của HTML5 |
  | **C2** | Email | Email phải tồn tại trong hệ thống |
  | **C3** | Mật khẩu | Mật khẩu đúng với tài khoản đăng nhập |
  | **C4** | Số lần đăng nhập | Số lần đăng nhập sai liên tiếp từ 3 lần trở lên thì bị khóa tài khoản trong 30 giây |

* **Lớp tương đương (Equivalence Class):**
  | STT | Loại | Condition | Mô tả |
  | --- | --- | --- | --- |
  | **E1** | Valid | C1 | Email đúng định dạng HTML5 |
  | **E2** | Invalid | C1 | Email sai định dạng HTML5 |
  | **E3** | Valid | C2 | Email tồn tại trong hệ thống |
  | **E4** | Invalid | C2 | Email không tồn tại trong hệ thống |
  | **E5** | Valid | C3 | Mật khẩu đúng với tài khoản |
  | **E6** | Invalid | C3 | Mật khẩu không đúng với tài khoản |
  | **E7** | Valid | C4 | Số lần đăng nhập sai liên tiếp < 3 thì không bị khóa |
  | **E8** | Invalid | C4 | Số lần đăng nhập sai liên tiếp từ 3 lần trở lên thì bị khóa 30 giây |

* **Giá trị đại diện:**
  | STT | Lớp tương đương tương ứng | Giá trị đại diện |
  | --- | --- | --- |
  | **1** | E1 | `test@eshop.com` |
  | **2** | E2 | `invalid_email` |
  | **3** | E3 | `test@eshop.com` |
  | **4** | E4 | `unknown@eshop.com` (giả sử email này không tồn tại trong hệ thống) |
  | **5** | E5 | `Test1234!` |
  | **6** | E6 | `WrongPass` |
  | **7** | E7 | Số lần đăng nhập sai liên tiếp là 1 |
  | **8** | E8 | Số lần đăng nhập sai liên tiếp là 4 |

#### **Phân tích Giá trị Biên (Boundary Value Analysis):**
* **Input:** Số lần đăng nhập sai liên tiếp.
* **Xác định biên:**
  * **Điều kiện:** Bị khóa tài khoản xảy ra khi số lần đăng nhập sai liên tiếp từ 3 lần trở lên.
  * **Phân chia miền giá trị:**
    | STT | Điều kiện | Kết quả |
    | --- | --- | --- |
    | **D1** | 0 <= Số lần đăng nhập sai liên tiếp < 3 | Không bị khóa |
    | **D2** | Số lần đăng nhập sai liên tiếp >= 3 | Bị khóa 30 giây |
  * **Cận dưới (Lower Boundary - LB):** 0
  * **Cận trên (Upper Boundary - UB):** 3 (điểm chuyển tiếp giữa miền không khóa và miền bị khóa)
* **Các giá trị biên cần kiểm thử (Boundary Values):**
  | STT | Quy tắc | Giá trị | Ý nghĩa của giá trị | Kết quả mong đợi |
  | --- | --- | --- | --- | --- |
  | **BVA1** | LB − 1 | -1 | Nhỏ hơn cận dưới | Không hợp lệ, không thể thực hiện black box testing cho giá trị này |
  | **BVA2** | LB | 0 | Giá trị nhỏ nhất hợp lệ | Không bị khóa |
  | **BVA3** | LB + 1 | 1 | Ngay trên cận dưới | Không bị khóa |
  | **BVA4** | UB − 1 | 2 | Ngay trước ngưỡng khóa | Không bị khóa |
  | **BVA5** | UB | 3 | Đúng tại ngưỡng khóa | Tài khoản bị khóa trong 30 giây |
  | **BVA6** | UB + 1 | 4 | Ngay sau ngưỡng khóa | Tài khoản bị khóa trong 30 giây |

---

### **4. Danh sách Test Cases cho FR-02**

| ID | Mục tiêu | Coverage | Input | Test step | Test data | Expected Result |
| --- | --- | --- | --- | --- | --- | --- |
| **TC_FR02_01** | Kiểm tra đăng nhập thành công khi tất cả dữ liệu hợp lệ | E1, E3, E5, E7 | Email hợp lệ, tồn tại; mật khẩu đúng; số lần đăng nhập sai liên tiếp = 1 | 1. Mở trang Login.<br>2. Nhập email và mật khẩu.<br>3. Nhấn Login. | Email: test@eshop.com<br>Password: Test1234!<br>Attempts: 1 | Đăng nhập thành công và chuyển đến trang chủ. |
| **TC_FR02_02** | Kiểm tra email sai định dạng HTML5 | E2 | Email sai định dạng và mật khẩu | 1. Mở trang Login.<br>2. Nhập email sai định dạng và mật khẩu.<br>3. Nhấn Login. | Email: invalid-email, Password: Test1234! | Hiển thị lỗi định dạng email HTML5, không gửi yêu cầu đăng nhập. |
| **TC_FR02_03** | Kiểm tra email không tồn tại trong hệ thống | E4 | Email đúng định dạng nhưng không tồn tại | 1. Mở trang Login.<br>2. Nhập email không tồn tại.<br>3. Nhập mật khẩu đúng.<br>4. Nhấn Login. | Email: unknown@eshop.com<br>Password: Test1234! | Đăng nhập thất bại, thông báo email hoặc mật khẩu không đúng. |
| **TC_FR02_04** | Kiểm tra mật khẩu không đúng | E6 | Mật khẩu sai | 1. Mở trang Login.<br>2. Nhập email hợp lệ.<br>3. Nhập mật khẩu sai.<br>4. Nhấn Login. | Email: test@eshop.com<br>Password: WrongPass | Đăng nhập thất bại, thông báo email hoặc mật khẩu không đúng. |
| **TC_FR02_05** | Kiểm tra tài khoản bị khóa khi số lần đăng nhập sai liên tiếp từ 3 lần trở lên | E8 | Failed Attempts = 4 | Đăng nhập khi số lần đăng nhập sai liên tiếp là 4. | Attempts: 4 | Tài khoản bị khóa trong 30 giây, không cho phép đăng nhập. |
| **TC_FR02_06** | Kiểm tra giá trị biên dưới (LB) | BVA-LB | Failed Attempts = 0 | Đăng nhập khi số lần đăng nhập sai liên tiếp là 0. | Attempts: 0 | Tài khoản không bị khóa. |
| **TC_FR02_07** | Kiểm tra giá trị ngay trước ngưỡng khóa (UB−1) | BVA-UB−1 | Failed Attempts = 2 | Đăng nhập khi số lần đăng nhập sai liên tiếp là 2. | Attempts: 2 | Tài khoản không bị khóa. |
| **TC_FR02_08** | Kiểm tra giá trị tại ngưỡng khóa (UB) | BVA-UB | Failed Attempts = 3 | Đăng nhập khi số lần đăng nhập sai liên tiếp là 3. | Attempts: 3 | Tài khoản bị khóa trong 30 giây. |

---

### **5. Kết quả kiểm thử thực tế và Bug Report của FR-02**

**Kết quả quan sát thực tế (Observed Result):**
* **TC_FR02_01:** Hệ thống đăng nhập thành công và chuyển đến trang chủ | **Status: Pass**
* **TC_FR02_02:** Hệ thống báo đăng nhập thất bại | **Status: Pass**
* **TC_FR02_03:** Hệ thống báo đăng nhập thất bại | **Status: Pass**
* **TC_FR02_04:** Hệ thống báo đăng nhập thất bại | **Status: Pass**
* **TC_FR02_05:** Hệ thống báo đăng nhập thât bại | **Status: Pass**
* **TC_FR02_06:** Hệ thống không thông báo lỗi | **Status: Pass**
* **TC_FR02_07:** Hệ thống báo đăng nhập thất bại ở lần đăng nhập hợp lệ tiếp theo | **Status: Fail**
* **TC_FR02_08:** Hệ thống báo đăng nhập thất bại | **Status: Pass**

**Chi tiết Bug Report được ghi nhận:**
* **ID:** `B_FR02_01`
* **Test Case ID:** `TC_FR02_07`
* **Mô tả lỗi:** **Tài khoản bị khóa ở lần đăng nhập hợp lệ tiếp theo (lần thứ 3)**.
* **Mức độ nghiêm trọng (Severity):** **High**
* **Mức độ ưu tiên (Priority):** **High**

---

### **6. Đánh giá và Hạn chế của AI khi sinh kiểm thử cho FR-02**
* **Điểm tốt:** AI hỗ trợ phân tích yêu cầu nhanh chóng và sinh bộ test case ban đầu, rút ngắn thời gian áp dụng Domain Testing và Boundary Value Analysis.
* **Hạn chế được phát hiện:**
  1. **Bỏ sót test case nghiệp vụ:** AI bỏ sót trường hợp *Email không tồn tại trong hệ thống (E4)* do chỉ tập trung vào ràng buộc định dạng HTML5 mà chưa phân tích đầy đủ nghiệp vụ đăng nhập.
  2. **Trùng lặp test case:** AI sinh ra các kịch bản trùng lặp giữa hai kỹ thuật Domain Testing và Boundary Value Analysis do áp dụng độc lập và thiếu tối ưu.
  3. **Đề xuất giá trị biên không thực tế:** AI đề xuất kiểm thử giá trị `-1` cho số lần đăng nhập sai liên tiếp, dù đây là biến nội bộ hệ thống và không thể nhập trực tiếp khi thực hiện kiểm thử hộp đen.
  4. **Không phát hiện được lỗi thực tế:** AI không tìm ra được lỗi tài khoản bị khóa ở lần đăng nhập hợp lệ tiếp theo (Bug `B_FR02_01`) vì AI chỉ sinh kịch bản từ đặc tả yêu cầu giấy tờ chứ không thực thi chương trình thực tế để kiểm chứng.

---

💻 Bạn có muốn tôi hỗ trợ viết khung mã nguồn kiểm thử tự động (Automation Script) bằng Playwright hoặc Selenium cho 8 test case trên để phục vụ cho việc nộp bài HW4 không?