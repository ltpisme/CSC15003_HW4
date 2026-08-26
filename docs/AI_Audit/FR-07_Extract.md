
### **1. Đặc tả Nghiệp vụ & Yêu cầu Giao diện (SRS & GUI) cho FR-07**

**Yêu cầu nghiệp vụ của chức năng FR-07: Giỏ hàng (Shopping Cart)**

* **Hiển thị danh sách sản phẩm** với các cột: **Sản phẩm**, **Đơn giá**, **Số lượng** (có nút +/- để chỉnh), **Thành tiền**, **Thao tác**.
* **Thêm cùng một sản phẩm** vào giỏ sẽ tăng số lượng, không tạo dòng mới.
* **Nút Xóa sản phẩm** phải có dialog xác nhận trước khi thực hiện.
* **Có nút Tiếp tục mua sắm** để quay về trang chủ.
* **Tổng tiền** hiển thị nhãn chính xác: **"Tổng cộng"** (không phải "Tổng tạm tính").
* **Giỏ hàng trống** phải có hình minh họa và thông báo rõ ràng.

**Các tiêu chuẩn giao diện liên quan (GUI, Form, Navigation & Feedback)**

* **Nhất quán ngôn ngữ:** Toàn bộ giao diện dùng tiếng Việt (trừ thuật ngữ kỹ thuật chuẩn).
* **Nhất quán màu sắc:** Các nút hành động tích cực (Submit, Mua hàng) dùng màu xanh dương. Các nút nguy hiểm/hủy bỏ dùng màu đỏ.
* **Nhất quán đơn vị tiền:** Luôn dùng ký hiệu ₫ với định dạng phân cách hàng nghìn.
* **Tiêu đề trang:** Mỗi trang có đúng 1 thẻ `<h1>` mô tả nội dung trang. Mỗi trang chỉ có 1 `<h1>` duy nhất.
* **Tab Order:** Thứ tự focus theo Tab phải đi từ trên xuống dưới, trái sang phải.
* **Thanh điều hướng (Navbar):** Link "Giỏ hàng" phải hiển thị **badge số lượng** sản phẩm trong giỏ.
* **Breadcrumb:** Bắt buộc có ở trang con Giỏ hàng.
* **Phản hồi trực quan:** Sau khi bấm "Thêm vào giỏ", phải có phản hồi trực quan (toast/badge).
* **Xác nhận tác vụ:** Khi xóa item khỏi giỏ phải có dialog xác nhận.
* **Trang trống (Empty State):** Phải có icon/hình minh họa và message thân thiện.

---

### **2. Đặc tả API liên quan đến Giỏ hàng**

* Các API yêu cầu truyền Token ở Header: `Authorization: Bearer <token>`.
* **Lấy giỏ hàng:**
  * **Endpoint:** `GET /api/cart`
* **Thêm vào giỏ hàng:**
  * **Endpoint:** `POST /api/cart`
  * **Body (JSON):** *(Tài liệu nguồn không mô tả chi tiết các trường)*

---

### **3. Phân tích Kỹ thuật Kiểm thử Domain Testing cho FR-07**

* **Input:** Số lượng, sự tồn tại của sản phẩm trong giỏ hàng, trạng thái giỏ hàng và xác nhận xóa.
* **Output:** Thêm sản phẩm thành công, hiển thị giỏ hàng trống, hiển thị danh sách sản phẩm và tổng tiền, xóa sản phẩm khỏi giỏ hàng, hủy xóa sản phẩm và báo lỗi số lượng không hợp lệ.
* **Điều kiện kiểm thử (Conditions):**
  | STT          | Biến                                          | Mô tả                                                                                  |
  | :----------- | :--------------------------------------------- | :--------------------------------------------------------------------------------------- |
  | **C1** | Số lượng                                    | Số lượng sản phẩm muốn thêm phải là số nguyên dương lớn hơn hoặc bằng 1 |
  | **C2** | Sự tồn tại của sản phẩm trong giỏ hàng | Sản phẩm có thể chưa có hoặc đã có sẵn trong giỏ hàng                       |
  | **C3** | Trạng thái giỏ hàng                        | Giỏ hàng có thể trống hoặc không trống                                           |
  | **C4** | Xác nhận xóa                                | Người dùng chọn đồng ý hoặc hủy bỏ khi thực hiện xóa sản phẩm             |
* **Lớp tương đương (Equivalence Class):**
  | STT          | Loại   | Condition | Mô tả                                                     |
  | :----------- | :------ | :-------- | :---------------------------------------------------------- |
  | **E1** | Valid   | C1        | Số lượng là số nguyên dương lớn hơn hoặc bằng 1 |
  | **E2** | Invalid | C1        | Số lượng là số nguyên nhỏ hơn hoặc bằng 0         |
  | **E3** | Invalid | C1        | Số lượng không phải số nguyên                        |
  | **E4** | Valid   | C2        | Sản phẩm chưa tồn tại trong giỏ hàng                 |
  | **E5** | Valid   | C2        | Sản phẩm đã tồn tại trong giỏ hàng                  |
  | **E6** | Valid   | C3        | Giỏ hàng đang trống                                     |
  | **E7** | Valid   | C3        | Giỏ hàng không trống                                    |
  | **E8** | Valid   | C4        | Người dùng xác nhận đồng ý xóa                     |
  | **E9** | Valid   | C4        | Người dùng xác nhận hủy xóa                          |
* **Giá trị đại diện:**
  | STT          | Giá trị đại diện                   |
  | :----------- | :-------------------------------------- |
  | **E1** | 3                                       |
  | **E2** | -5                                      |
  | **E3** | 1.5                                     |
  | **E4** | Laptop (chưa có trong giỏ hàng)     |
  | **E5** | Laptop (đã có sẵn trong giỏ hàng) |
  | **E6** | Giỏ hàng trống                       |
  | **E7** | Giỏ hàng có chứa sản phẩm Laptop  |
  | **E8** | Chọn "Có" khi xác nhận xóa         |
  | **E9** | Chọn "Không" khi xác nhận xóa      |

---

### **4. Phân tích Kỹ thuật Kiểm thử Giá trị Biên (Boundary Value Analysis) cho FR-07**

* **Input:** Số lượng sản phẩm muốn thêm.
* **Xác định biên:**
  * **Điều kiện:** Số lượng sản phẩm hợp lệ phải từ 1 trở lên.
  * **Phân chia miền giá trị:**| STT          | Điều kiện     | Kết quả                               |
    | :----------- | :--------------- | :-------------------------------------- |
    | **D1** | Số lượng <= 0 | Không hợp lệ, không cho phép thêm |
    | **D2** | Số lượng >= 1 | Hợp lệ, thêm sản phẩm thành công |
  * **Lower Boundary (Cận dưới):** 1
  * **Upper Boundary (Cận trên):** Không xác định cụ thể trong SRS
* **Các giá trị biên cần kiểm thử (Boundary Values):**| STT            | Quy tắc | Giá trị | Ý nghĩa của giá trị          | Kết quả mong đợi                                                     |
  | :------------- | :------- | :-------- | :-------------------------------- | :----------------------------------------------------------------------- |
  | **BVA1** | LB − 1  | 0         | Giá trị ngay dưới cận dưới | Không hợp lệ, không cho phép thêm hoặc hiển thị cảnh báo lỗi |
  | **BVA2** | LB       | 1         | Giá trị cận dưới hợp lệ    | Thêm sản phẩm vào giỏ hàng thành công với số lượng 1         |
  | **BVA3** | LB + 1   | 2         | Giá trị ngay trên cận dưới  | Thêm sản phẩm vào giỏ hàng thành công với số lượng 2         |

---

### **5. Danh sách Test Cases cho FR-07**

| ID                   | Mục tiêu                                                                | Coverage   | Input                                                                 | Test step                                                                                                                                                                                                                                                  | Test data                                                                                                                                        | Expected Result                                                                                                                                                          |
| :------------------- | :------------------------------------------------------------------------ | :--------- | :-------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **TC_FR07_01** | Kiểm tra hiển thị khi giỏ hàng trống                                | E6, BVA-LB | Giỏ hàng trống                                                     | 1. Mở trang Giỏ hàng.                                                                                                                                                                                                                                   | Giỏ hàng trống                                                                                                                                | Hiển thị thông báo Giỏ hàng của bạn đang trống và liên kết Tiếp tục mua sắm.                                                                             |
| **TC_FR07_02** | Kiểm tra hiển thị khi giỏ hàng không trống                         | E7         | Giỏ hàng chứa sản phẩm                                           | 1. Mở trang Giỏ hàng.                                                                                                                                                                                                                                   | Giỏ hàng chứa 1 sản phẩm: iPhone 15 Pro Max, số lượng: 1, giá: 30,000,000 VND                                                           | Hiển thị danh sách sản phẩm, giá bán, số lượng, thành tiền của từng sản phẩm và tổng tiền giỏ hàng.                                                 |
| **TC_FR07_03** | Kiểm tra thêm sản phẩm mới vào giỏ hàng với số lượng hợp lệ | E1, E4     | Thêm sản phẩm chưa có trong giỏ hàng với số lượng hợp lệ | 1. Mở trang chi tiết sản phẩm.2. Nhập số lượng.3. Nhấn nút Thêm vào giỏ hàng.4. Mở trang Giỏ hàng.                                                                                                                                        | Sản phẩm: iPhone 15 Pro Max, giá 30,000,000 VNDSố lượng: 3                                                                                 | Sản phẩm được thêm vào giỏ hàng với số lượng là 3, tổng tiền tăng thêm tương ứng là 90,000,000 VND.                                                |
| **TC_FR07_04** | Kiểm tra thêm sản phẩm đã tồn tại trong giỏ hàng                | E1, E5     | Thêm sản phẩm đã có trong giỏ hàng với số lượng hợp lệ  | 1. Mở trang chi tiết sản phẩm đã có trong giỏ hàng.2. Nhập số lượng lần 1.3. Nhấn nút Thêm vào giỏ hàng lần 1.4. Mở trang Giỏ hàng.5. Nhập số lượng lần 2.6. Nhấn nút Thêm vào giỏ hàng lần 2.7. Mở trang Giỏ hàng. | Sản phẩm: iPhone 15 Pro Max, giá: 30,000,000 VND, đã có sẵn 1 sản phẩm trong giỏSố lượng thêm lần 1: 3Số lượng thêm lần 2: 1 | Số lượng sản phẩm iPhone 15 Pro Max trong giỏ hàng tăng lên thành 4, tổng tiền cập nhật tương ứng.                                                      |
| **TC_FR07_05** | Kiểm tra thêm sản phẩm với số lượng không phải số nguyên      | E3         | Nhập số lượng không hợp lệ                                     | 1. Mở trang chi tiết sản phẩm.2. Nhập số lượng không phải số nguyên.3. Nhấn nút Thêm vào giỏ hàng.                                                                                                                                       | Sản phẩm: iPhone 15 Pro Max, giá: 30,000,000 VNDSố lượng: 1.5                                                                              | Hệ thống chỉ chấp nhận số nguyên dương. Khi nhập giá trị không phải số nguyên, hệ thống phải từ chối và thông báo lỗi.                          |
| **TC_FR07_06** | Kiểm tra thêm sản phẩm với số lượng là số nguyên âm           | E2         | Nhập số lượng là số nguyên âm                                 | 1. Mở trang chi tiết sản phẩm.2. Nhập số lượng nguyên âm.3. Nhấn nút Thêm vào giỏ hàng.                                                                                                                                                    | Sản phẩm: iPhone 15 Pro Max, giá: 30,000,000 VNDSố lượng: -5                                                                               | Hệ thống báo lỗi số lượng không hợp lệ và không cho phép thêm vào giỏ hàng.                                                                             |
| **TC_FR07_07** | Kiểm tra xác nhận xóa sản phẩm khỏi giỏ hàng                     | E8         | Chọn xóa sản phẩm và đồng ý                                   | 1. Mở trang Giỏ hàng.2. Nhấn nút Xóa bên cạnh sản phẩm.3. Chọn Có tại hộp thoại xác nhận.                                                                                                                                                 | Sản phẩm trong giỏ: iPhone 15 Pro Max                                                                                                         | Hệ thống hiển thị một diaglog xác nhận xóa trước khi xóa. Sản phẩm Laptop bị xóa khỏi giỏ hàng, danh sách sản phẩm và tổng tiền cập nhật lại. |
| **TC_FR07_08** | Kiểm tra hủy xóa sản phẩm khỏi giỏ hàng                           | E9         | Chọn xóa sản phẩm nhưng hủy bỏ                                 | 1. Mở trang Giỏ hàng.2. Nhấn nút Xóa bên cạnh sản phẩm.3. Chọn Không tại hộp thoại xác nhận.                                                                                                                                              | Sản phẩm trong giỏ: iPhone 15 Pro Max                                                                                                         | Việc xóa bị hủy, sản phẩm Laptop vẫn giữ nguyên trong giỏ hàng.                                                                                               |
| **TC_FR07_09** | Kiểm tra giá trị biên dưới - 1 (LB - 1) của số lượng            | BVA-LB-1   | Số lượng bằng 0                                                   | 1. Mở trang chi tiết sản phẩm.2. Nhập số lượng bằng 0.3. Nhấn nút Thêm vào giỏ hàng.                                                                                                                                                        | Số lượng: 0                                                                                                                                   | Hệ thống không cho phép thêm sản phẩm hoặc hiển thị cảnh báo lỗi số lượng tối thiểu là 1.                                                             |

**Lưu ý:** Vì không có quy định về UB nên chỉ có 2 miền giá trị là 0 và khác 0, nên ở trường hợp valid như TC_FR07_01 sẽ bao quát cả các trường hợp được phân tích trong BVA vì không có boundary thật sự.

---

### **6. Kết quả Kiểm thử Thực tế & Danh sách Bug của FR-07**

**Bảng kết quả quan sát thực tế (Observed Result):**

| ID                   | Observed Result (Kết quả quan sát thực tế)                                                                                                                      | Status (Trạng thái) |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------- |
| **TC_FR07_01** | Hệ thống thông báo giỏ hàng trống                                                                                                                             | **Pass**        |
| **TC_FR07_02** | Hệ thống hiển thị đúng thông tin về tên sản phẩm, số lượng và giá tiền                                                                              | **Pass**        |
| **TC_FR07_03** | Hệ thống hiển thị đúng thông tin về tên sản phẩm, số lượng và tổng thành tiền (không phải "Tổng tạm tính")                                    | **Pass**        |
| **TC_FR07_04** | Hệ thống không cập nhật lại số lượng sản phẩm mà tạo thêm một dòng mới như một sản phẩm mới                                                    | **Fail**        |
| **TC_FR07_05** | Hệ thống không thông báo về định dạng lỗi (không phải số nguyên), nhưng tự động hiển thị giá trị phần nguyên (giá trị: 1) trong giỏ hàng | **Fail**        |
| **TC_FR07_06** | Hệ thống không thông báo lỗi và vẫn thêm với số lượng giá trị âm (-5) và tổng thành tiền của sản phẩm với giá trị âm                      | **Fail**        |
| **TC_FR07_07** | Hệ thống không hiển thị dialog xác nhận, trực tiếp xóa sản phẩm sau khi bấm                                                                             | **Fail**        |
| **TC_FR07_08** | Hệ thống không hiển thị dialog xác nhận, không thể hủy tác vụ xóa sau khi bấm                                                                          | **Fail**        |
| **TC_FR07_09** | Hệ thống vẫn cho phép thêm sản phẩm với số lượng 0                                                                                                        | **Fail**        |

**Chi tiết danh sách Bug Report:**

| ID                  | Test Case ID | Mô tả                                                                                                                                                              | Mức độ nghiêm trọng | Mức độ ưu tiên |
| :------------------ | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------- | :------------------ |
| **B_FR07_01** | TC_FR07_04   | Hệ thống không cập nhật lại số lượng sản phẩm mà tạo thêm một dòng mới như một sản phẩm mới                                                    | High                     | High                |
| **B_FR07_02** | TC_FR07_05   | Hệ thống không thông báo về định dạng lỗi (không phải số nguyên), nhưng tự động hiển thị giá trị phần nguyên (giá trị: 1) trong giỏ hàng | Medium                   | Medium              |
| **B_FR07_03** | TC_FR07_06   | Hệ thống không thông báo lỗi và vẫn thêm với số lượng giá trị âm (-5) và tổng thành tiền của sản phẩm với giá trị âm                      | High                     | High                |
| **B_FR07_04** | TC_FR07_07   | Hệ thống không hiển thị dialog xác nhận, trực tiếp xóa sản phẩm sau khi bấm                                                                             | High                     | High                |
| **B_FR07_05** | TC_FR07_08   | Hệ thống không hiển thị dialog xác nhận, không thể hủy tác vụ xóa sau khi bấm                                                                          | High                     | High                |
| **B_FR07_06** | TC_FR07_09   | Hệ thống vẫn cho phép thêm sản phẩm với số lượng 0                                                                                                        | Medium                   | Medium              |

---

### **7. Đánh giá và Hạn chế của AI khi sinh kiểm thử cho FR-07**

* **Ưu điểm:** AI hỗ trợ tốt trong việc xác định các biến đầu vào, trạng thái của hệ thống và xây dựng cấu trúc phân tích Domain Testing có tính nhất quán, giúp rút ngắn thời gian thực hiện và đảm bảo khả năng truy vết từ yêu cầu đến test case.
* **Hạn chế:**
  * AI chỉ xác định miền hợp lệ cho biến **Số lượng** mà bỏ sót các miền không hợp lệ như giá trị âm, bằng 0 và số thập phân.
  * AI không nhận diện điều kiện **sản phẩm đã tồn tại trong giỏ hàng**, dẫn đến thiếu test case kiểm tra việc cập nhật số lượng khi thêm cùng một sản phẩm.
  * AI cho rằng **Boundary Value Analysis không áp dụng được** nên không sinh các test case tại cận dưới (0, 1, 2), làm giảm khả năng phát hiện lỗi.
* **Nguyên nhân:** AI phân tích theo các ràng buộc được mô tả trực tiếp trong SRS nhưng chưa suy luận được các ràng buộc nghiệp vụ ngầm định.

---

💻 Bạn có muốn tôi hỗ trợ sinh khung mã nguồn kiểm thử tự động (Automation Script) sử dụng thư viện Playwright hoặc Selenium bằng ngôn ngữ JavaScript/TypeScript dựa trên đúng 9 test case phía trên để phục vụ cho bài nộp HW4 không?
