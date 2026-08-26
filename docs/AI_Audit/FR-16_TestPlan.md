Dựa trên SRS, phần Domain Testing, BVA và các bug thực tế, danh sách 9 test case hiện tại **chưa đủ để kiểm thử FR-16 một cách đầy đủ cho automation trên browser**. Đặc biệt còn thiếu các yêu cầu quan trọng: **atomic rollback, báo cáo kết quả, số dòng thành công/lỗi, lý do lỗi, nhiều lỗi trong cùng file và quyền Admin**.

Ngoài ra, vì phạm vi là **browser/web automation**, không nên viết test gọi trực tiếp `POST /api/admin/import-products`. API chỉ nên được dùng làm thông tin để hiểu behavior; Playwright sẽ thao tác qua UI và upload file.

## 1. Phạm vi test nên có

Có thể chia FR-16 thành 7 nhóm:

| Nhóm                        | Nội dung                       |
| ---------------------------- | ------------------------------- |
| Authentication/Authorization | Admin có thể import           |
| File validation              | `.csv` / non-`.csv`         |
| CSV structure                | Header đúng/sai               |
| CSV parsing                  | Dấu phẩy có/không có quote |
| Field validation             | `name`, `price`             |
| Atomic transaction           | Có lỗi → rollback toàn bộ  |
| Result reporting             | Success/error count và reason  |

---

# 2. Bộ test case đề xuất cho FR-16

## Nhóm A — Authentication / Authorization

### TC_FR16_01 — Admin truy cập chức năng Import

**Mục tiêu:** Kiểm tra Admin có thể sử dụng chức năng import sản phẩm.

**Precondition:**

* Có tài khoản Admin `admin@eshop.com`.
* Người dùng chưa đăng nhập.

**Steps:**

1. Mở website.
2. Đăng nhập bằng tài khoản Admin.
3. Truy cập trang/chức năng Import Products.
4. Kiểm tra UI import file.

**Test data:**

* Email: `admin@eshop.com`
* Password: `Admin123!`

**Expected:**

* Đăng nhập thành công.
* Admin có thể truy cập chức năng Import Products.
* Có control để chọn/upload file.

**Coverage:** Authorization requirement.

---

### TC_FR16_02 — User không có quyền Admin không được import

**Mục tiêu:** Kiểm tra chức năng import chỉ dành cho Admin.

**Steps:**

1. Đăng nhập bằng tài khoản không có role Admin.
2. Truy cập khu vực quản trị/import sản phẩm nếu có thể.
3. Quan sát UI.

**Expected:**

* User không có quyền Admin không thể thực hiện import.
* Không thể upload/import sản phẩm hoặc bị từ chối truy cập.

**Coverage:** Authorization.

> Nếu SRS/HW4 chỉ yêu cầu test chức năng dành cho Admin và không có tài khoản non-admin được cung cấp, có thể đánh dấu test này là **Optional / Not executable** thay vì tự tạo account.

---

# Nhóm B — File extension

### TC_FR16_03 — Import file `.csv` hợp lệ

**Mục tiêu:** Kiểm tra file có extension `.csv` được chấp nhận.

**Steps:**

1. Đăng nhập Admin.
2. Mở Import Products.
3. Upload `products.csv`.
4. Thực hiện import.

**Test data:**

```csv
name,price,description,imageUrl,category_id
iPhone 13,1000,Desc,http://url.com,1
```

**Expected:**

* File `.csv` được chấp nhận.
* Hệ thống tiếp tục xử lý file.
* Nếu dữ liệu hợp lệ, import thành công.

**Coverage:** E1.

---

### TC_FR16_04 — Reject file không phải `.csv`

**Mục tiêu:** Kiểm tra hệ thống từ chối file không có extension `.csv`.

**Test data:**

* `products.xlsx`

**Steps:**

1. Đăng nhập Admin.
2. Mở Import Products.
3. Chọn `products.xlsx`.
4. Thực hiện import nếu UI cho phép chọn file.

**Expected:**

* Hệ thống từ chối file.
* Hiển thị lỗi định dạng file không được hỗ trợ.
* Không import sản phẩm.

**Coverage:** E2, B_FR16_01.

---

# Nhóm C — Header

### TC_FR16_05 — Header hợp lệ

**Test data:**

```csv
name,price,description,imageUrl,category_id
iPhone 13,1000,Desc,http://url.com,1
```

**Expected:**

* Header được chấp nhận.
* Dữ liệu được xử lý đúng.
* Import thành công.

**Coverage:** E3.

---

### TC_FR16_06 — Header thiếu trường

**Test data:**

```csv
name,price
iPhone 13,1000
```

**Expected:**

* Hệ thống phát hiện header không hợp lệ.
* Import bị từ chối.
* Không tạo sản phẩm từ file.
* Báo cáo lỗi phải cho biết nguyên nhân liên quan đến header.

**Coverage:** E4, B_FR16_02.

---

### TC_FR16_07 — Header sai tên trường

Nên bổ sung test này vì `name,price` mới chỉ kiểm tra **thiếu trường**, chưa kiểm tra **sai tên trường**.

**Test data:**

```csv
product_name,price,description,imageUrl,category_id
iPhone 13,1000,Desc,http://url.com,1
```

**Expected:**

* Header bị từ chối.
* Không thực hiện import.

**Coverage:** C2.

---

# Nhóm D — CSV parsing / RFC 4180

### TC_FR16_08 — Field chứa dấu phẩy được quote đúng

Đây là test case rất quan trọng.

**Test data:**

```csv
name,price,description,imageUrl,category_id
"iPhone, 13",1000,"Desc, iPhone 13",http://url.com,1
```

**Expected:**

* CSV được parse đúng.
* `name` được lưu là `iPhone, 13`.
* `price` là `1000`.
* `description` là `Desc, iPhone 13`.
* Không bị tách thành các column sai.
* Import thành công.

**Coverage:** E5, C3.

**Bug liên quan:** B_FR16_03.

---

### TC_FR16_09 — Field chứa dấu phẩy nhưng không quote

**Test data:**

```csv
name,price,description,imageUrl,category_id
iPhone, 13,1000,"Desc",http://url.com,1
```

**Expected:**

* Hệ thống phát hiện dòng CSV không hợp lệ.
* Không import dữ liệu sai.
* Báo cáo lỗi chứa lý do dòng dữ liệu không hợp lệ.
* Nếu đây là file duy nhất, toàn bộ transaction phải rollback.

**Coverage:** E6, B_FR16_03.

---

# Nhóm E — `name`

### TC_FR16_10 — Name hợp lệ với độ dài tối thiểu 1

**Test data:**

```csv
name,price,description,imageUrl,category_id
A,1000,Desc,http://url.com,1
```

**Expected:**

* Name `A` được chấp nhận.
* Import thành công.

**Coverage:** E7, BVA2.

---

### TC_FR16_11 — Name rỗng

**Test data:**

```csv
name,price,description,imageUrl,category_id
,1000,Desc,http://url.com,1
```

**Expected:**

* Hệ thống báo name không được rỗng.
* Không import file.
* Transaction được rollback.

**Coverage:** E8, BVA1.

**Bug status:** Đã Pass trong kết quả thực tế.

---

# Nhóm F — `price`

### TC_FR16_12 — Price bằng 0

**Test data:**

```csv
name,price,description,imageUrl,category_id
iPhone 13,0,Desc,http://url.com,1
```

**Expected:**

* Báo lỗi price phải lớn hơn 0.
* Không import sản phẩm.
* Rollback toàn bộ import.

**Coverage:** E10, BVA3.

**Bug:** B_FR16_04.

---

### TC_FR16_13 — Price bằng 0.01

**Test data:**

```csv
name,price,description,imageUrl,category_id
iPhone 13,0.01,Desc,http://url.com,1
```

**Expected:**

* Price được chấp nhận.
* Import thành công.
* Giá hiển thị/lưu là `0.01`.

**Coverage:** E9, BVA4.

---

### TC_FR16_14 — Price bằng -0.01

**Test data:**

```csv
name,price,description,imageUrl,category_id
iPhone 13,-0.01,Desc,http://url.com,1
```

**Expected:**

* Báo lỗi price phải lớn hơn 0.
* Không import.
* Rollback transaction.

**Coverage:** E10, BVA5.

**Bug:** B_FR16_04.

---

### TC_FR16_15 — Price không phải số

Test này **nên bổ sung**, vì SRS nói `price` phải là **số dương**, trong khi bộ test hiện tại mới kiểm tra `0`, `0.01`, `-0.01`.

**Test data:**

```csv
name,price,description,imageUrl,category_id
iPhone 13,abc,Desc,http://url.com,1
```

**Expected:**

* Hệ thống báo price không hợp lệ.
* Không import.
* Rollback toàn bộ transaction.

**Coverage:** Price validation.

---

# Nhóm G — Atomic rollback

Đây là nhóm đang **thiếu nghiêm trọng nhất** trong 9 test case hiện tại.

### TC_FR16_16 — Một dòng lỗi làm rollback toàn bộ import

**Mục tiêu:** Kiểm tra requirement all-or-nothing.

**Test data:**

```csv
name,price,description,imageUrl,category_id
Product A,1000,Desc A,http://url-a.com,1
Product B,0,Desc B,http://url-b.com,1
Product C,2000,Desc C,http://url-c.com,1
```

**Steps:**

1. Đăng nhập Admin.
2. Upload CSV.
3. Import.
4. Quan sát kết quả.
5. Kiểm tra danh sách sản phẩm.

**Expected:**

* Dòng Product B bị lỗi vì `price = 0`.
* Import toàn bộ file thất bại.
* Product A **không được tạo**.
* Product B **không được tạo**.
* Product C **không được tạo**.
* Transaction được rollback hoàn toàn.

**Coverage:** Atomic transaction / all-or-nothing.

---

### TC_FR16_17 — Lỗi ở dòng cuối vẫn rollback các dòng trước

Test này kiểm tra rollback không phụ thuộc vị trí của dòng lỗi.

**Test data:**

```csv
name,price,description,imageUrl,category_id
Product A,1000,Desc A,http://url-a.com,1
Product B,2000,Desc B,http://url-b.com,1
Product C,0,Desc C,http://url-c.com,1
```

**Expected:**

* Product C bị lỗi.
* Product A và Product B cũng không được import.
* Toàn bộ transaction rollback.

**Coverage:** Atomic transaction.

---

### TC_FR16_18 — Có nhiều dòng lỗi trong cùng một file

**Test data:**

```csv
name,price,description,imageUrl,category_id
Product A,1000,Desc A,http://url-a.com,1
,2000,Desc B,http://url-b.com,1
Product C,0,Desc C,http://url-c.com,1
```

**Expected:**

* Hệ thống phát hiện cả hai dòng lỗi:

  * dòng 3: name rỗng
  * dòng 4: price không hợp lệ
* Không import bất kỳ sản phẩm nào.
* Báo cáo chứa thông tin lỗi của từng dòng.

**Coverage:** Multiple validation errors + rollback.

---

# Nhóm H — Result reporting

### TC_FR16_19 — Báo cáo import thành công

**Test data:**

```csv
name,price,description,imageUrl,category_id
Product A,1000,Desc A,http://url-a.com,1
Product B,2000,Desc B,http://url-b.com,1
Product C,3000,Desc C,http://url-c.com,1
```

**Expected:**

* Import thành công.
* Báo cáo hiển thị:

  * số dòng thành công = `3`
  * số dòng lỗi = `0`
* Không báo lỗi.

**Coverage:** Result reporting.

---

### TC_FR16_20 — Báo cáo lỗi và lý do

**Test data:**

```csv
name,price,description,imageUrl,category_id
Product A,1000,Desc A,http://url-a.com,1
,2000,Desc B,http://url-b.com,1
Product C,0,Desc C,http://url-c.com,1
```

**Expected:**

* Báo cáo cho biết file có lỗi.
* Hiển thị số dòng lỗi.
* Hiển thị lý do tương ứng:

  * name không được rỗng.
  * price phải lớn hơn 0.
* Không import bất kỳ sản phẩm nào do atomic rollback.

**Coverage:** Error count + error reason + rollback.

---

# 3. Bộ test case cuối cùng nên dùng

Nếu mục tiêu là **automation testing bằng Playwright**, mình đề xuất dùng **20 TC** trên thay vì 9 TC ban đầu:

| ID         | Test case                     | Loại         |
| ---------- | ----------------------------- | ------------- |
| TC_FR16_01 | Admin truy cập Import        | Authorization |
| TC_FR16_02 | Non-admin bị từ chối       | Authorization |
| TC_FR16_03 | Import`.csv`                | Positive      |
| TC_FR16_04 | Reject`.xlsx`               | Negative      |
| TC_FR16_05 | Header hợp lệ               | Positive      |
| TC_FR16_06 | Header thiếu trường        | Negative      |
| TC_FR16_07 | Header sai tên trường      | Negative      |
| TC_FR16_08 | Dấu phẩy được quote      | RFC 4180      |
| TC_FR16_09 | Dấu phẩy không quote       | Negative      |
| TC_FR16_10 | Name có 1 ký tự            | BVA           |
| TC_FR16_11 | Name rỗng                    | BVA           |
| TC_FR16_12 | Price = 0                     | BVA           |
| TC_FR16_13 | Price = 0.01                  | BVA           |
| TC_FR16_14 | Price = -0.01                 | BVA           |
| TC_FR16_15 | Price không phải số        | Negative      |
| TC_FR16_16 | Lỗi giữa file → rollback   | Atomicity     |
| TC_FR16_17 | Lỗi dòng cuối → rollback  | Atomicity     |
| TC_FR16_18 | Nhiều dòng lỗi → rollback | Atomicity     |
| TC_FR16_19 | Báo cáo import thành công | Reporting     |
| TC_FR16_20 | Báo cáo lỗi + reason       | Reporting     |

## 4. Những test case có thể gộp

Nếu HW4 giới hạn số lượng test case, có thể giảm từ 20 xuống khoảng **14–15 TC** mà vẫn giữ coverage tốt.

Nên **gộp**:

* `TC_FR16_03 + TC_FR16_05` → một file `.csv` hợp lệ đồng thời kiểm tra header.
* `TC_FR16_12 + TC_FR16_14` → có thể giữ riêng nếu muốn BVA đầy đủ; nếu giới hạn TC thì gộp thành một parameterized test.
* `TC_FR16_16 + TC_FR16_17` → có thể gộp thành một test atomic rollback.
* `TC_FR16_19 + TC_FR16_20` → có thể giữ riêng vì success report và error report là hai behavior khác nhau.

**Không nên gộp** `TC_FR16_08` với `TC_FR16_09`, vì đây là hai lớp tương đương đối lập của C3 và đã phát hiện **B_FR16_03**.

---

## 5. Một điểm cần sửa trong test case gốc

Có một lỗi nhỏ trong tài liệu BVA:

> `TC_FR16_09` ghi **Coverage: BVA6**

Trong bảng BVA phía trên chỉ có **BVA1 → BVA5**. Vì vậy phải sửa thành:

**Coverage: BVA5, E10**

Ngoài ra, giá trị đại diện E5 trong tài liệu đang viết:

```text
'"iPhone, 13",1000,"Desc",http://url.com,1'
```

Nên chuẩn hóa thành một dòng CSV thực tế:

```csv
"iPhone, 13",1000,"Desc",http://url.com,1
```

để tránh việc automation script hiểu nhầm dấu `'` bên ngoài là một phần của test data.

---

## 6. Quan trọng đối với Playwright automation

Với phạm vi **browser-only**, mỗi test nên kiểm tra được behavior thông qua UI. Đặc biệt với rollback, không nên chỉ assert:

> "Import failed"

mà nên assert **database state gián tiếp qua UI**, ví dụ:

1. Import file có 3 products, trong đó 1 product lỗi.
2. UI báo import failed.
3. Navigate về Product List.
4. Search `Product A`.
5. Search `Product C`.
6. Assert cả hai **không tồn tại**.

Như vậy mới chứng minh được:

> **Import failure → toàn bộ transaction rollback**

thay vì chỉ chứng minh frontend hiển thị một message.

Tương tự, với reporting nên ưu tiên assert các thành phần UI cụ thể như:

```text
Success: 2
Errors: 1
Row 3: name is required
```

nếu UI thực tế cung cấp những thông tin đó.

**Kết luận:** Nếu đây là bộ test để nộp HW4, mình sẽ chọn **20 TC ở trên làm test design đầy đủ**, sau đó khi chuyển sang Playwright có thể parameterize/gộp còn khoảng **14–16 automated tests** để tránh duplication nhưng vẫn giữ coverage của **E1–E10 + BVA + RFC 4180 + atomic rollback + reporting**.
