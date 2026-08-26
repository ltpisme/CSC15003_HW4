# FR-07 — Requirements and Scope

## 1. Sources

| Source | Relevant information |
|---|---|
| `README.md:93-101` | Đặc tả nghiệp vụ FR-07 Giỏ hàng (Shopping Cart): hiển thị bảng sản phẩm gồm các cột Sản phẩm, Đơn giá, Số lượng (có nút +/- để chỉnh), Thành tiền, Thao tác; thêm cùng sản phẩm sẽ tăng số lượng chứ không tạo dòng mới; nút Xóa sản phẩm phải có dialog xác nhận; có nút "Tiếp tục mua sắm"; tổng tiền hiển thị nhãn chính xác "Tổng cộng"; giỏ hàng trống có hình minh họa và thông báo rõ ràng. |
| `README.md:83-88` | Đặc tả FR-06 Chi tiết sản phẩm: ô nhập số lượng (số nguyên dương $\ge 1$), nút "Thêm vào giỏ hàng" hiển thị phản hồi trực quan (toast/badge). |
| `README.md:102-109` | Đặc tả FR-08 Checkout: chuyển từ giỏ hàng sang thanh toán, chỉ user đã đăng nhập mới thanh toán được, giỏ hàng được xóa sau thanh toán thành công. |
| `README.md:245-249` | Tiêu chuẩn giao diện chung (FR-21): đơn vị tiền tệ `₫`, phân cách hàng nghìn. |
| `README.md:261` | Yêu cầu điều hướng (FR-23): Link "Giỏ hàng" trên Navbar phải hiển thị badge số lượng sản phẩm. |
| `README.md:263` | Yêu cầu Breadcrumb (FR-23): bắt buộc có ở trang Giỏ hàng. |
| `README.md:267-269` | Yêu cầu phản hồi & trạng thái (FR-24): toast/badge sau khi thêm vào giỏ, dialog xác nhận khi xóa, empty state có icon/hình minh họa. |
| `api_specification.md:110-128` | Đặc tả API Giỏ hàng: `GET /api/cart` (lấy giỏ hàng), `POST /api/cart` (thêm vào giỏ hàng, body `{ id, name, price, quantity }`), yêu cầu header `Authorization: Bearer <token>`. |
| `analysis/FR07_shopping_cart.md:1-140` | Phân tích nghiệp vụ, luồng workflow và kiểm thử cho Shopping Cart. |

## 2. Functional Scope

Dựa trên đặc tả trong repository:
- **Thêm sản phẩm vào giỏ**:
  - Người dùng có thể chọn số lượng và thêm sản phẩm vào giỏ từ trang chi tiết sản phẩm hoặc từ danh sách sản phẩm.
  - Phải có phản hồi trực quan (toast thông báo hoặc cập nhật badge) khi thêm thành công.
  - Nếu sản phẩm đã có trong giỏ, hệ thống phải cộng dồn số lượng vào dòng hiện có, không tạo dòng mới.
- **Xem giỏ hàng**:
  - Truy cập trang `/cart` để xem danh sách sản phẩm đã chọn.
  - Hiển thị bảng chi tiết: Sản phẩm, Đơn giá, Số lượng, Thành tiền từng món, và Thao tác.
  - Hiển thị tổng tiền với nhãn chính xác "Tổng cộng" (đơn vị `₫`, định dạng phân cách hàng nghìn).
- **Cập nhật số lượng**:
  - Cho phép tăng/giảm số lượng trực tiếp trên từng dòng sản phẩm qua nút `+` / `-`.
- **Xóa sản phẩm khỏi giỏ**:
  - Bấm nút Xóa phải xuất hiện hộp thoại xác nhận (Confirmation Dialog) trước khi thực hiện xóa.
- **Trạng thái giỏ hàng trống (Empty State)**:
  - Khi giỏ không có món nào, hiển thị thông báo rõ ràng kèm hình minh họa / icon và link "Tiếp tục mua sắm" về trang chủ.
- **Điều hướng và chuyển tiếp thanh toán**:
  - Nút "Tiếp tục mua sắm" đưa người dùng về trang chủ (`/`).
  - Nút "Tiến hành thanh toán" chuyển người dùng sang quy trình checkout (`/checkout`) nếu đã đăng nhập; nếu chưa đăng nhập thì yêu cầu đăng nhập.

## 3. Actors / Entry Points

- **Khách hàng (Guest / Authenticated User)**:
  - Entry point UI: Nút "Thêm vào giỏ hàng" tại trang chi tiết sản phẩm (`/product/:id`).
  - Entry point UI: Nút "Thêm vào giỏ" tại thẻ sản phẩm ở Trang chủ (`/`).
  - Entry point UI: Link "Giỏ hàng" trên Header Navbar.
  - Entry point UI: Trang Giỏ hàng (`/cart`).
- **Client / Test Scripts**:
  - Entry point API: `GET /api/cart` (yêu cầu JWT).
  - Entry point API: `POST /api/cart` (yêu cầu JWT).

## 4. Inputs

| Input | Type | Source | Constraints |
|---|---|---|---|
| `quantity` (thêm mới) | Integer | Form input trên `ProductDetail.jsx` | Số nguyên dương, tối thiểu là 1 (`README.md:86`). |
| `product` object | Object | Component state / API product | Gồm `id`, `name`, `price`, `imageUrl` (`README.md:85`). |
| `index` / item identifier (khi xóa) | Number | Nút Xóa trên `Cart.jsx` | Chỉ mục hợp lệ của phần tử trong mảng giỏ hàng. |
| `quantity` modifier (khi cập nhật) | Action | Nút `+` / `-` trên từng dòng giỏ hàng | Tăng/giảm số lượng món hàng (`README.md:95`). |

## 5. Outputs / Observable Results

| Result | Evidence |
|---|---|
| Phản hồi trực quan sau khi thêm vào giỏ: Toast notification hoặc badge số lượng cập nhật | `README.md:87, 261, 267` |
| Bảng giỏ hàng hiển thị danh sách sản phẩm với các cột: Sản phẩm, Đơn giá, Số lượng, Thành tiền, Thao tác | `README.md:95` |
| Số lượng sản phẩm cộng dồn khi thêm cùng 1 sản phẩm | `README.md:96` |
| Hộp thoại xác nhận (dialog) xuất hiện khi bấm Xóa | `README.md:97, 268` |
| Tổng tiền hiển thị nhãn "Tổng cộng" kèm giá trị tính bằng $\sum (\text{giá} \times \text{số lượng})$ | `README.md:95, 99` |
| Màn hình giỏ hàng trống có hình minh họa và thông báo rõ ràng | `README.md:100, 269` |
| Phản hồi API `GET /api/cart`: Mảng các món hàng trong giỏ | `api_specification.md:114-116` |
| Phản hồi API `POST /api/cart`: HTTP 200 `{ message: "Added to cart" }` | `api_specification.md:118-128` |

## 6. Preconditions

- Trang web EShop đang chạy (`http://localhost:5173`).
- Đối với thao tác xem/thêm trên frontend Web: Không bắt buộc đăng nhập (giỏ hàng hoạt động ở local context).
- Đối với thao tác gọi API Backend (`/api/cart`): Bắt buộc người dùng đã đăng nhập và có JWT Token hợp lệ.

## 7. Postconditions

- Thêm sản phẩm: Danh sách item trong giỏ tăng lên (hoặc tăng quantity nếu đã có), tổng tiền giỏ hàng tăng tương ứng.
- Xóa sản phẩm: Item bị gỡ khỏi giỏ hàng sau khi xác nhận dialog, tổng tiền giảm tương ứng.
- Đặt hàng thành công: Giỏ hàng được làm rỗng (`clearCart`).

## 8. Explicit Constraints / Rules

- **Không tạo dòng trùng lặp**: Thêm cùng một sản phẩm vào giỏ phải tăng số lượng, không được tạo dòng mới (`README.md:96`).
- **Xác nhận trước khi xóa**: Nút Xóa sản phẩm bắt buộc phải có dialog xác nhận (`README.md:97, 268`).
- **Nhãn tổng tiền**: Bắt buộc là "Tổng cộng", không được dùng "Tổng tạm tính" (`README.md:99`).
- **Nút quay lại**: Có nút "Tiếp tục mua sắm" để quay về trang chủ (`README.md:98`).
- **Badge số lượng**: Navbar phải có badge hiển thị số lượng sản phẩm trong giỏ (`README.md:261`).
- **Breadcrumb**: Bắt buộc có ở trang Giỏ hàng (`README.md:263`).

## 9. Unknown / Not Found

- Giới hạn số lượng tồn kho tối đa (max stock limit) khi thêm vào giỏ: *Not explicitly specified in repository evidence*.
- Cơ chế đồng bộ tự động giữa local client cart và backend `userCarts` khi đăng nhập: *Not found in repository evidence* (local context và backend API hoạt động tách rời).
