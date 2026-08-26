
### **1. Đặc tả Nghiệp vụ (SRS) cho FR-16: Import Sản phẩm từ CSV**

* **Mô tả chức năng:** Admin có thể tải lên file CSV để import nhiều sản phẩm cùng lúc.
* **Yêu cầu đối với file CSV:**
  * Đuôi file phải là **`.csv`**.
  * Dòng đầu tiên là header: **`name,price,description,imageUrl,category_id`**.
  * Hỗ trợ các trường có chứa dấu phẩy nếu được bọc trong dấu nháy kép (RFC 4180).
* **Validation trước khi import:**
  * **`name`** không được rỗng.
  * **`price`** phải là số dương.
* **Cơ chế xử lý lỗi:** Nếu có lỗi ở bất kỳ dòng nào, toàn bộ import phải được **rollback** (giao dịch nguyên tử — all-or-nothing).
* **Báo cáo kết quả:** Hệ thống hiển thị báo cáo rõ ràng: bao nhiêu dòng thành công, bao nhiêu dòng lỗi và lý do.

---

### **2. Đặc tả API liên quan đến FR-16**

* **Yêu cầu chung:** Các API dành cho Admin yêu cầu truyền Token ở Header: `Authorization: Bearer <token>` và tài khoản phải có quyền Admin (`role = 'admin'`).
* **API Import:**
  * **Endpoint:** `POST /api/admin/import-products`
  * **Body (JSON):** *(Tài liệu không mô tả chi tiết cấu trúc JSON)*
  * **Base URL mặc định:** `http://localhost:3000`

**Tài khoản Admin mặc định:** `admin@eshop.com` / `Admin123!`

---

### **3. Phân tích Kỹ thuật Kiểm thử Domain Testing cho FR-16**

* **Input:** đuôi file, dòng header, dấu phẩy trong trường dữ liệu, name và price.
* **Output:** import thành công, lỗi định dạng file không hỗ trợ, lỗi dòng header không hợp lệ, lỗi dấu phẩy trong trường dữ liệu, lỗi tên trống, lỗi giá sản phẩm không hợp lệ.
* **Điều kiện kiểm thử (Conditions):**
  | STT          | Biến                               | Mô tả                                                                                            |
  | ------------ | ----------------------------------- | -------------------------------------------------------------------------------------------------- |
  | **C1** | Đuôi file                         | File import phải có đuôi là .csv                                                              |
  | **C2** | Dòng header                        | Dòng đầu tiên của file phải đúng định dạng: name,price,description,imageUrl,category_id |
  | **C3** | Dấu phẩy trong trường dữ liệu | Các trường dữ liệu có chứa dấu phẩy phải được bao bọc trong dấu nháy kép          |
  | **C4** | name                                | Tên sản phẩm không được để trống (độ dài > 0)                                         |
  | **C5** | price                               | Giá sản phẩm phải lớn hơn 0                                                                  |
* **Lớp tương đương (Equivalence Class):**
  | STT           | Loại   | Condition | Mô tả                                                                       |
  | ------------- | ------- | --------- | ----------------------------------------------------------------------------- |
  | **E1**  | Valid   | C1        | File có đuôi .csv                                                          |
  | **E2**  | Invalid | C1        | File không có đuôi .csv (ví dụ .xlsx, .txt)                             |
  | **E3**  | Valid   | C2        | Dòng header đúng cấu trúc "name,price,description,imageUrl,category_id"  |
  | **E4**  | Invalid | C2        | Dòng header sai cấu trúc hoặc thiếu trường                             |
  | **E5**  | Valid   | C3        | Trường dữ liệu chứa dấu phẩy được bọc trong dấu nháy kép        |
  | **E6**  | Invalid | C3        | Trường dữ liệu chứa dấu phẩy không được bọc trong dấu nháy kép |
  | **E7**  | Valid   | C4        | Tên sản phẩm có độ dài > 0                                             |
  | **E8**  | Invalid | C4        | Tên sản phẩm trống (độ dài = 0)                                        |
  | **E9**  | Valid   | C5        | Giá sản phẩm > 0                                                           |
  | **E10** | Invalid | C5        | Giá sản phẩm <= 0                                                          |
* **Giá trị đại diện:**
  | STT          | Lớp tương đương tương ứng | Giá trị đại diện                           |
  | ------------ | ---------------------------------- | ----------------------------------------------- |
  | **1**  | E1                                 | `.csv`                                        |
  | **2**  | E2                                 | `.xlsx`                                       |
  | **3**  | E3                                 | `name,price,description,imageUrl,category_id` |
  | **4**  | E4                                 | `name,price`                                  |
  | **5**  | E5                                 | `'"iPhone, 13",1000,"Desc",http://url.com,1'` |
  | **6**  | E6                                 | `'iPhone, 13,1000,"Desc",http://url.com,1'`   |
  | **7**  | E7                                 | `"iPhone 13"`                                 |
  | **8**  | E8                                 | `""`                                          |
  | **9**  | E9                                 | `1000`                                        |
  | **10** | E10                                | `-50`                                         |

---

### **4. Phân tích Kỹ thuật Kiểm thử Giá trị Biên (Boundary Value Analysis) cho FR-16**

* **Input:** tên sản phẩm (độ dài) và giá sản phẩm.
* **Xác định biên:**

  * **Tên sản phẩm:**
    * Điều kiện: Độ dài tên sản phẩm phải lớn hơn 0 (từ 1 trở lên).
    * Từ điều kiện chia thành 2 miền:
      * **D1:** Độ dài = 0 (Không hợp lệ).
      * **D2:** Độ dài >= 1 (Hợp lệ).
    * Cận dưới (Lower Boundary): 1.
    * Cận trên (Upper Boundary): Không xác định cụ thể trong SRS.
  * **Giá sản phẩm:**
    * Điều kiện: Giá sản phẩm phải lớn hơn 0.
    * Từ điều kiện chia thành 2 miền:
      * **D3:** Giá <= 0 (Không hợp lệ).
      * **D4:** Giá > 0 (Hợp lệ).
    * Cận dưới (Lower Boundary): 0.01 (hoặc giá trị dương nhỏ nhất lớn hơn 0).
    * Cận trên (Upper Boundary): Không xác định cụ thể trong SRS.
* **Các giá trị biên cần kiểm thử (Boundary Values):**

  | STT            | Quy tắc                          | Giá trị | Ý nghĩa                                                     | Kết quả mong đợi                       |
  | -------------- | --------------------------------- | --------- | ------------------------------------------------------------- | ------------------------------------------ |
  | **BVA1** | LB − 1 (tên)                    | 0         | Nhỏ hơn cận dưới của độ dài tên sản phẩm          | Không hợp lệ, báo lỗi tên trống     |
  | **BVA2** | LB (tên)                         | 1         | Giá trị cận dưới hợp lệ của độ dài tên sản phẩm | Hợp lệ, import thành công              |
  | **BVA3** | LB (giá)                         | 0         | Giá trị cận dưới không hợp lệ của giá               | Không hợp lệ, báo lỗi giá sản phẩm |
  | **BVA4** | LB + 0.01 (giá)                  | 0.01      | Giá trị dương nhỏ nhất hợp lệ của giá               | Hợp lệ, import thành công              |
  | **BVA5** | UB − 0.01 (giá không hợp lệ) | -0.01     | Giá trị âm nhỏ nhất sát ngưỡng                        | Không hợp lệ, báo lỗi giá sản phẩm |

---

### **5. Danh sách Test Cases cho FR-16**

| ID                   | Mục tiêu                                                                                                            | Coverage       | Input                               | Test step                                                                                                                                    | Test data                                                                                                      | Expected Result                                                                                                                                                       |
| -------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TC_FR16_01** | Kiểm tra import file có đuôi .csv                                                                                 | E1             | Đuôi file                         | 1. Đăng nhập tài khoản admin.2. Upload file có đuôi .csv.                                                                            | File:`products.csv`                                                                                          | Định dạng file được chấp nhận và hệ thống tiếp tục xử lý import.                                                                                       |
| **TC_FR16_02** | Kiểm tra import file không có đuôi .csv                                                                          | E2             | Đuôi file                         | 1. Đăng nhập tài khoản admin.2. Upload file có đuôi .xlsx.                                                                           | File:`products.xlsx`                                                                                         | Hệ thống báo lỗi định dạng file không được hỗ trợ và không thực hiện import.                                                                         |
| **TC_FR16_03** | Kiểm tra dòng header đúng định dạng và trường dữ liệu chứa dấu phẩy được bọc trong dấu nháy kép | E3, E5, E7, E9 | Header, Dữ liệu CSV               | 1. Đăng nhập tài khoản admin.2. Import file CSV có header đúng chuẩn và dữ liệu hợp lệ.                                        | Header:`name,price,description,imageUrl,category_id`Dữ liệu: `"iPhone, 13",1000,"Desc",http://url.com,1` | Header hợp lệ, trường chứa dấu phẩy được phân tích đúng theo RFC 4180, tên sản phẩm được lưu là iPhone, 13, giá là 1000, import thành công. |
| **TC_FR16_04** | Kiểm tra dòng header sai định dạng                                                                               | E4             | Dòng header                        | 1. Đăng nhập tài khoản admin.2. Import file CSV có dòng header thiếu trường.                                                       | Header:`name,price`Dữ liệu: `"A",100`                                                                    | Hệ thống báo lỗi cấu trúc header không hợp lệ và hủy bỏ toàn bộ quá trình import.                                                                     |
| **TC_FR16_05** | Kiểm tra trường dữ liệu chứa dấu phẩy không được bọc trong dấu nháy kép                               | E6             | Dấu phẩy trong trường dữ liệu | 1. Đăng nhập tài khoản admin.2. Import file CSV có trường dữ liệu chứa dấu phẩy nhưng không được bao bởi dấu nháy kép. | Header:`name,price,description,imageUrl,category_id`Dữ liệu: `iPhone, 13,1000,"Desc",http://url.com,1`   | Hệ thống báo lỗi cú pháp dữ liệu CSV và hủy bỏ toàn bộ quá trình import.                                                                               |
| **TC_FR16_06** | Kiểm tra tên sản phẩm trống (độ dài = 0)                                                                      | E8, BVA1       | Tên sản phẩm                     | 1. Đăng nhập tài khoản admin.2. Import file CSV chứa dòng sản phẩm có tên trống.                                                 | Tên:`""`                                                                                                    | Hệ thống báo lỗi tên sản phẩm không được để trống và hủy bỏ toàn bộ quá trình import.                                                            |
| **TC_FR16_07** | Kiểm tra giá sản phẩm bằng 0 (giá không hợp lệ)                                                              | E10, BVA3      | Giá sản phẩm                     | 1. Đăng nhập tài khoản admin.2. Import file CSV chứa dòng sản phẩm có giá bằng 0.                                                | Giá:`0`                                                                                                     | Hệ thống báo lỗi giá sản phẩm phải lớn hơn 0 và hủy bỏ toàn bộ quá trình import.                                                                     |
| **TC_FR16_08** | Kiểm tra giá sản phẩm bằng 0.01 (giá hợp lệ)                                                                  | E9, BVA4       | Giá sản phẩm                     | 1. Đăng nhập tài khoản admin.2. Import file CSV chứa dòng sản phẩm có giá bằng 0.01.                                             | Giá:`0.01`                                                                                                  | Giá sản phẩm hợp lệ, dữ liệu được ghi nhận và import thành công.                                                                                        |
| **TC_FR16_09** | Kiểm tra giá sản phẩm bằng -0.01 (giá âm sát ngưỡng)                                                        | BVA6           | Giá sản phẩm                     | 1. Đăng nhập tài khoản admin.2. Import file CSV chứa dòng sản phẩm có giá bằng -0.01.                                            | Giá:`-0.01`                                                                                                 | Hệ thống báo lỗi giá sản phẩm phải lớn hơn 0 và hủy bỏ toàn bộ quá trình import.                                                                     |

---

### **6. Kết quả Kiểm thử Thực tế và Danh sách Bug của FR-16**

**Bảng kết quả quan sát thực tế (Observed Result):**

| ID                   | Observed Result (Kết quả quan sát thực tế)                                                             | Status         |
| -------------------- | ----------------------------------------------------------------------------------------------------------- | -------------- |
| **TC_FR16_01** | Hệ thống cho phép import file product.csv                                                                | **Pass** |
| **TC_FR16_02** | Hệ thống cho phép import file product.xlsx                                                               | **Fail** |
| **TC_FR16_03** | Hệ thống import sai dữ liệu với tên: "iPhone và giá tiền 13"                                       | **Fail** |
| **TC_FR16_04** | Hệ thống cho phép import mà không báo lỗi, link ảnh được hiển thị giống như tên sản phẩm  | **Fail** |
| **TC_FR16_05** | Hệ thống cho phép import với tên bị lỗi (giá trị là `iPhone) và giá bị lỗi (giá trị là 13) | **Fail** |
| **TC_FR16_06** | Hệ thống không cho import với tên rỗng, có thông báo lỗi thiếu tên sản phẩm                   | **Pass** |
| **TC_FR16_07** | Hệ thống cho phép import với giá tiền 0                                                               | **Fail** |
| **TC_FR16_08** | Hệ thống cho phép import với giá tiền 0.01 và hiển thị đúng                                      | **Pass** |
| **TC_FR16_09** | Hệ thống cho phép import với giá tiền -0.01                                                           | **Fail** |

**Chi tiết danh sách Bug Report:**

| ID                  | Test Case ID           | Mô tả lỗi                                                                                                                                                                                                                                                | Mức độ nghiêm trọng | Mức độ ưu tiên |
| ------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------- |
| **B_FR16_01** | TC_FR16_02             | Hệ thống chấp nhận file không có phần mở rộng .csv (ví dụ .xlsx) thay vì từ chối theo yêu cầu SRS.                                                                                                                                          | High                     | High                |
| **B_FR16_02** | TC_FR16_04             | Hệ thống không kiểm tra tính hợp lệ của dòng header, vẫn thực hiện import khi header sai cấu trúc hoặc thiếu trường.                                                                                                                      | High                     | High                |
| **B_FR16_03** | TC_FR16_03, TC_FR16_05 | Hệ thống phân tích cú pháp (CSV parser) không tuân theo RFC 4180. Trường dữ liệu chứa dấu phẩy được bọc trong dấu nháy kép vẫn bị tách sai, đồng thời dữ liệu không được bọc dấu nháy kép cũng không bị từ chối. | High                     | High                |
| **B_FR16_04** | TC_FR16_07, TC_FR16_09 | Hệ thống không kiểm tra ràng buộc price > 0, vẫn cho phép import sản phẩm có giá bằng 0 hoặc giá âm.                                                                                                                                        | Medium                   | High                |

---

### **7. Đánh giá và Hạn chế của AI khi sinh kiểm thử cho FR-16**

* **Ưu điểm:** AI hỗ trợ tốt trong việc xác định các điều kiện kiểm thử (đuôi file, header, dấu phẩy trong dữ liệu, tên sản phẩm và giá sản phẩm), xây dựng các Equivalence Class và Boundary Value cho trường *name* và *price*. AI cũng đề xuất đầy đủ các test case cơ bản tương ứng với từng miền hợp lệ và không hợp lệ.
* **Hạn chế được phát hiện:**
  * AI tạo các test case bị trùng lặp giữa Domain Testing và Boundary Value Analysis (Ví dụ: trường hợp tên sản phẩm trống và giá bằng 0 xuất hiện ở cả hai kỹ thuật nên sau đó phải gộp lại để tránh kiểm thử dư thừa).
  * AI không đề xuất test case kết hợp **header hợp lệ + dữ liệu chứa dấu phẩy được đặt trong dấu nháy kép** để kiểm tra khả năng phân tích cú pháp CSV (Sau khi con người bổ sung thêm TC_FR16_03 mới phát hiện ra hệ thống tách sai dữ liệu, lưu tên thành "iPhone và giá thành 13").
  * AI không dự đoán được trường hợp hệ thống **vẫn chấp nhận dữ liệu CSV không đúng cú pháp** (Dòng `iPhone, 13,1000,"Desc",http://url.com,1` không được bao bởi dấu nháy kép nhưng vẫn được import thay vì báo lỗi ở TC_FR16_05).

---

💻 Tôi có thể giúp bạn tạo file dữ liệu mẫu (`products.csv`) và viết khung kịch bản kiểm thử tự động (Automation Script) bằng Playwright hoặc Selenium cho 9 test case phía trên để phục vụ cho bài nộp HW4 không?
