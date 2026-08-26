# FR-16 — Requirements and Scope

## 1. Sources

| Source | Relevant information |
|---|---|
| `README.md:200-212` | Đặc tả nghiệp vụ FR-16 Import Sản phẩm từ CSV: Admin tải lên file CSV để import nhiều sản phẩm cùng lúc; đuôi file phải là `.csv`; dòng 1 là header `name,price,description,imageUrl,category_id`; hỗ trợ RFC 4180 (dấu phẩy trong nháy kép); validation: `name` không rỗng, `price` là số dương; lỗi bất kỳ dòng nào phải rollback toàn bộ (all-or-nothing); hiển thị báo cáo số dòng thành công, số dòng lỗi và lý do. |
| `README.md:174-180` | Đặc tả FR-12 Access Control: Phân hệ Admin chỉ dành cho tài khoản `role = 'admin'`, tất cả API Admin yêu cầu JWT hợp lệ và kiểm tra role admin trong token. |
| `api_specification.md:184-200` | Đặc tả API 6.3: `POST /api/admin/import-products`, body JSON `{ "products": [ { name, price, description, imageUrl, category_id } ] }`, yêu cầu header `Authorization: Bearer <token>` và quyền admin. |
| `backend/feature_analysis.md:591-845` | Phân tích toàn diện luồng import CSV, domain testing, boundary testing và các rủi ro. |
| `analysis/FR16_product_import_csv.md:1-206` | Phân tích quy trình, sơ đồ trình tự và dữ liệu chi tiết cho FR-16. |

## 2. Functional Scope

Dựa trên đặc tả trong repository:
- **Tải lên và Import file CSV**:
  - Quản trị viên (Admin) chọn file CSV chứa danh sách sản phẩm để thêm hàng loạt vào hệ thống EShop.
  - Hỗ trợ tải file mẫu (`template.csv`) với cấu trúc chuẩn.
- **Cấu trúc File CSV chuẩn**:
  - Đuôi tệp: Bắt buộc là `.csv`.
  - Header chuẩn dòng đầu: `name,price,description,imageUrl,category_id`.
  - Chuẩn RFC 4180: Cho phép các trường dữ liệu chứa dấu phẩy nếu được bọc trong dấu nháy kép `""` (ví dụ: `"Điện thoại, màu xanh"`).
- **Quy tắc Kiểm tra dữ liệu (Validation)**:
  - `name`: Bắt buộc, không được để rỗng.
  - `price`: Bắt buộc, phải là số dương ($> 0$).
  - `category_id`: Thuộc danh mục hợp lệ.
- **Tính nguyên tử của giao dịch (Atomic Transaction)**:
  - Nguyên tắc All-or-Nothing: Nếu có lỗi ở bất kỳ dòng nào trong file, toàn bộ quá trình import phải được **rollback** (hủy bỏ hoàn toàn, không lưu bất kỳ sản phẩm nào vào CSDL).
- **Báo cáo kết quả**:
  - Hiển thị thông báo chi tiết: tổng số dòng thành công, số dòng bị lỗi kèm vị trí dòng và nguyên nhân lỗi cụ thể.

## 3. Actors / Entry Points

- **Quản trị viên (Admin)**:
  - Entry point UI: Tab "Sản phẩm" trên Web Admin (`http://localhost:5174`).
  - Nút/Input "Import sản phẩm từ CSV" và xem bảng preview.
- **Client / Test Automation Scripts**:
  - Entry point API: `POST http://localhost:3000/api/admin/import-products`.

## 4. Inputs

| Input | Type | Source | Constraints |
|---|---|---|---|
| File CSV | File (`.csv`) | `<input type="file">` trên Web Admin | File `.csv`, header `name,price,description,imageUrl,category_id`, tuân thủ RFC 4180 (`README.md:204-206`). |
| Payload JSON `products` | Array of Objects | Request Body `POST /api/admin/import-products` | Mảng không rỗng các object sản phẩm `{ name, price, description, imageUrl, category_id }` (`api_specification.md:186-199`). |

## 5. Outputs / Observable Results

| Result | Evidence |
|---|---|
| Tải file mẫu CSV: Tải file `template_import.csv` có sẵn cấu trúc header chuẩn | `frontend-admin/src/App.jsx:347-353` |
| Bảng Preview: Hiển thị danh sách các dòng và cột đã parse từ file CSV trên UI | `README.md:211`, `frontend-admin/src/App.jsx:427-457` |
| Thông báo kết quả Import thành công: Hiển thị tổng số sản phẩm đã thêm | `README.md:211`, `api_specification.md:107` |
| Thông báo lỗi chi tiết: Danh sách lỗi từng dòng (số thứ tự hàng và lý do lỗi) | `README.md:211`, `backend/server.js:235-240` |
| Phản hồi API `POST /api/admin/import-products`: HTTP 200 JSON `{ message, inserted, errors }` | `api_specification.md:184-200`, `backend/server.js:235-240` |
| Phản hồi API khi body rỗng: HTTP 400 `{ error: "Không có dữ liệu để import" }` | `backend/server.js:203` |
| Cập nhật bảng danh sách sản phẩm trên giao diện Admin sau khi import thành công | `frontend-admin/src/App.jsx:410` |

## 6. Preconditions

- Người dùng đã đăng nhập với tài khoản có quyền Quản trị viên (`role = 'admin'`).
- Có sẵn file CSV hợp lệ hoặc payload JSON chứa mảng sản phẩm.
- Server Backend và CSDL SQLite đang hoạt động bình thường.

## 7. Postconditions

- **Import thành công toàn bộ**:
  - Toàn bộ sản phẩm trong file được thêm mới vào bảng `products` trong CSDL.
  - Giao diện Admin cập nhật hiển thị các sản phẩm mới trong danh sách.
- **Import có lỗi (theo đặc tả All-or-Nothing)**:
  - CSDL không thay đổi (rollback toàn bộ nếu có bất kỳ dòng nào lỗi).
  - Hiển thị danh sách các dòng lỗi để người dùng sửa.

## 8. Explicit Constraints / Rules

- **Định dạng file**: File upload phải có đuôi mở rộng `.csv` (`README.md:204`).
- **Header chuẩn**: Header dòng 1 bắt buộc gồm: `name,price,description,imageUrl,category_id` (`README.md:205`).
- **RFC 4180**: Phải xử lý đúng các trường dữ liệu có chứa dấu phẩy được bọc trong dấu nháy kép (`README.md:206`).
- **Tính nguyên tử (Rollback)**: Nếu có lỗi ở bất kỳ dòng nào, toàn bộ import phải được rollback, không lưu dở dang (`README.md:210`).
- **Validation bắt buộc**: `name` không được rỗng, `price` phải là số dương $> 0$ (`README.md:208-209`).
- **Bảo vệ quyền Admin**: API phải xác thực JWT và kiểm tra quyền admin (`README.md:177-180`).

## 9. Unknown / Not Found

- Giới hạn dung lượng file tối đa (max file size upload): *Not explicitly specified in repository evidence*.
- Giới hạn số lượng dòng tối đa trong một lần import: *Not explicitly specified in repository evidence*.
- Cơ chế kiểm tra và chống trùng lặp tên sản phẩm khi import: *Not found in repository evidence*.
