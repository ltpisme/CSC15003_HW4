Dựa trên toàn bộ SRS, GUI, Domain Testing, BVA và kết quả thực tế, **9 test case hiện tại chưa đủ coverage cho automation testing của FR-07**. Chúng tập trung khá tốt vào nghiệp vụ thêm/xóa sản phẩm, nhưng còn bỏ sót nhiều yêu cầu GUI có thể kiểm thử hoàn toàn trên browser.

Đặc biệt, các yêu cầu như **`+/-`, badge Navbar, Breadcrumb, `<h1>`, nhãn "Tổng cộng", định dạng ₫, empty-state illustration, Continue Shopping, visual feedback và Tab Order** nên được chuyển thành test case riêng.

Ngoài ra, với automation browser, **không nên test trực tiếp `GET /api/cart` hoặc `POST /api/cart`**, vì đó là API testing. Automation của FR-07 nên thao tác qua UI và chỉ quan sát kết quả trên browser.

## Bộ test case FR-07 đề xuất

| ID                   | Test objective                                             | Loại               | Coverage | Expected result                                                                                |
| -------------------- | ---------------------------------------------------------- | ------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| **TC_FR07_01** | Hiển thị Empty State khi giỏ hàng trống               | Functional/UI       | E6       | Hiển thị illustration/icon và thông báo giỏ hàng trống rõ ràng                       |
| **TC_FR07_02** | Nút "Tiếp tục mua sắm" từ Empty State                 | Navigation          | E6       | Click nút → quay về trang chủ                                                              |
| **TC_FR07_03** | Hiển thị giỏ hàng có sản phẩm                       | Functional/UI       | E7       | Hiển thị đúng sản phẩm, đơn giá, số lượng, thành tiền, thao tác và tổng tiền |
| **TC_FR07_04** | Kiểm tra cấu trúc các cột của giỏ hàng             | UI                  | E7       | Có đầy đủ: Sản phẩm, Đơn giá, Số lượng, Thành tiền, Thao tác                   |
| **TC_FR07_05** | Kiểm tra nhãn tổng tiền                                | UI                  | E7       | Hiển thị chính xác**"Tổng cộng"**, không phải "Tổng tạm tính"                 |
| **TC_FR07_06** | Kiểm tra định dạng tiền tệ                           | UI                  | E7       | Giá và tổng tiền sử dụng ký hiệu**₫** và phân cách hàng nghìn              |
| **TC_FR07_07** | Thêm sản phẩm chưa tồn tại vào giỏ                 | Functional          | E1, E4   | Sản phẩm xuất hiện trong giỏ với số lượng đã nhập                                  |
| **TC_FR07_08** | Thêm cùng sản phẩm lần thứ hai                       | Functional          | E1, E5   | Số lượng được cộng dồn,**không tạo dòng sản phẩm mới**                     |
| **TC_FR07_09** | Thêm sản phẩm với số lượng = 1                      | BVA                 | BVA2, E1 | Thêm thành công với quantity = 1                                                           |
| **TC_FR07_10** | Thêm sản phẩm với số lượng = 2                      | BVA                 | BVA3, E1 | Thêm thành công với quantity = 2                                                           |
| **TC_FR07_11** | Thêm sản phẩm với số lượng = 0                      | Boundary/Negative   | BVA1, E2 | Không cho thêm hoặc hiển thị validation error                                             |
| **TC_FR07_12** | Thêm sản phẩm với số lượng âm                      | Negative            | E2       | Không cho thêm và hiển thị lỗi số lượng                                               |
| **TC_FR07_13** | Nhập số lượng thập phân                              | Negative            | E3       | Không chấp nhận số thập phân và hiển thị lỗi                                         |
| **TC_FR07_14** | Tăng số lượng bằng nút`+`                          | Functional          | C1, E7   | Quantity tăng 1 và thành tiền/tổng tiền cập nhật                                       |
| **TC_FR07_15** | Giảm số lượng bằng nút`-`                          | Functional/Boundary | C1, E7   | Quantity giảm 1 và thành tiền/tổng tiền cập nhật                                       |
| **TC_FR07_16** | Không cho giảm quantity xuống dưới 1                  | Boundary            | C1       | Khi quantity = 1, thao tác`-` không tạo quantity ≤ 0                                     |
| **TC_FR07_17** | Xóa sản phẩm và xác nhận                             | Functional          | E8       | Hiển thị confirmation dialog → xác nhận → sản phẩm bị xóa                            |
| **TC_FR07_18** | Xóa sản phẩm và hủy xác nhận                        | Functional          | E9       | Dialog xuất hiện → hủy → sản phẩm vẫn còn                                             |
| **TC_FR07_19** | Giỏ hàng trở thành Empty State sau khi xóa item cuối | Functional/UI       | E6       | Hiển thị Empty State sau khi sản phẩm cuối cùng bị xóa                                 |
| **TC_FR07_20** | Badge số lượng trên Navbar                             | UI/State            | E4, E5   | Badge hiển thị và cập nhật theo số lượng sản phẩm trong giỏ                         |
| **TC_FR07_21** | Breadcrumb của trang Giỏ hàng                           | Navigation/UI       | E7       | Breadcrumb xuất hiện và thể hiện đúng vị trí trang                                    |
| **TC_FR07_22** | Tiêu đề`<h1>` của trang                              | Accessibility/UI    | E6, E7   | Trang có đúng**1 `<h1>`** mô tả nội dung Giỏ hàng                              |
| **TC_FR07_23** | Phản hồi sau khi thêm vào giỏ                         | Feedback            | E1       | Sau khi click "Thêm vào giỏ", có toast/badge hoặc feedback trực quan                     |
| **TC_FR07_24** | Ngôn ngữ giao diện                                      | UI                  | E6, E7   | Nội dung giao diện sử dụng tiếng Việt nhất quán                                        |
| **TC_FR07_25** | Màu nút hành động và nguy hiểm                      | Visual/UI           | E7       | Action button dùng màu xanh; delete/cancel dùng màu đỏ theo SRS                          |
| **TC_FR07_26** | Tab Order trên trang Giỏ hàng                           | Accessibility       | E6, E7   | Focus di chuyển theo thứ tự trên→dưới, trái→phải                                     |

---

# Chi tiết test case nên dùng cho automation

## Nhóm A — Empty State & Navigation

### TC_FR07_01 — Empty State

**Precondition:** Giỏ hàng không có sản phẩm.

**Steps:**

1. Mở trang Giỏ hàng.
2. Kiểm tra nội dung hiển thị.

**Expected:**

* Có illustration/icon của empty cart.
* Có message thân thiện cho trạng thái giỏ hàng trống.
* Không hiển thị product row.

**Automation assertion nên có:**

* `getByRole('heading')`
* locator cho empty-state message.
* locator cho illustration/icon.

---

### TC_FR07_02 — Tiếp tục mua sắm

**Precondition:** Giỏ hàng trống.

**Steps:**

1. Mở trang Giỏ hàng.
2. Click **"Tiếp tục mua sắm"**.

**Expected:**

* Browser chuyển về trang chủ.
* URL/page title phù hợp với trang chủ.

---

### TC_FR07_19 — Xóa item cuối cùng

**Precondition:** Giỏ hàng có đúng 1 sản phẩm.

**Steps:**

1. Mở Cart.
2. Click Xóa.
3. Xác nhận xóa.

**Expected:**

* Product row biến mất.
* Cart chuyển sang Empty State.
* Empty-state illustration/message xuất hiện.

Đây là một case quan trọng vì nó kiểm tra **state transition: non-empty → empty**.

---

# Nhóm B — Cart Content

### TC_FR07_03 — Cart có sản phẩm

**Test data:**

* Product: iPhone 15 Pro Max
* Unit price: 30,000,000 ₫
* Quantity: 1

**Expected:**

| Thành phần | Expected          |
| ------------ | ----------------- |
| Product      | iPhone 15 Pro Max |
| Unit price   | 30,000,000 ₫     |
| Quantity     | 1                 |
| Subtotal     | 30,000,000 ₫     |
| Total        | 30,000,000 ₫     |

---

### TC_FR07_04 — Các column

Kiểm tra tồn tại:

* **Sản phẩm**
* **Đơn giá**
* **Số lượng**
* **Thành tiền**
* **Thao tác**

Case này phù hợp với automation vì có thể assertion trực tiếp bằng text/role.

---

### TC_FR07_05 — "Tổng cộng"

**Expected:**

```text
Tổng cộng
```

Phải **fail** nếu UI hiển thị:

```text
Tổng tạm tính
```

Đây là một requirement cụ thể nên assertion phải kiểm tra exact text.

---

### TC_FR07_06 — Currency format

Với giá `30000000`, expected:

```text
30,000,000 ₫
```

hoặc format tương đương theo locale của SUT, nhưng **bắt buộc phải có `₫` và thousands separator**.

Không nên hard-code vị trí dấu phẩy nếu SUT dùng locale khác; nên assertion vào pattern/normalized text phù hợp với implementation thực tế.

---

# Nhóm C — Add to Cart

### TC_FR07_07 — Add new product

**Input:**

```text
Product = iPhone 15 Pro Max
Quantity = 3
```

**Steps:**

1. Mở product detail.
2. Nhập quantity `3`.
3. Click "Thêm vào giỏ".
4. Mở Cart.

**Expected:**

```text
Quantity = 3
Subtotal = 90,000,000 ₫
```

---

### TC_FR07_08 — Add existing product

Đây là case **rất quan trọng** vì phát hiện `B_FR07_01`.

**Precondition:**

```text
iPhone 15 Pro Max × 1
```

**Steps:**

1. Add iPhone với quantity `3`.
2. Mở Cart.
3. Quay lại product detail.
4. Add cùng iPhone với quantity `1`.
5. Mở Cart.

**Expected:**

```text
iPhone 15 Pro Max × 4
```

và:

```text
Number of product rows = 1
```

Không được có:

```text
iPhone × 3
iPhone × 1
```

---

# Nhóm D — Boundary / Invalid Quantity

Nên giữ toàn bộ 3 giá trị BVA:

| Test case  | Quantity | Expected |
| ---------- | -------: | -------- |
| TC_FR07_11 |    `0` | Reject   |
| TC_FR07_09 |    `1` | Accept   |
| TC_FR07_10 |    `2` | Accept   |

Sau đó bổ sung:

| Test case  | Quantity | Expected |
| ---------- | -------: | -------- |
| TC_FR07_12 |   `-5` | Reject   |
| TC_FR07_13 |  `1.5` | Reject   |

Điểm này đặc biệt quan trọng vì kết quả thực tế đã phát hiện:

* `0` → SUT vẫn cho phép.
* `-5` → SUT vẫn cho phép.
* `1.5` → SUT tự biến thành `1`.

Do đó đây là những regression tests rất tốt cho automation.

---

# Nhóm E — Quantity +/- trong Cart

Hai case này đang **thiếu hoàn toàn** trong bộ 9 case ban đầu.

### TC_FR07_14 — Increase quantity

**Precondition:**

```text
Product = iPhone
Quantity = 1
Unit price = 30,000,000 ₫
```

**Steps:**

1. Mở Cart.
2. Click `+`.

**Expected:**

```text
Quantity: 1 → 2
Subtotal: 30,000,000 ₫ → 60,000,000 ₫
Total: updated accordingly
```

---

### TC_FR07_15 — Decrease quantity

**Precondition:**

```text
Quantity = 2
```

**Steps:**

1. Click `-`.

**Expected:**

```text
Quantity: 2 → 1
```

và subtotal được cập nhật.

---

### TC_FR07_16 — Không giảm dưới 1

**Precondition:**

```text
Quantity = 1
```

**Steps:**

1. Click `-`.

**Expected:**

* Quantity không trở thành `0`.
* Quantity không trở thành số âm.
* UI giữ quantity ở `1` hoặc disable nút `-`.
* Không tạo trạng thái cart không hợp lệ.

Đây là một **boundary test tốt hơn việc chỉ kiểm tra input ở product detail**, vì requirement nói rõ cart có nút `+/-`.

---

# Nhóm F — Delete Confirmation

### TC_FR07_17 — Confirm delete

**Steps:**

1. Mở Cart.
2. Click "Xóa".
3. Kiểm tra dialog.
4. Chọn "Có".

**Expected:**

1. Dialog xuất hiện trước khi deletion.
2. User có thể nhìn thấy confirmation.
3. Sau khi confirm, product bị remove.
4. Total được cập nhật.

Case này sẽ bắt `B_FR07_04`.

---

### TC_FR07_18 — Cancel delete

**Steps:**

1. Click "Xóa".
2. Dialog xuất hiện.
3. Chọn "Không".

**Expected:**

* Dialog đóng.
* Product vẫn tồn tại.
* Quantity không thay đổi.
* Total không thay đổi.

Case này sẽ bắt `B_FR07_05`.

---

# Nhóm G — Navbar / Breadcrumb / Feedback

### TC_FR07_20 — Cart badge

**Steps:**

1. Cart empty.
2. Add 1 product.
3. Quan sát Navbar.
4. Tăng quantity.
5. Quan sát badge.

**Expected:**

Badge tồn tại và được cập nhật theo trạng thái cart.

Ví dụ:

```text
Giỏ hàng [1]
```

sau khi quantity tăng:

```text
Giỏ hàng [2]
```

Cần xác định rõ trong implementation liệu badge biểu diễn **tổng quantity** hay **số loại sản phẩm**. Nếu SRS chỉ nói "số lượng sản phẩm", không nên tự suy diễn trong test case.

---

### TC_FR07_21 — Breadcrumb

**Expected:**

Trang Cart phải có breadcrumb.

Ví dụ:

```text
Trang chủ / Giỏ hàng
```

Automation nên kiểm tra existence và visible text, không nên phụ thuộc CSS position.

---

### TC_FR07_23 — Add-to-cart feedback

**Steps:**

1. Mở Product Detail.
2. Click "Thêm vào giỏ".
3. Quan sát UI ngay sau action.

**Expected:**

Một trong các feedback được SRS cho phép xuất hiện:

* toast;
* badge được cập nhật;
* hoặc visual feedback tương đương.

Case này giúp tránh automation chỉ kiểm tra kết quả cuối cùng mà bỏ qua feedback requirement.

---

# Nhóm H — Accessibility / GUI

### TC_FR07_22 — Exactly one `<h1>`

Đây là một test case rất phù hợp với Playwright.

Expected:

```text
page.locator('h1').count() === 1
```

và nội dung `<h1>` mô tả trang Giỏ hàng.

---

### TC_FR07_24 — Vietnamese UI

Kiểm tra các text chính:

```text
Giỏ hàng
Sản phẩm
Đơn giá
Số lượng
Thành tiền
Thao tác
Tổng cộng
Tiếp tục mua sắm
Xóa
```

Không nên biến test này thành việc kiểm tra toàn bộ text của website; chỉ kiểm tra các UI string thuộc FR-07.

---

### TC_FR07_25 — Button color

Kiểm tra semantic category:

* action/submit → blue
* delete/danger → red

Tuy nhiên đây là **visual test**, nên nếu dùng Playwright thuần thì chỉ nên kiểm tra CSS property nếu màu đã được SRS quy định đủ cụ thể. Nếu SRS chỉ nói "xanh dương/đỏ" mà không có mã màu, assertion chính xác RGB/hex sẽ dễ tạo false failure.

---

### TC_FR07_26 — Tab Order

**Steps:**

1. Mở Cart.
2. Dùng `Tab` liên tục.
3. Ghi nhận focused elements.

**Expected:**

Focus đi theo thứ tự logic:

```text
Navbar
→ Breadcrumb / content navigation
→ Product controls
→ Quantity controls
→ Delete
→ Continue Shopping / các action tiếp theo
```

Không nên kiểm tra exact sequence nếu DOM implementation chưa được SRS quy định chi tiết. Assertion nên tập trung vào nguyên tắc **top-to-bottom, left-to-right**.

---

# Bộ coverage sau khi bổ sung

Có thể trace lại requirement như sau:

| Requirement                | Test cases                 |
| -------------------------- | -------------------------- |
| Empty cart                 | TC_FR07_01, 19             |
| Empty illustration/message | TC_FR07_01                 |
| Continue Shopping          | TC_FR07_02                 |
| Product listing            | TC_FR07_03, 04             |
| Unit price                 | TC_FR07_03, 06             |
| Quantity                   | TC_FR07_03, 14, 15, 16     |
| Subtotal                   | TC_FR07_03, 14, 15         |
| Total                      | TC_FR07_03, 05, 06, 14, 15 |
| "Tổng cộng"              | TC_FR07_05                 |
| Add new product            | TC_FR07_07                 |
| Add existing product       | TC_FR07_08                 |
| Quantity valid             | TC_FR07_09, 10             |
| Quantity 0                 | TC_FR07_11                 |
| Negative quantity          | TC_FR07_12                 |
| Decimal quantity           | TC_FR07_13                 |
| `+`                      | TC_FR07_14                 |
| `-`                      | TC_FR07_15                 |
| Lower bound in cart        | TC_FR07_16                 |
| Delete confirmation        | TC_FR07_17, 18             |
| Empty after delete         | TC_FR07_19                 |
| Navbar badge               | TC_FR07_20                 |
| Breadcrumb                 | TC_FR07_21                 |
| Single`<h1>`             | TC_FR07_22                 |
| Add feedback               | TC_FR07_23                 |
| Vietnamese UI              | TC_FR07_24                 |
| Button colors              | TC_FR07_25                 |
| Tab order                  | TC_FR07_26                 |

## Kết luận

Nếu mục tiêu là **HW4 automation testing**, tôi khuyến nghị dùng **26 test case** trên thay vì chỉ tự động hóa 9 case hiện tại.

Quan trọng nhất là **không nên bỏ 17 case GUI/accessibility bổ sung**, vì FR-07 không chỉ có business logic. SRS đã quy định rõ các yêu cầu về **Navbar badge, Breadcrumb, `<h1>`, currency, empty state, feedback, màu sắc và keyboard navigation**, nên chúng cũng là các oracle hợp lệ cho browser automation.

Đồng thời, 6 bug đã phát hiện nên được giữ làm **regression coverage**:

* `B_FR07_01` → TC_FR07_08
* `B_FR07_02` → TC_FR07_13
* `B_FR07_03` → TC_FR07_12
* `B_FR07_04` → TC_FR07_17
* `B_FR07_05` → TC_FR07_18
* `B_FR07_06` → TC_FR07_11

Như vậy bộ test vừa có **requirements coverage + domain/EP coverage + BVA coverage + GUI coverage + regression coverage**, phù hợp hơn nhiều để chuyển sang sinh Playwright TypeScript.
