# Report
> Homework 2: Domain Testing and Boundary Analysis
---
> Lê Thanh Phong
> 23127452
---

## 1. Pool A - Feature FR-02: Login and account lockout
### 1.1. Phân tích
**Domain Testing**
- Input: Email, mật khẩu và số lần đăng nhập
- Output: Đăng nhập thành công, đăng nhập thất bại và bị khóa tài khoản 30 giây
- Condition:
    | STT | Biến | Mô tả |
    | - | - | - |
    | C1 | Email | Email phải đúng format email của HTML5 |
    | C2 | Email | Email phải tồn tại trong hệ thống |
    | C3 | Mật khẩu | Mật khẩu đúng với tài khoản đăng nhập |
    | C4 | Số lần đăng nhập | Số lần đăng nhập sai liên tiếp từ 3 lần trở lên thì bị khóa tài khoản trong 30 giây |
- Equivalence Class:
    | STT | Loại | Condition | Mô tả |
    | - | - | - | - |
    | E1 | Valid | C1 | Email đúng định dạng HTML5 |
    | E2 | Invalid | C1 | Email sai định dạng HTML5 |
    | E3 | Valid | C2 | Email tồn tại trong hệ thống |
    | E4 | Invalid | C2 | Email không tồn tại trong hệ thống |
    | E5 | Valid | C3 | Mật khẩu đúng với tài khoản |
    | E6 | Invalid | C3 | Mật khẩu không đúng với tài khoản |
    | E7 | Valid | C4 | Số lần đăng nhập sai liên tiếp < 3 thì không bị khóa |
    | E8 | Invalid | C4 | Số lần đăng nhập sai liên tiếp từ 3 lần trở lên thì bị khóa 30 giây |
- Giá trị đại diện
    | STT | Giá trị đại diện |
    | - | - |
    | E1 | test@eshop.com |
    | E2 | invalid_email |
    | E3 | test@eshop.com |
    | E4 | unknown@eshop.com (giả sử email này không tồn tại trong hệ thống) |
    | E5 | Test1234! |
    | E6 | WrongPass |
    | E7 | Số lần đăng nhập sai liên tiếp là 1 |
    | E8 | Số lần đăng nhập sai liên tiếp là 4 |

**Boundary Value Analysis**
- Input: số lần đâng nhập sai liên tiếp
- Boundary: 
    - Điều kiện: Bị khóa tài khoản xảy ra khi số lần đăng nhập sai liên tiếp từ 3 lần trở lên
    - Từ điều kiện chia thành 2 miền

    | STT | Điều kiện | Kết quả |
    | - | - | - |
    | D1 | 0 <= Số lần đăng nhập sai liên tiếp < 3 | Không bị khóa |
    | D2 | Số lần đăng nhập sai liên tiếp >=3 | Bị khóa 30 giây |

    - Lower Boundary: 0
    - Upper Boundary: 3 (chuyển giữa 2 miền khóa và miền không bị khóa)
- Boundary Values:
    |STT | Quy tắc | Giá trị | Ý nghĩa | Kết quả mong đợi |
    | - | - | - | - | - |
    | BVA1 | LB − 1 | -1 | Nhỏ hơn cận dưới | Không hợp lệ, không thể thực hiện black box testing cho giá trị này |
    |BVA2 | LB | 0 | Giá trị nhỏ nhất hợp lệ | Không bị khóa |
    | BVA3 | LB + 1 | 1 | Ngay trên cận dưới | Không bị khóa |
    | BVA4 | UB − 1 | 2 | Ngay trước ngưỡng khóa | Không bị khóa |
    | BVA5 | UB | 3 | Đúng tại ngưỡng khóa | Tài khoản bị khóa trong 30 giây |
    | BVA6 | UB + 1 | 4 | Ngay sau ngưỡng khóa | Tài khoản bị khóa trong 30 giây |

### 1.2. Test case
| ID | Mục tiêu | Coverage | Input | Test step | Test data | Expected Result |
| - | - | - | - | - | - | - |
| TC_FR02_01 | Kiểm tra đăng nhập thành công khi tất cả dữ liệu hợp lệ | E1, E3, E5, E7 | Email hợp lệ, tồn tại; mật khẩu đúng; số lần đăng nhập sai liên tiếp = 1 | 1. Mở trang Login.<br>2. Nhập email và mật khẩu.<br>3. Nhấn Login. | Email: `test@eshop.com`<br>Password: `Test1234!`<br>Attempts: 1 | Đăng nhập thành công và chuyển đến trang chủ. |
| TC_FR02_02 | Kiểm tra email sai định dạng HTML5 | E2 | Email sai định dạng và mật khẩu | 1. Mở trang Login.<br>2. Nhập email sai định dạng và mật khẩu.<br>3. Nhấn Login. | Email: `invalid-email`, Password: `Test1234!` | Hiển thị lỗi định dạng email HTML5, không gửi yêu cầu đăng nhập. |
| TC_FR02_03 | Kiểm tra email không tồn tại trong hệ thống | E4 | Email đúng định dạng nhưng không tồn tại | 1. Mở trang Login.<br>2. Nhập email không tồn tại.<br>3. Nhập mật khẩu đúng.<br>4. Nhấn Login. | Email: `unknown@eshop.com`<br>Password: `Test1234!` | Đăng nhập thất bại, thông báo email hoặc mật khẩu không đúng. |
| TC_FR02_04 | Kiểm tra mật khẩu không đúng | E6 | Mật khẩu sai | 1. Mở trang Login.<br>2. Nhập email hợp lệ.<br>3. Nhập mật khẩu sai.<br>4. Nhấn Login. | Email: `test@eshop.com`<br>Password: `WrongPass` | Đăng nhập thất bại, thông báo email hoặc mật khẩu không đúng. |
| TC_FR02_05 | Kiểm tra tài khoản bị khóa khi số lần đăng nhập sai liên tiếp từ 3 lần trở lên | E8 | Failed Attempts = 4 | Đăng nhập khi số lần đăng nhập sai liên tiếp là 4. | Attempts: 4 | Tài khoản bị khóa trong 30 giây, không cho phép đăng nhập. |
| TC_FR02_06 | Kiểm tra giá trị biên dưới (LB) | BVA-LB | Failed Attempts = 0 | Đăng nhập khi số lần đăng nhập sai liên tiếp là 0. | Attempts: 0 | Tài khoản không bị khóa. |
| TC_FR02_07 | Kiểm tra giá trị ngay trước ngưỡng khóa (UB−1) | BVA-UB−1 | Failed Attempts = 2 | Đăng nhập khi số lần đăng nhập sai liên tiếp là 2. | Attempts: 2 | Tài khoản không bị khóa. |
| TC_FR02_08 | Kiểm tra giá trị tại ngưỡng khóa (UB) | BVA-UB | Failed Attempts = 3 | Đăng nhập khi số lần đăng nhập sai liên tiếp là 3. | Attempts: 3 | Tài khoản bị khóa trong 30 giây. |

### 1.3. Test Result
| ID | Observed Result | Status |
| - | - | - |
| TC_FR02_01 | Hệ thống đăng nhập thành công và chuyển đến trang chủ | Pass |
| TC_FR02_02 | Hệ thống báo đăng nhập thất bại | Pass |
| TC_FR02_03 | Hệ thống báo đăng nhập thất bại | Pass |
| TC_FR02_04 | Hệ thống báo đăng nhập thất bại | Pass |
| TC_FR02_05 | Hệ thống báo đăng nhập thât bại | Pass |
| TC_FR02_06 | Hệ thống không thông báo lỗi | Pass |
| TC_FR02_07 | Hệ thống báo đăng nhập thất bại ở lần đăng nhập hợp lệ tiếp theo | Fail |
| TC_FR02_08 | Hệ thống báo đăng nhập thất bại | Pass |

### 1.5. Bug Report
| ID | Test Case ID | Mô tả | Mức độ nghiêm trọng | Mức độ ưu tiên |
| - | - | - | - | - |
| B_FR02_01 | TC_FR02_07 | Tài khoản bị khóa ở lần đăng nhập hợp lệ tiếp theo (lần 3) | High | High |

**Minh chứng Github**
![B_FR02_01](../assets/B_FR02_01.png)

### 1.4. Đánh giá AI
AI hỗ trợ tốt trong việc phân tích yêu cầu và sinh bộ test case ban đầu, giúp rút ngắn thời gian áp dụng kỹ thuật Domain Testing và Boundary Value Analysis. Tuy nhiên, sau khi rà soát và thực hiện kiểm thử thực tế, nhận thấy AI vẫn còn một số khoảng trống. 

Thứ nhất, AI bỏ sót test case cho trường hợp **Email không tồn tại trong hệ thống (E4)** do chỉ tập trung vào ràng buộc về định dạng email mà chưa phân tích đầy đủ điều kiện nghiệp vụ của chức năng đăng nhập. 

Thứ hai, AI sinh một số test case trùng lặp giữa Domain Testing và Boundary Value Analysis vì áp dụng hai kỹ thuật một cách độc lập mà chưa tối ưu độ bao phủ. 

Ngoài ra, AI còn đề xuất kiểm thử giá trị **-1** cho số lần đăng nhập sai liên tiếp theo quy tắc Boundary Value Analysis, mặc dù đây là biến nội bộ của hệ thống và không thể nhập trực tiếp trong kiểm thử hộp đen. 

Cuối cùng, AI không phát hiện được lỗi thực tế của hệ thống khi tài khoản bị khóa ở lần đăng nhập hợp lệ tiếp theo, vì AI chỉ sinh test case dựa trên đặc tả yêu cầu mà không thực thi chương trình để quan sát hành vi thực tế. 

Do đó, kết quả do AI sinh cần được người kiểm thử rà soát, bổ sung và xác nhận bằng quá trình thực thi test để đảm bảo bộ test đầy đủ và phát hiện được các lỗi của hệ thống.

## 2. Pool B - Feature FR-07: Shopping cart

### 2.1. Phân tích
**Domain Testing**
- Input: số lượng, sự tồn tại của sản phẩm trong giỏ hàng, trạng thái giỏ hàng và xác nhận xóa
- Output: thêm sản phẩm thành công, hiển thị giỏ hàng trống, hiển thị danh sách sản phẩm và tổng tiền, xóa sản phẩm khỏi giỏ hàng, hủy xóa sản phẩm và báo lỗi số lượng không hợp lệ
- Condition:
    | STT | Biến | Mô tả |
    | - | - | - |
    | C1 | Số lượng | Số lượng sản phẩm muốn thêm phải là số nguyên dương lớn hơn hoặc bằng 1 |
    | C2 | Sự tồn tại của sản phẩm trong giỏ hàng | Sản phẩm có thể chưa có hoặc đã có sẵn trong giỏ hàng |
    | C3 | Trạng thái giỏ hàng | Giỏ hàng có thể trống hoặc không trống |
    | C4 | Xác nhận xóa | Người dùng chọn đồng ý hoặc hủy bỏ khi thực hiện xóa sản phẩm |
- Equivalence Class:
    | STT | Loại | Condition | Mô tả |
    | - | - | - | - |
    | E1 | Valid | C1 | Số lượng là số nguyên dương lớn hơn hoặc bằng 1 |
    | E2 | Invalid | C1 | Số lượng là số nguyên nhỏ hơn hoặc bằng 0 |
    | E3 | Invalid | C1 | Số lượng không phải số nguyên |
    | E4 | Valid | C2 | Sản phẩm chưa tồn tại trong giỏ hàng |
    | E5 | Valid | C2 | Sản phẩm đã tồn tại trong giỏ hàng |
    | E6 | Valid | C3 | Giỏ hàng đang trống |
    | E7 | Valid | C3 | Giỏ hàng không trống |
    | E8 | Valid | C4 | Người dùng xác nhận đồng ý xóa |
    | E9 | Valid | C4 | Người dùng xác nhận hủy xóa |
- Giá trị đại diện
    | STT | Giá trị đại diện |
    | - | - |
    | E1 | 3 |
    | E2 | -5 |
    | E3 | 1.5 |
    | E4 | Laptop (chưa có trong giỏ hàng) |
    | E5 | Laptop (đã có sẵn trong giỏ hàng) |
    | E6 | Giỏ hàng trống |
    | E7 | Giỏ hàng có chứa sản phẩm Laptop |
    | E8 | Chọn "Có" khi xác nhận xóa |
    | E9 | Chọn "Không" khi xác nhận xóa |

**Boundary Value Analysis**
- Input: số lượng sản phẩm muốn thêm
- Boundary:
    - Điều kiện: Số lượng sản phẩm hợp lệ phải từ 1 trở lên
    - Từ điều kiện chia thành 2 miền

    | STT | Điều kiện | Kết quả |
    | - | - | - |
    | D1 | Số lượng <= 0 | Không hợp lệ, không cho phép thêm |
    | D2 | Số lượng >= 1 | Hợp lệ, thêm sản phẩm thành công |

    - Lower Boundary: 1
    - Upper Boundary: Không xác định cụ thể trong SRS
- Boundary Values:
    | STT | Quy tắc | Giá trị | Ý nghĩa | Kết quả mong đợi |
    | - | - | - | - | - |
    | BVA1 | LB − 1 | 0 | Giá trị ngay dưới cận dưới | Không hợp lệ, không cho phép thêm hoặc hiển thị cảnh báo lỗi |
    | BVA2 | LB | 1 | Giá trị cận dưới hợp lệ | Thêm sản phẩm vào giỏ hàng thành công với số lượng 1 |
    | BVA3 | LB + 1 | 2 | Giá trị ngay trên cận dưới | Thêm sản phẩm vào giỏ hàng thành công với số lượng 2 |Max

### 2.2. Test case
| ID | Mục tiêu | Coverage | Input | Test step | Test data | Expected Result |
| - | - | - | - | - | - | - |
| TC_FR07_01 | Kiểm tra hiển thị khi giỏ hàng trống | E6, BVA-LB | Giỏ hàng trống | 1. Mở trang Giỏ hàng. | Giỏ hàng trống | Hiển thị thông báo Giỏ hàng của bạn đang trống và liên kết Tiếp tục mua sắm. |
| TC_FR07_02 | Kiểm tra hiển thị khi giỏ hàng không trống | E7 | Giỏ hàng chứa sản phẩm | 1. Mở trang Giỏ hàng. | Giỏ hàng chứa 1 sản phẩm: iPhone 15 Pro Max, số lượng: 1, giá: 30,000,000 VND | Hiển thị danh sách sản phẩm, giá bán, số lượng, thành tiền của từng sản phẩm và tổng tiền giỏ hàng. |
| TC_FR07_03 | Kiểm tra thêm sản phẩm mới vào giỏ hàng với số lượng hợp lệ | E1, E4 | Thêm sản phẩm chưa có trong giỏ hàng với số lượng hợp lệ | 1. Mở trang chi tiết sản phẩm.<br>2. Nhập số lượng.<br>3. Nhấn nút Thêm vào giỏ hàng.<br>4. Mở trang Giỏ hàng. | Sản phẩm: iPhone 15 Pro Max, giá 30,000,000 VND <br>Số lượng: `3` | Sản phẩm được thêm vào giỏ hàng với số lượng là 3, tổng tiền tăng thêm tương ứng là 90,000,000 VND. |
| TC_FR07_04 | Kiểm tra thêm sản phẩm đã tồn tại trong giỏ hàng | E1, E5 | Thêm sản phẩm đã có trong giỏ hàng với số lượng hợp lệ | 1. Mở trang chi tiết sản phẩm đã có trong giỏ hàng.<br>2. Nhập số lượng lần 1.<br>3. Nhấn nút Thêm vào giỏ hàng lần 1.<br>4. Mở trang Giỏ hàng.<br>5. Nhập số lượng lần 2.<br>6. Nhấn nút Thêm vào giỏ hàng lần 2.<br>7. Mở trang Giỏ hàng. | Sản phẩm: iPhone 15 Pro Max, giá: 30,000,000 VND, đã có sẵn 1 sản phẩm trong giỏ<br>Số lượng thêm lần 1: `3`<br>Số lượng thêm lần 2: `1` | Số lượng sản phẩm iPhone 15 Pro Max trong giỏ hàng tăng lên thành `4`, tổng tiền cập nhật tương ứng. |
| TC_FR07_05 | Kiểm tra thêm sản phẩm với số lượng không phải số nguyên | E3 | Nhập số lượng không hợp lệ | 1. Mở trang chi tiết sản phẩm.<br>2. Nhập số lượng không phải số nguyên.<br>3. Nhấn nút Thêm vào giỏ hàng. | Sản phẩm: iPhone 15 Pro Max, giá: 30,000,000 VND <br>Số lượng: `1.5` | Hệ thống chỉ chấp nhận số nguyên dương. Khi nhập giá trị không phải số nguyên, hệ thống phải từ chối và thông báo lỗi. |
| TC_FR07_06 | Kiểm tra thêm sản phẩm với số lượng là số nguyên âm | E2 | Nhập số lượng là số nguyên âm | 1. Mở trang chi tiết sản phẩm.<br>2. Nhập số lượng nguyên âm.<br>3. Nhấn nút Thêm vào giỏ hàng. | Sản phẩm: iPhone 15 Pro Max, giá: 30,000,000 VND<br>Số lượng: `-5` | Hệ thống báo lỗi số lượng không hợp lệ và không cho phép thêm vào giỏ hàng. |
| TC_FR07_07 | Kiểm tra xác nhận xóa sản phẩm khỏi giỏ hàng | E8 | Chọn xóa sản phẩm và đồng ý | 1. Mở trang Giỏ hàng.<br>2. Nhấn nút Xóa bên cạnh sản phẩm.<br>3. Chọn Có tại hộp thoại xác nhận. | Sản phẩm trong giỏ: iPhone 15 Pro Max | Hệ thống hiển thị một diaglog xác nhận xóa trước khi xóa. Sản phẩm Laptop bị xóa khỏi giỏ hàng, danh sách sản phẩm và tổng tiền cập nhật lại. |
| TC_FR07_08 | Kiểm tra hủy xóa sản phẩm khỏi giỏ hàng | E9 | Chọn xóa sản phẩm nhưng hủy bỏ | 1. Mở trang Giỏ hàng.<br>2. Nhấn nút Xóa bên cạnh sản phẩm.<br>3. Chọn Không tại hộp thoại xác nhận. | Sản phẩm trong giỏ: iPhone 15 Pro Max | Việc xóa bị hủy, sản phẩm Laptop vẫn giữ nguyên trong giỏ hàng. |
| TC_FR07_09 | Kiểm tra giá trị biên dưới - 1 (LB - 1) của số lượng | BVA-LB-1 | Số lượng bằng 0 | 1. Mở trang chi tiết sản phẩm.<br>2. Nhập số lượng bằng 0.<br>3. Nhấn nút Thêm vào giỏ hàng. | Số lượng: `0` | Hệ thống không cho phép thêm sản phẩm hoặc hiển thị cảnh báo lỗi số lượng tối thiểu là 1. |

*Lưu ý*:
- Vì không có quy định về UB nên chỉ có 2 miền giá trị là 0 và khác 0, nên ở trường hợp valid như TC_FR07_01 sẽ bao quát cả các trường hợp được phân tích trong BVA vì không có boundary thật sự

### 2.3. Test Result
| ID | Observed Result | Status |
| - | - | - |
| TC_FR07_01 | Hệ thống thông báo giỏ hàng trống | Pass |
| TC_FR07_02 | Hệ thống hiển thị đúng thông tin về tên sản phẩm, số lượng và giá tiền | Pass |
| TC_FR07_03 | Hệ thống hiển thị đúng thông tin về tên sản phẩm, số lượng và tổng thành tiền (không phải "Tổng tạm tính") | Pass |
| TC_FR07_04 | Hệ thống không cập nhật lại số lượng sản phẩm mà tạo thêm một dòng mới như một sản phẩm mới | Fail |
| TC_FR07_05 | Hệ thống không thông báo về định dạng lỗi (không phải số nguyên), nhưng tự động hiển thị giá trị phần nguyên (giá trị: 1) trong giỏ hàng | Fail |
| TC_FR07_06 | Hệ thống không thông báo lỗi và vẫn thêm với số lượng giá trị âm (-5) và tổng thành tiền của sản phẩm với giá trị âm | Fail |
| TC_FR07_07 | Hệ thống không hiển thị dialog xác nhận, trực tiếp xóa sản phẩm sau khi bấm | Fail |
| TC_FR07_08 | Hệ thống không hiển thị dialog xác nhận, không thể hủy tác vụ xóa sau khi bấm | Fail |
| TC_FR07_09 | Hệ thống vẫn cho phép thêm sản phẩm với số lượng 0 | Fail |

### 2.5. Bug Report
| ID | Test Case ID | Mô tả | Mức độ nghiêm trọng | Mức độ ưu tiên |
| - | - | - | - | - |
| B_FR07_01 | TC_FR07_04 | Hệ thống không cập nhật lại số lượng sản phẩm mà tạo thêm một dòng mới như một sản phẩm mới | High | High |
| B_FR07_02 | TC_FR07_05 | Hệ thống không thông báo về định dạng lỗi (không phải số nguyên), nhưng tự động hiển thị giá trị phần nguyên (giá trị: 1) trong giỏ hàng | Medium | Medium |
| B_FR07_03 | TC_FR07_06 | Hệ thống không thông báo lỗi và vẫn thêm với số lượng giá trị âm (-5) và tổng thành tiền của sản phẩm với giá trị âm | High | High |
| B_FR07_04 | TC_FR07_07 | Hệ thống không hiển thị dialog xác nhận, trực tiếp xóa sản phẩm sau khi bấm | High | High |
| B_FR07_05 | TC_FR07_08 | Hệ thống không hiển thị dialog xác nhận, không thể hủy tác vụ xóa sau khi bấm | High | High |
| B_FR07_06 | TC_FR07_09 | Hệ thống vẫn cho phép thêm sản phẩm với số lượng 0 | Medium | Medium |

**Minh chứng Github**
![B_FR07_01](../assets/B_FR07_01.png)
![B_FR07_02](../assets/B_FR07_02.png)
![B_FR07_03](../assets/B_FR07_03.png)
![B_FR07_04](../assets/B_FR07_04.png)
![B_FR07_05](../assets/B_FR07_05.png)
![B_FR07_06](../assets/B_FR07_06.png)

### 2.4. Đánh giá AI
AI hỗ trợ tốt trong việc xác định các biến đầu vào, trạng thái của hệ thống và xây dựng cấu trúc phân tích Domain Testing có tính nhất quán, giúp rút ngắn thời gian thực hiện và đảm bảo khả năng truy vết từ yêu cầu đến test case.

Tuy nhiên, AI vẫn còn một số hạn chế. AI chỉ xác định miền hợp lệ cho biến **Số lượng** mà bỏ sót các miền không hợp lệ như giá trị âm, bằng 0 và số thập phân. AI cũng không nhận diện điều kiện **sản phẩm đã tồn tại trong giỏ hàng**, dẫn đến thiếu test case kiểm tra việc cập nhật số lượng khi thêm cùng một sản phẩm. Ngoài ra, AI cho rằng **Boundary Value Analysis không áp dụng được**, nên không sinh các test case tại cận dưới (0, 1, 2), làm giảm khả năng phát hiện lỗi.

Nguyên nhân chủ yếu là AI phân tích theo các ràng buộc được mô tả trực tiếp trong SRS nhưng chưa suy luận được các ràng buộc nghiệp vụ ngầm định. Vì vậy, kết quả do AI sinh vẫn cần được kiểm thử viên rà soát và bổ sung để tăng độ bao phủ và khả năng phát hiện lỗi.

## 3. Pool C - Feature FR-16: Product import from CSV

### 3.1. Phân tích

**Domain Testing**
- Input: đuôi file, dòng header, dấu phẩy trong trường dữ liệu, name và price
- Output: import thành công, lỗi định dạng file không hỗ trợ, lỗi dòng header không hợp lệ, lỗi dấu phẩy trong trường dữ liệu, lỗi tên trống, lỗi giá sản phẩm không hợp lệ
- Condition:
    | STT | Biến | Mô tả |
    | - | - | - |
    | C1 | Đuôi file | File import phải có đuôi là .csv |
    | C2 | Dòng header | Dòng đầu tiên của file phải đúng định dạng: name,price,description,imageUrl,category_id |
    | C3 | Dấu phẩy trong trường dữ liệu | Các trường dữ liệu có chứa dấu phẩy phải được bao bọc trong dấu nháy kép |
    | C4 | name | Tên sản phẩm không được để trống (độ dài > 0) |
    | C5 | price | Giá sản phẩm phải lớn hơn 0 |
- Equivalence Class:
    | STT | Loại | Condition | Mô tả |
    | - | - | - | - |
    | E1 | Valid | C1 | File có đuôi .csv |
    | E2 | Invalid | C1 | File không có đuôi .csv (ví dụ .xlsx, .txt) |
    | E3 | Valid | C2 | Dòng header đúng cấu trúc "name,price,description,imageUrl,category_id" |
    | E4 | Invalid | C2 | Dòng header sai cấu trúc hoặc thiếu trường |
    | E5 | Valid | C3 | Trường dữ liệu chứa dấu phẩy được bọc trong dấu nháy kép |
    | E6 | Invalid | C3 | Trường dữ liệu chứa dấu phẩy không được bọc trong dấu nháy kép |
    | E7 | Valid | C4 | Tên sản phẩm có độ dài > 0 |
    | E8 | Invalid | C4 | Tên sản phẩm trống (độ dài = 0) |
    | E9 | Valid | C5 | Giá sản phẩm > 0 |
    | E10 | Invalid | C5 | Giá sản phẩm <= 0 |
- Giá trị đại diện
    | STT | Giá trị đại diện |
    | - | - |
    | E1 | .csv |
    | E2 | .xlsx |
    | E3 | name,price,description,imageUrl,category_id |
    | E4 | name,price |
    | E5 | '"iPhone, 13",1000,"Desc",http://url.com,1' |
    | E6 | 'iPhone, 13,1000,"Desc",http://url.com,1' |
    | E7 | "iPhone 13" |
    | E8 | "" |
    | E9 | 1000 |
    | E10 | -50 |

**Boundary Value Analysis**
- Input: tên sản phẩm (độ dài) và giá sản phẩm
- Boundary:
    - Tên sản phẩm:
        - Điều kiện: Độ dài tên sản phẩm phải lớn hơn 0 (từ 1 trở lên)
        - Từ điều kiện chia thành 2 miền

        | STT | Điều kiện | Kết quả |
        | - | - | - |
        | D1 | Độ dài = 0 | Không hợp lệ |
        | D2 | Độ dài >= 1 | Hợp lệ |

        - Lower Boundary: 1
        - Upper Boundary: Không xác định cụ thể trong SRS
    - Giá sản phẩm:
        - Điều kiện: Giá sản phẩm phải lớn hơn 0
        - Từ điều kiện chia thành 2 miền

        | STT | Điều kiện | Kết quả |
        | - | - | - |
        | D3 | Giá <= 0 | Không hợp lệ |
        | D4 | Giá > 0 | Hợp lệ |

        - Lower Boundary: 0.01 (hoặc giá trị dương nhỏ nhất lớn hơn 0)
        - Upper Boundary: Không xác định cụ thể trong SRS
- Boundary Values:
    | STT | Quy tắc | Giá trị | Ý nghĩa | Kết quả mong đợi |
    | - | - | - | - | - |
    | BVA1 | LB − 1 (tên) | 0 | Nhỏ hơn cận dưới của độ dài tên sản phẩm | Không hợp lệ, báo lỗi tên trống |
    | BVA2 | LB (tên) | 1 | Giá trị cận dưới hợp lệ của độ dài tên sản phẩm | Hợp lệ, import thành công |
    | BVA3 | LB (giá) | 0 | Giá trị cận dưới không hợp lệ của giá | Không hợp lệ, báo lỗi giá sản phẩm |
    | BVA4 | LB + 0.01 (giá) | 0.01 | Giá trị dương nhỏ nhất hợp lệ của giá | Hợp lệ, import thành công |
    | BVA5 | UB − 0.01 (giá không hợp lệ) | -0.01 | Giá trị âm nhỏ nhất sát ngưỡng | Không hợp lệ, báo lỗi giá sản phẩm |

### 3.2. Test case
| ID | Mục tiêu | Coverage | Input | Test step | Test data | Expected Result |
| - | - | - | - | - | - | - |
| TC_FR16_01 | Kiểm tra import file có đuôi .csv | E1 | Đuôi file | 1. Đăng nhập tài khoản admin.<br>2. Upload file có đuôi .csv. | File: `products.csv` | Định dạng file được chấp nhận và hệ thống tiếp tục xử lý import. |
| TC_FR16_02 | Kiểm tra import file không có đuôi .csv | E2 | Đuôi file | 1. Đăng nhập tài khoản admin.<br>2. Upload file có đuôi .xlsx. | File: `products.xlsx` | Hệ thống báo lỗi định dạng file không được hỗ trợ và không thực hiện import. |
| TC_FR16_03 | Kiểm tra dòng header đúng định dạng và trường dữ liệu chứa dấu phẩy được bọc trong dấu nháy kép | E3, E5, E7, E9 | Header, Dữ liệu CSV | 1. Đăng nhập tài khoản admin.<br>2. Import file CSV có header đúng chuẩn và dữ liệu hợp lệ. | Header: `name,price,description,imageUrl,category_id`<br>Dữ liệu: `"iPhone, 13",1000,"Desc",http://url.com,1` | Header hợp lệ, trường chứa dấu phẩy được phân tích đúng theo RFC 4180, tên sản phẩm được lưu là `iPhone, 13`, giá là `1000`, import thành công. |
| TC_FR16_04 | Kiểm tra dòng header sai định dạng | E4 | Dòng header | 1. Đăng nhập tài khoản admin.<br>2. Import file CSV có dòng header thiếu trường. | Header: `name,price`<br>Dữ liệu: `"A",100` | Hệ thống báo lỗi cấu trúc header không hợp lệ và hủy bỏ toàn bộ quá trình import. |
| TC_FR16_05 | Kiểm tra trường dữ liệu chứa dấu phẩy không được bọc trong dấu nháy kép | E6 | Dấu phẩy trong trường dữ liệu | 1. Đăng nhập tài khoản admin.<br>2. Import file CSV có trường dữ liệu chứa dấu phẩy nhưng không được bao bởi dấu nháy kép. | Header: `name,price,description,imageUrl,category_id`<br>Dữ liệu: `iPhone, 13,1000,"Desc",http://url.com,1` | Hệ thống báo lỗi cú pháp dữ liệu CSV và hủy bỏ toàn bộ quá trình import. |
| TC_FR16_06 | Kiểm tra tên sản phẩm trống (độ dài = 0) | E8, BVA1 | Tên sản phẩm | 1. Đăng nhập tài khoản admin.<br>2. Import file CSV chứa dòng sản phẩm có tên trống. | Tên: `""` | Hệ thống báo lỗi tên sản phẩm không được để trống và hủy bỏ toàn bộ quá trình import. |
| TC_FR16_07 | Kiểm tra giá sản phẩm bằng 0 (giá không hợp lệ) | E10, BVA3 | Giá sản phẩm | 1. Đăng nhập tài khoản admin.<br>2. Import file CSV chứa dòng sản phẩm có giá bằng `0`. | Giá: `0` | Hệ thống báo lỗi giá sản phẩm phải lớn hơn `0` và hủy bỏ toàn bộ quá trình import. |
| TC_FR16_08 | Kiểm tra giá sản phẩm bằng 0.01 (giá hợp lệ) | E9, BVA4 | Giá sản phẩm | 1. Đăng nhập tài khoản admin.<br>2. Import file CSV chứa dòng sản phẩm có giá bằng `0.01`. | Giá: `0.01` | Giá sản phẩm hợp lệ, dữ liệu được ghi nhận và import thành công. |
| TC_FR16_09 | Kiểm tra giá sản phẩm bằng -0.01 (giá âm sát ngưỡng) | BVA6 | Giá sản phẩm | 1. Đăng nhập tài khoản admin.<br>2. Import file CSV chứa dòng sản phẩm có giá bằng `-0.01`. | Giá: `-0.01` | Hệ thống báo lỗi giá sản phẩm phải lớn hơn `0` và hủy bỏ toàn bộ quá trình import. |

### 3.3. Test Result
| ID | Observed Result | Status |
| - | - | - |
| TC_FR16_01 | Hệ thống cho phép import file product.csv | Pass |
| TC_FR16_02 | Hệ thống cho phép import file product.xlsx | Fail |
| TC_FR16_03 | Hệ thống import sai dữ liệu với tên: `"iPhone` và giá tiền `13"` | Fail |
| TC_FR16_04 | Hệ thống cho phép import mà không báo lỗi, link ảnh được hiển thị giống như tên sản phẩm | Fail |
| TC_FR16_05 | Hệ thống cho phép import với tên bị lỗi (giá trị là `iPhone) và giá bị lỗi (giá trị là 13) | Fail |
| TC_FR16_06 | Hệ thống không cho import với tên rỗng, có thông báo lỗi thiếu tên sản phẩm | Pass |
| TC_FR16_07 | Hệ thống cho phép import với giá tiền 0 | Fail|
| TC_FR16_08 | Hệ thống cho phép import với giá tiền 0.01 và hiển thị đúng | Pass |
| TC_FR16_09 | Hệ thống cho phép import với giá tiền -0.01 | Fail |

### 2.4. Bug Report
| ID | Test Case ID | Mô tả | Mức độ nghiêm trọng | Mức độ ưu tiên |
| - | - | - | - | - |
| B_FR16_01 | TC_FR16_02 | Hệ thống chấp nhận file không có phần mở rộng `.csv` (ví dụ `.xlsx`) thay vì từ chối theo yêu cầu SRS. | High | High |
| B_FR16_02 | TC_FR16_04 | Hệ thống không kiểm tra tính hợp lệ của dòng header, vẫn thực hiện import khi header sai cấu trúc hoặc thiếu trường. | High | High |
| B_FR16_03 | TC_FR16_03, TC_FR16_05 | Hệ thống phân tích cú pháp (CSV parser) không tuân theo RFC 4180. Trường dữ liệu chứa dấu phẩy được bọc trong dấu nháy kép vẫn bị tách sai, đồng thời dữ liệu không được bọc dấu nháy kép cũng không bị từ chối. | High | High |
| B_FR16_04 | TC_FR16_07, TC_FR16_09 | Hệ thống không kiểm tra ràng buộc `price > 0`, vẫn cho phép import sản phẩm có giá bằng `0` hoặc giá âm. | Medium | High |

**Minh chứng Github**
![B_FR16_01](../assets/B_FR16_01.png)
![B_FR16_02](../assets/B_FR16_02.png)
![B_FR16_03](../assets/B_FR16_03.png)
![B_FR16_04](../assets/B_FR16_04.png)

### 3.5. Đánh giá AI
AI hỗ trợ tốt trong việc xác định các điều kiện kiểm thử (đuôi file, header, dấu phẩy trong dữ liệu, tên sản phẩm và giá sản phẩm), xây dựng các Equivalence Class và Boundary Value cho trường **name** và **price**. AI cũng đề xuất đầy đủ các test case cơ bản tương ứng với từng miền hợp lệ và không hợp lệ.

Tuy nhiên, kết quả do AI sinh vẫn còn một số hạn chế:
- AI tạo các test case bị trùng lặp giữa Domain Testing và Boundary Value Analysis. Ví dụ, trường hợp **tên sản phẩm trống** và **giá bằng 0** xuất hiện ở cả hai kỹ thuật nên sau đó phải gộp lại để tránh kiểm thử dư thừa.
- AI không đề xuất test case kết hợp **header hợp lệ + dữ liệu chứa dấu phẩy được đặt trong dấu nháy kép** để kiểm tra khả năng phân tích cú pháp CSV. Nhờ bổ sung test này (TC_FR16_03), nhóm đã phát hiện hệ thống tách sai dữ liệu, lưu tên thành `"iPhone` và giá thành `13"`.
- AI cũng không dự đoán được trường hợp hệ thống **vẫn chấp nhận dữ liệu CSV không đúng cú pháp**, cụ thể dòng `iPhone, 13,1000,"Desc",http://url.com,1` không được bao bởi dấu nháy kép nhưng vẫn được import thay vì báo lỗi (TC_FR16_05).

Do đó, AI hỗ trợ hiệu quả trong việc xây dựng bộ test ban đầu dựa trên SRS, nhưng người kiểm thử vẫn cần rà soát và bổ sung các kịch bản thực tế để phát hiện các lỗi triển khai của hệ thống.

## 4. Pool D - Feature FR-08: Checkout

### 4.1. Phân tích

**Domain Testing**
- Input: trạng thái đăng nhập
- Output: cho phép truy cập trang thanh toán, chặn truy cập và yêu cầu đăng nhập
- Condition:
    | STT | Biến | Mô tả |
    | - | - | - |
    | C1 | Trạng thái đăng nhập | Người dùng thực hiện thanh toán phải ở trạng thái đã đăng nhập |
- Equivalence Class:
    | STT | Loại | Condition | Mô tả |
    | - | - | - | - |
    | E1 | Valid | C1 | Trạng thái đã đăng nhập |
    | E2 | Invalid | C1 | Trạng thái chưa đăng nhập |
- Giá trị đại diện
    | STT | Giá trị đại diện |
    | - | - |
    | E1 | Đã đăng nhập |
    | E2 | Chưa đăng nhập |

**Boundary Value Analysis**
- Input: không có biến số định lượng
- Boundary: không áp dụng do đặc tả yêu cầu không có giá trị biên hoặc khoảng giá trị
- Boundary Values: không áp dụng

### 4.2. Test case
| ID | Mục tiêu | Coverage | Input | Test step | Test data | Expected Result |
| - | - | - | - | - | - | - |
| TC_FR08_01 | Kiểm tra thanh toán khi đã đăng nhập | E1 | Trạng thái đăng nhập | 1. Đăng nhập tài khoản hợp lệ.<br>2. Nhấn nút Tiến hành thanh toán từ giỏ hàng. | Trạng thái: `Đã đăng nhập` | Cho phép truy cập trang thanh toán để thực hiện thanh toán. |
| TC_FR08_02 | Kiểm tra thanh toán khi chưa đăng nhập | E2 | Trạng thái đăng nhập | 1. Không đăng nhập tài khoản.<br>2. Nhấn nút Tiến hành thanh toán từ giỏ hàng. | Trạng thái: `Chưa đăng nhập` | Chặn truy cập, hiển thị thông báo yêu cầu đăng nhập và chuyển hướng sang trang Login. |

### 4.3. Test Result
| ID | Observed Result | Status |
| - | - | - |
| TC_FR08_01 | Hệ thống cho phép thanh toán thành công | Pass |
| TC_FR08_02 | Hệ thống hiển thị cần đăng nhập để thanh toán và chuyển sang trang login | Pass |

### 4.4. Bug Report
- Chưa tìm thấy nếu chỉ áp dụng domain testing và boundary value analysis

### 4.5. Đánh giá AI
AI xác định đúng điều kiện kiểm thử duy nhất của yêu cầu là trạng thái đăng nhập, từ đó phân chia thành hai miền tương đương đã đăng nhập và chưa đăng nhập, đồng thời sinh đầy đủ hai test case tương ứng. AI cũng nhận diện chính xác rằng Boundary Value Analysis không áp dụng vì đầu vào không có giá trị định lượng hoặc khoảng giá trị.

Tuy nhiên, AI vẫn đề xuất mở rộng kiểm thử sang các trường hợp như địa chỉ giao hàng, phương thức thanh toán hoặc trạng thái giỏ hàng. Các trường hợp này không được mô tả trong SRS của FR-08 nên không thuộc phạm vi của Domain Testing đối với yêu cầu này.

Do đó, đối với FR-08, bộ test gồm 02 test case đã bao phủ toàn bộ các miền tương đương được xác định từ đặc tả. Việc bổ sung thêm test case sẽ vượt ra ngoài phạm vi SRS hoặc phải sử dụng các kỹ thuật kiểm thử khác như State Transition Testing, API Testing hoặc Security Testing.

# Demo Agent Skill
[Video](https://youtu.be/hyBC_e6w2Ak)