# FR-07 — Testable Behavior

## 1. Entry Points

| ID | Entry point | Evidence |
|---|---|---|
| TB-07-EP-01 | Nút "Thêm vào giỏ hàng" trên trang chi tiết sản phẩm `/product/:id` | `frontend-web/src/pages/ProductDetail.jsx:64-69` |
| TB-07-EP-02 | Nút "Thêm vào giỏ" trên từng thẻ sản phẩm ở Trang chủ `/` | `frontend-web/src/pages/Home.jsx:97-103` |
| TB-07-EP-03 | Link "Giỏ hàng" trên Header Navbar Web | `frontend-web/src/App.jsx:23` |
| TB-07-EP-04 | Trang Giỏ hàng `/cart` | `frontend-web/src/App.jsx:57`, `frontend-web/src/pages/Cart.jsx:6` |
| TB-07-EP-05 | API Backend `GET /api/cart` & `POST /api/cart` | `backend/server.js:284-295` |

## 2. Observable Behaviors

| ID | Action / Condition | Observable Result | Evidence |
|---|---|---|---|
| TB-07-OB-01 | Click nút "Thêm vào giỏ hàng" lần 1 trên trang `ProductDetail` | Không có gì xảy ra (không cập nhật giỏ, không đổi text nút) do `clickCount === 0` | `frontend-web/src/pages/ProductDetail.jsx:22-25` |
| TB-07-OB-02 | Click nút "Thêm vào giỏ hàng" lần 2 trên trang `ProductDetail` (với số lượng $N$) | - Sản phẩm được thêm vào giỏ hàng với số lượng $N$<br>- Nút chuyển text sang `"Đã thêm"` trong 2000ms rồi quay lại `"Thêm vào giỏ hàng"`<br>- Biến `clickCount` được reset về 0 | `frontend-web/src/pages/ProductDetail.jsx:27-31,68` |
| TB-07-OB-03 | Click nút "Thêm vào giỏ" trên Trang chủ | Sản phẩm được thêm ngay lập tức vào giỏ với số lượng `quantity = 1` chỉ sau 1 lần click | `frontend-web/src/pages/Home.jsx:98` |
| TB-07-OB-04 | Thêm cùng 1 sản phẩm nhiều lần vào giỏ | Trên trang `/cart` xuất hiện nhiều dòng riêng biệt cho cùng sản phẩm đó (không gộp số lượng) | `frontend-web/src/context/CartContext.jsx:8-10`, `frontend-web/src/pages/Cart.jsx:43-58` |
| TB-07-OB-05 | Mở trang `/cart` khi chưa có sản phẩm nào | Hiển thị tiêu đề `<h2>Giỏ hàng của bạn đang trống</h2>` và link `<a href="/">Tiếp tục mua sắm</a>`, không hiển thị bảng sản phẩm và không có icon/ảnh minh họa | `frontend-web/src/pages/Cart.jsx:20-27` |
| TB-07-OB-06 | Mở trang `/cart` khi có sản phẩm | Hiển thị bảng sản phẩm, các cột: Sản phẩm, Giá, Số lượng, Thành tiền, Thao tác; dòng tổng tiền ghi `"Tổng tạm tính: <số_tiền> ₫"` | `frontend-web/src/pages/Cart.jsx:30-65` |
| TB-07-OB-07 | Click nút "Xóa" trên một dòng sản phẩm trong bảng giỏ hàng | Dòng sản phẩm bị xóa ngay lập tức khỏi bảng, tổng tiền được tính lại, không có bất kỳ confirmation dialog nào xuất hiện | `frontend-web/src/pages/Cart.jsx:50-55`, `frontend-web/src/context/CartContext.jsx:12-16` |
| TB-07-OB-08 | Click nút "← Mua tiếp" trên trang `/cart` | Điều hướng trình duyệt về Trang chủ (`/`) | `frontend-web/src/pages/Cart.jsx:66-68` |
| TB-07-OB-09 | Click "Tiến hành thanh toán" khi chưa đăng nhập (`!user`) | Xuất hiện browser native alert `"Bạn cần đăng nhập để thanh toán!"`, sau đó chuyển hướng sang `/login` | `frontend-web/src/pages/Cart.jsx:12-16` |
| TB-07-OB-10 | Click "Tiến hành thanh toán" khi đã đăng nhập (`user !== null`) | Chuyển hướng sang `/checkout` | `frontend-web/src/pages/Cart.jsx:17` |

## 3. Validation Behaviors

| ID | Input / Condition | Expected Observable Result | Evidence |
|---|---|---|---|
| TB-07-VAL-01 | Nhập số lượng âm hoặc 0 vào ô số lượng trên `ProductDetail` | Ô `input[type="number"]` nhận giá trị; khi click đúp thêm vào giỏ, `parseInt(quantity)` truyền số đó vào state, khiến giỏ hàng có item số lượng $\le 0$ hoặc làm sai lệch tổng tiền | `frontend-web/src/pages/ProductDetail.jsx:27,56-62` |
| TB-07-VAL-02 | Nhập số thập phân (ví dụ `2.7`) vào ô số lượng trên `ProductDetail` | `parseInt("2.7")` lấy phần nguyên `2` và thêm vào giỏ với `quantity = 2` | `frontend-web/src/pages/ProductDetail.jsx:27` |

## 4. Error Behaviors

| ID | Error Condition | Observable Result | Evidence |
|---|---|---|---|
| TB-07-ERR-01 | Khách vãng lai bấm "Tiến hành thanh toán" | Trình duyệt kích hoạt alert dialog `"Bạn cần đăng nhập để thanh toán!"` và chặn chuyển sang `/checkout` | `frontend-web/src/pages/Cart.jsx:13-15` |
| TB-07-ERR-02 | Gọi `POST /api/cart` hoặc `GET /api/cart` mà không gửi kèm JWT Header | Backend trả HTTP 401 `{ error: "Unauthorized" }` | `backend/server.js:103` |
| TB-07-ERR-03 | Gọi `POST /api/cart` hoặc `GET /api/cart` với token không hợp lệ | Backend trả HTTP 403 `{ error: "Forbidden" }` | `backend/server.js:106` |

## 5. State Transitions

| ID | Initial State | Action | Resulting State | Evidence |
|---|---|---|---|---|
| TB-07-ST-01 | `cart = []` | Click đúp "Thêm vào giỏ hàng" sản phẩm A ($Q=1$) trên ProductDetail | `cart = [{ ...productA, quantity: 1 }]`, `cartTotal = priceA` | `frontend-web/src/pages/ProductDetail.jsx:27`, `frontend-web/src/context/CartContext.jsx:8-25` |
| TB-07-ST-02 | `cart = [{ ...productA, quantity: 1 }]` | Click "Thêm vào giỏ" sản phẩm A ($Q=1$) trên Home | `cart = [{ ...productA, quantity: 1 }, { ...productA, quantity: 1 }]` (2 phần tử), `cartTotal = priceA * 2` | `frontend-web/src/context/CartContext.jsx:9` |
| TB-07-ST-03 | `cart = [item0, item1]` | Click "Xóa" tại dòng đầu tiên (index 0) | `cart = [item1]`, `cartTotal` cập nhật lại theo `item1` | `frontend-web/src/context/CartContext.jsx:12-16` |
| TB-07-ST-04 | `cart = [item0]` | Click "Xóa" tại dòng 0 | `cart = []`, UI chuyển sang hiển thị màn hình Empty Cart | `frontend-web/src/pages/Cart.jsx:20-27` |
| TB-07-ST-05 | `cart = [item0]` | Tải lại trang (F5 reload) trên trình duyệt | `cart = []` (toàn bộ giỏ hàng bị mất sạch do chỉ nằm trong RAM React state) | `frontend-web/src/context/CartContext.jsx:6` |

## 6. API-observable Behaviors

| ID | Request | Expected Response | Evidence |
|---|---|---|---|
| TB-07-API-01 | `POST /api/cart` với JWT hợp lệ và body `{ "id": 1, "name": "SP A", "price": 100000, "quantity": 2 }` | HTTP 200 `{ "message": "Added to cart" }` | `backend/server.js:290-295` |
| TB-07-API-02 | `GET /api/cart` với JWT hợp lệ sau khi đã POST 1 sản phẩm | HTTP 200 trả về JSON array chứa item vừa thêm `[ { id: 1, name: "SP A", price: 100000, quantity: 2 } ]` | `backend/server.js:284-288` |
| TB-07-API-03 | `GET /api/cart` với JWT của user chưa thêm sản phẩm nào | HTTP 200 `[]` | `backend/server.js:287` |

## 7. Persistence Behaviors

| ID | Action | Persisted Data / State | Evidence |
|---|---|---|---|
| TB-07-PER-01 | Thêm sản phẩm trên Web UI | Chỉ lưu trong bộ nhớ React state `CartContext`. **Không lưu CSDL, không lưu `localStorage`**. | `frontend-web/src/context/CartContext.jsx:6` |
| TB-07-PER-02 | Thêm sản phẩm qua API `POST /api/cart` | Lưu trong mảng JavaScript `userCarts[userId]` trên RAM tiến trình Node.js backend. Mất khi server restart. | `backend/server.js:14,293` |

## 8. Automation Review Notes

Những sai lệch quan trọng giữa đặc tả và implementation ảnh hưởng trực tiếp đến kết quả kiểm thử tự động:

1. **Lỗi Click Đúp khi Thêm vào giỏ (`ProductDetail.jsx:21-31`)**:
   - *Behavior*: Nút "Thêm vào giỏ hàng" trên trang chi tiết sản phẩm bắt buộc phải click **2 lần liên tiếp** mới thêm thành công.
   - *Rủi ro automation*: Automation test chỉ click 1 lần rồi chuyển sang `/cart` sẽ thấy giỏ hàng trống rỗng và test case sẽ FAIL.
2. **Không gộp sản phẩm trùng lặp (`CartContext.jsx:8-10`)**:
   - *Behavior*: Thêm cùng một sản phẩm nhiều lần sẽ tạo ra nhiều dòng riêng lẻ trong bảng thay vì tăng số lượng trên 1 dòng.
   - *Rủi ro automation*: Test assert số dòng `tr` trong bảng bằng số loại sản phẩm sẽ FAIL nếu có kịch bản thêm trùng.
3. **Không có nút Tăng/Giảm số lượng (`+` / `-`) trên bảng Giỏ hàng (`Cart.jsx:47`)**:
   - *Behavior*: Cột Số lượng chỉ là text tĩnh `{item.quantity}`.
   - *Rủi ro automation*: Test cố gắng tìm selector nút `+` hoặc `-` (ví dụ `button:has-text("+")`) để cập nhật số lượng tại trang Cart sẽ timeout / fail.
4. **Nút "Xóa" không bật Confirmation Dialog (`Cart.jsx:50-55`)**:
   - *Behavior*: Click nút "Xóa" lập tức xóa item mà không có dialog.
   - *Rủi ro automation*: Test thiết lập listener `page.on('dialog')` hoặc chờ modal xác nhận sẽ bị timeout / fail.
5. **Nhãn Tổng tiền là "Tổng tạm tính:" (`Cart.jsx:63`)**:
   - *Behavior*: Text hiển thị là `"Tổng tạm tính:"`, không phải `"Tổng cộng"` như trong đặc tả `README.md:99`.
   - *Rủi ro automation*: Assert `getByText(/Tổng cộng/i)` sẽ FAIL. Phải assert `getByText(/Tổng tạm tính:/i)`.
6. **Nút Mua tiếp hiển thị text "← Mua tiếp" (`Cart.jsx:67`)**:
   - *Behavior*: Nút có text `"← Mua tiếp"`, không phải `"Tiếp tục mua sắm"` (chỉ ở trạng thái giỏ rỗng mới có link "Tiếp tục mua sắm").
7. **Không có Breadcrumb và Badge Navbar**:
   - *Behavior*: Trang `/cart` không render Breadcrumb; Header Navbar không có badge số lượng.
   - *Rủi ro automation*: Assert sự tồn tại của breadcrumb hoặc badge sẽ FAIL.
8. **Mất giỏ hàng khi Reload trang**:
   - *Behavior*: Reload trang F5 xóa sạch giỏ hàng. Test automation không được thực hiện reload trang giữa các bước kiểm thử giỏ hàng.
9. **Guest Checkout kích hoạt native Browser Alert**:
   - *Behavior*: `Cart.jsx:13` gọi `alert("Bạn cần đăng nhập để thanh toán!")`. Test automation cần handle dialog nếu click checkout khi chưa login.

## 9. Unknown / Ambiguous Behaviors

- **Tính tương thích giữa Web Cart và Backend Cart API**: Web frontend hoàn toàn không gọi `GET /api/cart` hay `POST /api/cart`. Hai cơ chế này tồn tại song song nhưng không liên kết với nhau trong source code.
