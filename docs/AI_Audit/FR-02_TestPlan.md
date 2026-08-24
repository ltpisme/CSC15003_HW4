Dựa trên đặc tả bạn đưa và **giới hạn của HW4 là automation testing trên browser/web**, mình sẽ **thiết kế lại test case cho FR-02**, thay vì bê nguyên 8 test case hiện tại sang Playwright.

Có một điểm rất quan trọng: các test case `TC_FR02_06` và `TC_FR02_07` hiện tại đang kiểm tra trực tiếp biến nội bộ **Failed Attempts = 0/2**. Browser không có input nào cho biến này, nên **không nên giữ cách viết đó trong automation test case**. Ta phải tạo trạng thái `0`, `1`, `2`, `3` thông qua các thao tác đăng nhập thực tế.

## 1. Phạm vi automation nên kiểm thử

Với FR-02, nên chia thành 3 nhóm:

| Nhóm         | Nội dung                                                           | Automation |
| ------------ | ------------------------------------------------------------------ | ---------- |
| Functional   | Login thành công/thất bại                                          | Có         |
| Lock account | 1, 2, 3 lần sai; bị khóa; hết 30 giây                              | Có         |
| UI/HTML      | email type, password type, h1, required, error position, tab order | Có         |

Không nên automation trực tiếp các nội bộ như:

* `failedAttempts = 0`
* `failedAttempts = 2`
* sửa database để đặt số lần sai
* gọi trực tiếp `POST /api/login`
* sửa code SUT

Thay vào đó, **browser phải tạo ra trạng thái cần test**.

---

# 2. Test data

Nên sử dụng tài khoản `test@eshop.com` để test lock account.

| Data ID | Email               | Password    | Mục đích            |
| ------- | ------------------- | ----------- | ------------------- |
| D01     | `test@eshop.com`    | `Test1234!` | Login hợp lệ        |
| D02     | `test@eshop.com`    | `WrongPass` | Password sai        |
| D03     | `unknown@eshop.com` | `Test1234!` | Email không tồn tại |
| D04     | `invalid-email`     | `Test1234!` | Email sai format    |
| D05     | rỗng                | `Test1234!` | Email required      |
| D06     | `test@eshop.com`    | rỗng        | Password required   |

**Lưu ý:** các test liên quan đến lock account cần được thiết kế để không làm test sau bị ảnh hưởng. Nếu account đang bị khóa 30 giây, test phải chờ hết lock hoặc dùng cơ chế reset state mà **không sửa SUT**.

---

# 3. Bộ test case FR-02 đề xuất

## A. Login functional

| ID             | Test case                          | Preconditions                          | Steps                                                                     | Expected result                                                                        | Coverage   |
| -------------- | ---------------------------------- | -------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------- |
| **TC_FR02_01** | Login với email và password hợp lệ | Account `test@eshop.com` không bị khóa | 1. Mở Login<br>2. Nhập email hợp lệ<br>3. Nhập password đúng<br>4. Submit | Login thành công, chuyển tới trang sau đăng nhập/trang chủ; không hiển thị lỗi         | E1, E3, E5 |
| **TC_FR02_02** | Login với email sai định dạng      | Đang ở Login                           | 1. Nhập `invalid-email`<br>2. Nhập password<br>3. Submit                  | Browser hiển thị validation email; không thực hiện login                               | E2, C1     |
| **TC_FR02_03** | Login với email không tồn tại      | Account không bị khóa                  | 1. Nhập `unknown@eshop.com`<br>2. Nhập password<br>3. Submit              | Login thất bại; hiển thị thông báo lỗi chung, không tiết lộ email có tồn tại hay không | E4         |
| **TC_FR02_04** | Login với password sai             | Account không bị khóa                  | 1. Nhập `test@eshop.com`<br>2. Nhập `WrongPass`<br>3. Submit              | Login thất bại; hiển thị thông báo lỗi phù hợp                                         | E6         |

### Điểm cần sửa so với test case cũ

`TC_FR02_03` **nên giữ**, vì đặc tả có điều kiện:

> Email phải tồn tại trong hệ thống.

Đồng thời nó kiểm tra yêu cầu bảo mật:

> không để lộ chi tiết nguyên nhân.

Ví dụ không nên yêu cầu UI phải nói:

> "Email này không tồn tại."

Mà nên kiểm tra thông báo chung kiểu:

> "Email hoặc mật khẩu không đúng."

---

# 4. Lock account – phần quan trọng nhất

Đây là phần mình khuyên **thiết kế lại hoàn toàn**.

## TC_FR02_05 – Sai lần 1 không khóa

| Thuộc tính       | Nội dung                                                                    |
| ---------------- | --------------------------------------------------------------------------- |
| **ID**           | `TC_FR02_05`                                                                |
| **Mục tiêu**     | Kiểm tra lần đăng nhập sai đầu tiên không khóa account                      |
| **Precondition** | Account không bị khóa                                                       |
| **Steps**        | 1. Mở Login<br>2. Nhập `test@eshop.com`<br>3. Nhập `WrongPass`<br>4. Submit |
| **Expected**     | Login thất bại; account vẫn có thể tiếp tục đăng nhập                       |
| **Coverage**     | BVA: 1                                                                      |

Đây chính là cách kiểm tra **Failed Attempts = 1**, nhưng không cần truy cập biến nội bộ.

---

## TC_FR02_06 – Sai lần 2 không khóa

| Thuộc tính       | Nội dung                                                                                |
| ---------------- | --------------------------------------------------------------------------------------- |
| **ID**           | `TC_FR02_06`                                                                            |
| **Mục tiêu**     | Kiểm tra account chưa bị khóa khi có 2 lần sai liên tiếp                                |
| **Precondition** | Account không bị khóa                                                                   |
| **Steps**        | 1. Login với password sai → lần 1<br>2. Login tiếp với password sai → lần 2             |
| **Expected**     | Cả hai lần đều thất bại nhưng account **chưa bị khóa**; có thể tiếp tục thực hiện login |
| **Coverage**     | BVA: `UB - 1 = 2`                                                                       |

Đây là test case thay thế cho:

> `Failed Attempts = 2`

trong test case cũ.

---

## TC_FR02_07 – Sai lần 3 thì khóa

Đây là **boundary test quan trọng nhất**.

| Thuộc tính       | Nội dung                                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **ID**           | `TC_FR02_07`                                                                                                            |
| **Mục tiêu**     | Kiểm tra account bị khóa đúng tại ngưỡng 3 lần sai liên tiếp                                                            |
| **Precondition** | Account không bị khóa                                                                                                   |
| **Steps**        | 1. Login sai lần 1<br>2. Login sai lần 2<br>3. Login sai lần 3                                                          |
| **Expected**     | Sau lần sai thứ 3, account bị khóa trong 30 giây; hệ thống hiển thị thông báo phù hợp; không tiết lộ nguyên nhân nội bộ |
| **Coverage**     | BVA: `UB = 3`, E8                                                                                                       |

Đây là test case tương ứng với:

> `BVA4/BVA5`

và cũng chính là **boundary của nghiệp vụ lock account**.

---

# 5. Test case phát hiện bug thực tế

Đây mới là test case rất đáng giữ từ bug bạn đã phát hiện.

## TC_FR02_08 – Account đã khóa không cho login bằng password đúng

| Thuộc tính       | Nội dung                                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| **ID**           | `TC_FR02_08`                                                                                                   |
| **Mục tiêu**     | Kiểm tra account đang bị khóa không thể login kể cả khi cung cấp credential đúng                               |
| **Precondition** | Account đã bị khóa do 3 lần login sai liên tiếp                                                                |
| **Steps**        | 1. Nhập `test@eshop.com`<br>2. Nhập `Test1234!` đúng<br>3. Submit                                              |
| **Expected**     | **Không đăng nhập thành công**; account vẫn bị khóa; hiển thị thông báo account đang bị khóa/thông báo phù hợp |
| **Coverage**     | Lock state                                                                                                     |

Test này rất quan trọng vì nó trực tiếp kiểm chứng:

> "tài khoản bị tạm khóa 30 giây"

chứ không chỉ kiểm tra rằng lần thứ 3 trả về lỗi.

---

# 6. Test hết thời gian khóa 30 giây

Đặc tả nói rất rõ:

> khóa tài khoản **30 giây**

Do đó nếu chỉ test "bị khóa" thì coverage chưa đầy đủ.

## TC_FR02_09 – Account được mở khóa sau 30 giây

| Thuộc tính       | Nội dung                                                                          |
| ---------------- | --------------------------------------------------------------------------------- |
| **ID**           | `TC_FR02_09`                                                                      |
| **Mục tiêu**     | Kiểm tra account được phép login trở lại sau khi hết 30 giây                      |
| **Precondition** | Account vừa bị khóa do 3 lần sai liên tiếp                                        |
| **Steps**        | 1. Chờ đủ 30 giây<br>2. Nhập `test@eshop.com`<br>3. Nhập `Test1234!`<br>4. Submit |
| **Expected**     | Login thành công sau khi thời gian khóa kết thúc                                  |
| **Coverage**     | Lock duration = 30s                                                               |

### Nhưng có một vấn đề automation

Không nên dùng:

```text
wait 30 seconds
```

một cách cứng nhắc trong mọi test.

Trong Playwright nên ưu tiên:

```text
wait until the application allows login again
```

nhưng vẫn phải đảm bảo assertion rằng **không được unlock trước 30 giây** nếu muốn kiểm tra chính xác requirement.

Tốt hơn nữa là tách thành:

* `TC_FR02_08`: trước 30 giây → không login được.
* `TC_FR02_09`: sau 30 giây → login được.

---

# 7. Kiểm tra "từ 3 lần trở lên"

Đặc tả không chỉ nói:

> đúng 3 lần

mà là:

> **từ 3 lần trở lên**

Vì vậy nên có thêm test case.

## TC_FR02_10 – Không thể tiếp tục tăng số lần sai sau khi account đã bị khóa

| ID           | `TC_FR02_10`                                                                                                  |
| ------------ | ------------------------------------------------------------------------------------------------------------- |
| Mục tiêu     | Kiểm tra trạng thái lock được duy trì khi tiếp tục login                                                      |
| Precondition | Account đã bị khóa                                                                                            |
| Steps        | Submit thêm credential sai hoặc đúng trong thời gian lock                                                     |
| Expected     | Request bị từ chối do account đang locked; account không trở về trạng thái bình thường chỉ vì tiếp tục submit |

Test này đặc biệt hữu ích nếu implementation hiện tại có bug kiểu:

```text
attempt 1 → fail
attempt 2 → fail
attempt 3 → lock
attempt 4 → xử lý lại như login bình thường
```

---

# 8. GUI / HTML automation test cases

Vì đặc tả FR-02 của bạn **bao gồm cả GUI requirements**, mình sẽ không bỏ các case này.

## TC_FR02_11 – Email sử dụng `type="email"`

| ID       | `TC_FR02_11`                                        |
| -------- | --------------------------------------------------- |
| Mục tiêu | Kiểm tra email input sử dụng HTML5 email validation |
| Steps    | Mở Login → inspect email field bằng Playwright      |
| Expected | Input có `type="email"`                             |
| Coverage | GUI: Email                                          |

Có thể assertion:

```text
input[type="email"]
```

---

## TC_FR02_12 – Password sử dụng `type="password"`

| ID       | `TC_FR02_12`                      |
| -------- | --------------------------------- |
| Mục tiêu | Kiểm tra password được che        |
| Steps    | Mở Login → inspect password field |
| Expected | Input có `type="password"`        |
| Coverage | GUI: Password                     |

---

## TC_FR02_13 – Có đúng một H1

| ID       | `TC_FR02_13`                                          |
| -------- | ----------------------------------------------------- |
| Mục tiêu | Kiểm tra heading của Login page                       |
| Steps    | Mở Login                                              |
| Expected | Page có **đúng 1 `<h1>`**, nội dung mô tả trang Login |
| Coverage | GUI                                                   |

---

## TC_FR02_14 – Required field

| ID       | `TC_FR02_14`                                                                               |
| -------- | ------------------------------------------------------------------------------------------ |
| Mục tiêu | Kiểm tra các field bắt buộc                                                                |
| Steps    | Mở Login → không nhập dữ liệu → Submit                                                     |
| Expected | Browser/application validation yêu cầu nhập dữ liệu; các field bắt buộc có dấu `*` trên UI |
| Coverage | Form requirements                                                                          |

---

## TC_FR02_15 – Error message nằm trên Submit

| ID       | `TC_FR02_15`                                                         |
| -------- | -------------------------------------------------------------------- |
| Mục tiêu | Kiểm tra vị trí error message                                        |
| Steps    | Nhập credential không hợp lệ → Submit                                |
| Expected | Error message xuất hiện **phía trên nút Submit**, không nằm bên dưới |
| Coverage | GUI                                                                  |

Đây là case nên kiểm tra bằng **DOM position**, không nên chỉ screenshot rồi đánh giá bằng mắt.

---

## TC_FR02_16 – Password không hiển thị plaintext

| ID       | `TC_FR02_16`                                 |
| -------- | -------------------------------------------- |
| Mục tiêu | Kiểm tra password được ẩn                    |
| Steps    | Nhập password                                |
| Expected | Ký tự password không hiển thị dạng plaintext |
| Coverage | GUI/security                                 |

---

## TC_FR02_17 – Tab order

| ID       | `TC_FR02_17`                                                                   |
| -------- | ------------------------------------------------------------------------------ |
| Mục tiêu | Kiểm tra thứ tự focus bằng Tab                                                 |
| Steps    | 1. Focus vào đầu form<br>2. Nhấn Tab tuần tự<br>3. Ghi nhận element nhận focus |
| Expected | Focus đi theo thứ tự từ trên xuống dưới, trái sang phải theo layout            |
| Coverage | Accessibility / GUI                                                            |

---

# 9. Bộ test case cuối cùng mình khuyến nghị

Nếu mục tiêu là **HW4 automation**, mình sẽ chọn bộ sau:

| ID           | Test                                       |     Priority | Automation |
| ------------ | ------------------------------------------ | -----------: | ---------- |
| `TC_FR02_01` | Login thành công                           |         High | Yes        |
| `TC_FR02_02` | Email sai HTML5 format                     |         High | Yes        |
| `TC_FR02_03` | Email không tồn tại                        |         High | Yes        |
| `TC_FR02_04` | Password sai                               |         High | Yes        |
| `TC_FR02_05` | Sai lần 1 → chưa khóa                      |         High | Yes        |
| `TC_FR02_06` | Sai lần 2 → chưa khóa                      | **Critical** | Yes        |
| `TC_FR02_07` | Sai lần 3 → khóa                           | **Critical** | Yes        |
| `TC_FR02_08` | Đang khóa + password đúng → vẫn bị từ chối | **Critical** | Yes        |
| `TC_FR02_09` | Sau 30s → login lại được                   | **Critical** | Yes        |
| `TC_FR02_10` | Tiếp tục request khi đang locked           |       Medium | Yes        |
| `TC_FR02_11` | Email `type=email`                         |       Medium | Yes        |
| `TC_FR02_12` | Password `type=password`                   |       Medium | Yes        |
| `TC_FR02_13` | Đúng 1 `h1`                                |          Low | Yes        |
| `TC_FR02_14` | Required fields                            |       Medium | Yes        |
| `TC_FR02_15` | Error nằm trên Submit                      |       Medium | Yes        |
| `TC_FR02_16` | Password được ẩn                           |       Medium | Yes        |
| `TC_FR02_17` | Tab order                                  |   Low/Medium | Yes        |

**17 test case** này phù hợp hơn 8 test case ban đầu cho automation.

---

# 10. Quan trọng: không nên giữ nguyên `TC_FR02_06` và `TC_FR02_07` cũ

Hai case cũ:

> `Attempts = 0`

và

> `Attempts = 2`

không phải là cách viết tốt cho browser automation.

Nên chuyển thành:

```text
TC_FR02_05
Wrong login #1
→ account still usable

TC_FR02_06
Wrong login #1
Wrong login #2
→ account still usable

TC_FR02_07
Wrong login #1
Wrong login #2
Wrong login #3
→ account locked
```

Như vậy test đang kiểm tra **observable behavior của SUT**, thay vì kiểm tra một biến nội bộ mà browser không thể nhập.

---

# 11. Đặc biệt với bug `B_FR02_01`

Theo thông tin bạn cung cấp, bug thực tế là:

> Account bị khóa ở lần đăng nhập hợp lệ tiếp theo (lần thứ 3).

Điều này cho thấy test automation nên **rất chú trọng sequence**, chứ không chỉ test từng login độc lập.

Ví dụ:

```text
Wrong #1
    ↓
Wrong #2
    ↓
Wrong #3
    ↓
LOCK
    ↓
Correct credentials
    ↓
MUST NOT LOGIN
```

Đây là một **state transition test** rất phù hợp với FR-02.

Có thể hình dung trạng thái như sau:

```text
UNLOCKED
   │
   ├── wrong #1 ──→ UNLOCKED
   │
   ├── wrong #2 ──→ UNLOCKED
   │
   └── wrong #3 ──→ LOCKED (30s)
                         │
                         ├── correct password ──→ STILL LOCKED
                         │
                         └── after 30s ─────────→ UNLOCKED
```

Đây nên là **trọng tâm của automation FR-02**, vì nó vừa cover requirement, vừa có khả năng bắt được bug sequence mà bộ test case ban đầu dễ bỏ sót.

### Kết luận

Với HW4, mình **không khuyến nghị tự động hóa nguyên xi 8 test case hiện tại**. Nên dùng khoảng **17 case ở trên**, trong đó nhóm quan trọng nhất là:

**`TC_FR02_05 → TC_FR02_09`**

vì chúng cover:

* 1 lần sai
* 2 lần sai — **boundary trước ngưỡng**
* 3 lần sai — **boundary tại ngưỡng**
* credential đúng khi đang locked
* hết đúng 30 giây và unlock

Đặc biệt, `TC_FR02_07` và `TC_FR02_08` nên được thiết kế thành **test sequence**, không chạy như những test login độc lập. Điều này cũng giúp automation có khả năng phát hiện chính xác bug `B_FR02_01` mà bạn đã tìm thấy.
