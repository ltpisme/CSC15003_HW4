# FR-07 — Implementation Evidence

## 1. Relevant Files

| File | Role | Relevant area |
|---|---|---|
| `frontend-web/src/context/CartContext.jsx` | Frontend State | Context quản lý giỏ hàng: `cart`, `addToCart`, `removeFromCart`, `clearCart`, `cartTotal` (lines 1-37). |
| `frontend-web/src/pages/Cart.jsx` | Frontend UI | Màn hình Giỏ hàng: render bảng, xóa item, tính tổng, nút điều hướng và checkout (lines 1-80). |
| `frontend-web/src/pages/ProductDetail.jsx` | Frontend UI & Interaction | Trang chi tiết sản phẩm: nhập số lượng, nút "Thêm vào giỏ hàng" và bug double-click (lines 1-74). |
| `frontend-web/src/pages/Home.jsx` | Frontend UI & Interaction | Trang chủ: nút "Thêm vào giỏ" trên từng thẻ sản phẩm (lines 97-103). |
| `frontend-web/src/App.jsx` | Frontend Routing & Header | Route `/cart` (line 57), Header link Giỏ hàng không có badge (lines 17, 23). |
| `frontend-web/src/pages/Checkout.jsx` | Frontend Checkout Flow | Nhận dữ liệu giỏ hàng để thanh toán, không gọi `clearCart()` sau khi hoàn tất (lines 8, 40-66). |
| `backend/server.js` | Backend API & In-Memory State | Khởi tạo `userCarts` in-memory (line 14), API `GET /api/cart` (lines 284-288), API `POST /api/cart` (lines 290-295), format price string cho ID chẵn (lines 162-163). |

## 2. Frontend Evidence

### 2.1 Routes / Pages

- Route Web: `/cart` trỏ tới component `Cart` (`frontend-web/src/App.jsx:57`).
- Điều hướng mua tiếp: Link `<Link to="/">` dẫn về trang chủ (`frontend-web/src/pages/Cart.jsx:24,66`).
- Điều hướng checkout: `navigate('/checkout')` nếu user đã đăng nhập, hoặc `navigate('/login')` kèm browser `alert` nếu là khách (`frontend-web/src/pages/Cart.jsx:11-18`).

### 2.2 UI Elements

| Element | Selector / Text / Identifier | Behavior | Evidence |
|---|---|---|---|
| Header Cart Link | `Link[to="/cart"]` với text `"Giỏ hàng"` | Điều hướng sang `/cart`, **không có badge** số lượng hiển thị | `frontend-web/src/App.jsx:23` |
| Tiêu đề trang Cart | `h2.text-2xl.font-bold` với text `"Giỏ Hàng"` | Dùng thẻ `<h2>` (không phải `<h1>`), không có Breadcrumb | `frontend-web/src/pages/Cart.jsx:31` |
| Bảng Giỏ hàng | `table.w-full` | Hiển thị danh sách các món hàng trong giỏ | `frontend-web/src/pages/Cart.jsx:32-60` |
| Tiêu đề cột bảng | `th` gồm: `"Sản phẩm"`, `"Giá"`, `"Số lượng"`, `"Thành tiền"`, `"Thao tác"` | Cột giá ghi `"Giá"` (thay vì `"Đơn giá"`) | `frontend-web/src/pages/Cart.jsx:35-39` |
| Dòng sản phẩm - Tên | `td` hiển thị `{item.name}` | Tên sản phẩm | `frontend-web/src/pages/Cart.jsx:45` |
| Dòng sản phẩm - Đơn giá | `td` hiển thị `{Number(item.price).toLocaleString()} ₫` | Đơn giá sản phẩm | `frontend-web/src/pages/Cart.jsx:46` |
| Dòng sản phẩm - Số lượng | `td` hiển thị `{item.quantity}` | Text thuần hiển thị số lượng, **không có nút `+` / `-`** để chỉnh sửa | `frontend-web/src/pages/Cart.jsx:47` |
| Dòng sản phẩm - Thành tiền | `td` hiển thị `{(Number(item.price) * item.quantity).toLocaleString()} ₫` | Thành tiền từng dòng | `frontend-web/src/pages/Cart.jsx:48` |
| Nút Xóa sản phẩm | `button.text-red-500` với text `"Xóa"` | Xóa ngay item theo index khi click, **không có dialog xác nhận** | `frontend-web/src/pages/Cart.jsx:50-55` |
| Nhãn Tổng tiền | `div.text-xl.font-bold` chứa text `"Tổng tạm tính:"` | Hiển thị nhãn `"Tổng tạm tính:"` (thay vì `"Tổng cộng"`) kèm số tiền `{cartTotal.toLocaleString()} ₫` màu đỏ | `frontend-web/src/pages/Cart.jsx:62-64` |
| Nút Mua tiếp | `Link[to="/"]` với text `"← Mua tiếp"` | Quay lại trang chủ (text là `"← Mua tiếp"`, không phải `"Tiếp tục mua sắm"`) | `frontend-web/src/pages/Cart.jsx:66-68` |
| Nút Thanh toán | `button.bg-green-500` với text `"Tiến hành thanh toán"` | Màu xanh lá cây (`bg-green-500`), kích hoạt `handleCheckout` | `frontend-web/src/pages/Cart.jsx:69-74` |
| Empty Cart State | `div.text-center` chứa `h2` `"Giỏ hàng của bạn đang trống"` và `Link` `"Tiếp tục mua sắm"` | Chỉ có text và link, **không có hình ảnh minh họa / icon** | `frontend-web/src/pages/Cart.jsx:20-27` |
| Input số lượng (ProductDetail) | `input[type="number"]` liên kết state `quantity` (default 1) | Cho phép nhập số lượng trước khi thêm vào giỏ | `frontend-web/src/pages/ProductDetail.jsx:9,56-61` |
| Nút Thêm vào giỏ (ProductDetail) | `button.bg-green-600` với text `"Thêm vào giỏ hàng"` / `"Đã thêm"` | Bị lỗi click đúp: lần 1 không làm gì (`clickCount === 0`), lần 2 mới thêm vào giỏ và đổi text thành `"Đã thêm"` trong 2s | `frontend-web/src/pages/ProductDetail.jsx:12,21-31,64-69` |
| Nút Thêm vào giỏ (Home) | `button.bg-blue-600` với text `"Thêm vào giỏ"` | Thêm ngay sản phẩm với `quantity = 1` vào giỏ (click 1 lần) | `frontend-web/src/pages/Home.jsx:98-102` |

### 2.3 User Interaction

| Action | Preconditions | Behavior | Evidence |
|---|---|---|---|
| Click "Thêm vào giỏ hàng" lần 1 trên ProductDetail | `clickCount === 0` | Set `clickCount = 1` và `return` ngay (không thêm vào giỏ, không đổi text) | `frontend-web/src/pages/ProductDetail.jsx:22-25` |
| Click "Thêm vào giỏ hàng" lần 2 trên ProductDetail | `clickCount === 1` | Gọi `addToCart(product, parseInt(quantity))`, set `added = true` (hiển thị `"Đã thêm"` trong 2000ms), reset `clickCount = 0` | `frontend-web/src/pages/ProductDetail.jsx:27-31` |
| Click "Thêm vào giỏ" trên Home | Đang ở trang chủ | Gọi `addToCart({ ...p, quantity: 1 }, 1)` ngay lập tức | `frontend-web/src/pages/Home.jsx:98` |
| Thêm sản phẩm đã tồn tại trong giỏ | Sản phẩm đã có trong `cart` | Nối thêm một phần tử mới vào mảng `cart` $\rightarrow$ tạo dòng mới bị trùng lặp | `frontend-web/src/context/CartContext.jsx:8-10` |
| Click "Xóa" trên dòng sản phẩm (Cart) | Có ít nhất 1 sản phẩm | Gọi `removeFromCart(index)`, mảng `cart` xóa phần tử tại vị trí `index` ngay lập tức mà không hỏi xác nhận | `frontend-web/src/pages/Cart.jsx:50-55`, `frontend-web/src/context/CartContext.jsx:12-16` |
| Click "Tiến hành thanh toán" khi chưa đăng nhập (`!user`) | `user === null` | Hiển thị native browser alert `"Bạn cần đăng nhập để thanh toán!"` và chuyển hướng sang `/login` | `frontend-web/src/pages/Cart.jsx:12-16` |
| Click "Tiến hành thanh toán" khi đã đăng nhập (`user !== null`) | `user !== null` | Chuyển hướng sang `/checkout` | `frontend-web/src/pages/Cart.jsx:17` |

### 2.4 Client-side Validation / State

| Behavior | Evidence |
|---|---|
| Quản lý mảng giỏ hàng: `useState([])` bên trong `CartProvider` | `frontend-web/src/context/CartContext.jsx:6` |
| Tính tổng tiền: `cart.reduce((total, item) => total + item.price * item.quantity, 0)` | `frontend-web/src/context/CartContext.jsx:22-25` |
| Parse số lượng khi thêm từ ProductDetail: `parseInt(quantity)` | `frontend-web/src/pages/ProductDetail.jsx:27` |
| Mất trạng thái giỏ hàng khi reload: Do lưu trong React state thuần (không lưu `localStorage` hay sync từ backend), khi F5 giỏ hàng sẽ bị reset về rỗng (`[]`) | `frontend-web/src/context/CartContext.jsx:6` |

## 3. Backend Evidence

### 3.1 API Endpoints

| Method | Endpoint | Input | Response | Evidence |
|---|---|---|---|---|
| `GET` | `/api/cart` | Header: `Authorization: Bearer <token>` | HTTP 200: Mảng các món hàng trong `userCarts[userId]` (mặc định `[]`)<br>Chưa xác thực: HTTP 401 | `backend/server.js:284-288` |
| `POST` | `/api/cart` | Header: `Authorization: Bearer <token>`, Body JSON: `{ id, name, price, quantity, ... }` | HTTP 200: `{ message: "Added to cart" }`<br>Chưa xác thực: HTTP 401 | `backend/server.js:290-295` |

### 3.2 Business Logic

| Rule | Implementation | Evidence |
|---|---|---|
| Lưu trữ giỏ hàng Backend | Lưu trên biến object in-memory toàn cục: `const userCarts = {};`. Mỗi user có mảng `userCarts[userId]`. | `backend/server.js:14,286,292` |
| Thêm vào giỏ Backend | Dùng hàm `.push(req.body)` nối trực tiếp object nhận được từ request vào mảng `userCarts[userId]`, không kiểm tra trùng `id` và không cộng dồn `quantity`. | `backend/server.js:293` |
| Định dạng giá sản phẩm trả về từ Product API | Đối với sản phẩm có `id` chẵn (`row.id % 2 === 0`), trường `price` bị chuyển thành kiểu string (`row.price = row.price.toString()`). | `backend/server.js:162` |

### 3.3 Error Handling

| Condition | Result | Evidence |
|---|---|---|
| Gọi `GET /api/cart` hoặc `POST /api/cart` không có token | HTTP 401 `{ error: "Unauthorized" }` | `backend/server.js:103` |
| Gọi với token không hợp lệ / sai signature | HTTP 403 `{ error: "Forbidden" }` | `backend/server.js:106` |

## 4. Database Evidence

| Table / Collection | Field | Meaning / Usage | Evidence |
|---|---|---|---|
| SQLite Database | Không có bảng `cart` | Giỏ hàng hoàn toàn **không được lưu trữ trong CSDL SQLite** | `backend/database.js:13-82` |

*Ghi chú*: Backend chỉ lưu giỏ hàng tạm trong biến JavaScript in-memory `userCarts` (`backend/server.js:14`). Khi restart backend, toàn bộ giỏ hàng backend bị mất.

## 5. State / Persistence

| State / Data | Storage | Behavior | Evidence |
|---|---|---|---|
| Frontend Web Cart | React `useState([])` trong `CartContext` | Lưu trên bộ nhớ RAM của trình duyệt; **bị xóa sạch khi F5/reload trang**; hoàn toàn độc lập và không gọi `GET /api/cart` hay `POST /api/cart` | `frontend-web/src/context/CartContext.jsx:6-34` |
| Backend Cart | Object in-memory `userCarts` trong `server.js` | Lưu theo `userId` trên RAM của tiến trình Node.js; mất khi server restart | `backend/server.js:14,284-295` |
| Cart State sau Checkout | React `useState([])` | `Checkout.jsx` **không gọi `clearCart()`** sau khi hoàn tất checkout, khiến mảng `cart` vẫn còn giữ nguyên trên frontend | `frontend-web/src/pages/Checkout.jsx:40-66` |

## 6. Cross-layer Flow

### 6.1 Luồng Thêm vào giỏ hàng và Xem giỏ hàng trên Web (Frontend-only Flow)

```
[User trên ProductDetail.jsx]
       │ Click lần 1: setClickCount(1) -> Không làm gì
       │ Click lần 2: Gọi addToCart(product, quantity)
       ▼
[CartContext.jsx]
       │ setCart([...cart, { ...product, quantity }])
       │ cartTotal tự động tính lại bằng reduce
       ▼
[User bấm vào link /cart trên Navbar]
       │ Header Link không có badge số lượng
       ▼
[Cart.jsx]
       │ Đọc cart và cartTotal từ CartContext
       │ Render bảng sản phẩm
       │ Render nhãn "Tổng tạm tính: <cartTotal> ₫"
       │ Render nút "Xóa" không có confirm dialog
```

### 6.2 Luồng Backend Cart API (Tách biệt hoàn toàn với Web Frontend)

```
[Client gửi HTTP POST /api/cart kèm JWT]
       │ Body: { id: 1, name: "iPhone 15 Pro Max", price: 30000000, quantity: 2 }
       ▼
[Backend server.js]
       │ authenticateToken middleware xác thực JWT -> req.user.id
       │ userCarts[userId].push(req.body)
       │ res.json({ message: "Added to cart" })
       ▼
[Client gửi HTTP GET /api/cart kèm JWT]
       │ Trả về userCarts[userId]
```

## 7. Important Implementation Details

1. **Bug Click Đúp tại ProductDetail (`ProductDetail.jsx:21-31`)**:
   - Hàm `handleAddToCart` kiểm tra `clickCount === 0` thì set lên 1 và `return`. Người dùng/Automation **bắt buộc phải click 2 lần** thì sản phẩm mới được thêm vào giỏ hàng.
2. **Trùng lặp dòng sản phẩm khi thêm nhiều lần (`CartContext.jsx:8-10`)**:
   - Hàm `addToCart` thực hiện `setCart([...cart, { ...product, quantity }])` mà không kiểm tra `product.id` đã có trong mảng hay chưa. Thêm cùng 1 sản phẩm 2 lần sẽ tạo ra 2 dòng riêng biệt trong bảng giỏ hàng.
3. **Không có nút tăng/giảm `+` / `-` trên trang Cart (`Cart.jsx:47`)**:
   - Cột số lượng chỉ render chuỗi `{item.quantity}` dạng text tĩnh, không có các nút `+` / `-` như đặc tả FR-07.
4. **Xóa sản phẩm không có Confirmation Dialog (`Cart.jsx:50-55`)**:
   - Bấm nút "Xóa" lập tức gọi `removeFromCart(index)` và gỡ item khỏi giao diện, không hiển thị `window.confirm` hay modal xác nhận.
5. **Nhãn tổng tiền sai lệch (`Cart.jsx:63`)**:
   - Giao diện hiển thị text `"Tổng tạm tính:"` thay vì `"Tổng cộng"` theo yêu cầu nghiêm ngặt của `README.md:99`.
6. **Nút quay lại trang chủ sai text (`Cart.jsx:67`)**:
   - Hiển thị `"← Mua tiếp"` thay vì `"Tiếp tục mua sắm"`.
7. **Empty Cart State thiếu hình ảnh (`Cart.jsx:20-27`)**:
   - Khi giỏ hàng rỗng, chỉ render thẻ `<h2>` và `<Link>`, không có icon hay hình minh họa.
8. **Navbar thiếu Badge số lượng giỏ hàng (`App.jsx:23`)**:
   - Link "Giỏ hàng" trên Header chỉ là `<Link to="/cart">Giỏ hàng</Link>` thuần túy, không có số đếm badge.
9. **Dữ liệu giá chẵn trả về dạng String (`server.js:162`)**:
   - Backend API `/api/products/:id` chuyển `price` thành chuỗi với ID chẵn. `CartContext` dùng `item.price * item.quantity` (ép kiểu ngầm qua phép nhân), nhưng `Cart.jsx` phải bọc `Number(item.price)` để hiển thị `toLocaleString()`.
10. **Không xóa giỏ hàng sau khi Checkout (`Checkout.jsx:40-66`)**:
    - Component `Checkout` không gọi `clearCart()` sau khi nhận phản hồi thanh toán thành công.

## 8. Unknown / Not Found

- Cơ chế lưu trữ giỏ hàng vào `localStorage` cho khách vãng lai: *Not found in repository evidence* (giỏ hàng chỉ nằm trong React state RAM).
- Cơ chế kiểm tra tồn kho (inventory check) trước khi thêm vào giỏ: *Not found in repository evidence*.
