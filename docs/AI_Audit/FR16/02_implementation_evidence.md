# FR-16 — Implementation Evidence

## 1. Relevant Files

| File | Role | Relevant area |
|---|---|---|
| `frontend-admin/src/App.jsx` | Admin Frontend UI & Logic | Tab "Sản phẩm", khối "Import sản phẩm từ CSV": input file (lines 356-384), đọc FileReader & parse thủ công (lines 364-381), bảng preview (lines 427-457), nút submit & mapping alias (lines 386-425), hiển thị kết quả (lines 459-480). |
| `backend/server.js` | Backend API | Route `POST /api/admin/import-products` (lines 199-241): xác thực token, kiểm tra mảng products, chuẩn bị statement insert, lặp từng dòng và finalize báo cáo. |
| `backend/database.js` | Database Schema | Bảng `products` (lines 64-71): định nghĩa các cột `id`, `name`, `price`, `description`, `imageUrl`, `category_id`. |
| `backend/feature_analysis.md` | Tài liệu phân tích hệ thống | Mục `FR-16 Product Import from CSV` (lines 591-845). |

## 2. Frontend Evidence

### 2.1 Routes / Pages

- Giao diện Admin: Tab `activeTab === "products"` trong `frontend-admin/src/App.jsx:337-610`.
- Khối CSV Import nằm trực tiếp phía trên form tạo sản phẩm mới (`frontend-admin/src/App.jsx:342-481`).

### 2.2 UI Elements

| Element | Selector / Text / Identifier | Behavior | Evidence |
|---|---|---|---|
| Tiêu đề khối Import | `h3.text-blue-800` với text `"📂 Import sản phẩm từ CSV"` | Tiêu đề khu vực import | `frontend-admin/src/App.jsx:344-346` |
| Link Tải file mẫu | `a[download="template_import.csv"]` với text `"Tải file mẫu (template.csv)"` | Chứa Data URI CSV mẫu: `name,price,description,imageUrl,category_id\nTên sản phẩm mẫu,100000,Mô tả sản phẩm,https://placehold.co/300,1` | `frontend-admin/src/App.jsx:347-353` |
| Input Chọn file | `input[type="file"]` | Cho phép chọn file từ máy cục bộ. **Không có thuộc tính `accept=".csv"`**, nhận mọi loại file | `frontend-admin/src/App.jsx:356-384` |
| Bảng Xem trước (Preview) | `table.w-full.text-xs` nằm trong `div` có scroll | Hiển thị các dòng dữ liệu và header đã parse từ file trước khi bấm Import | `frontend-admin/src/App.jsx:427-457` |
| Nút Import | `button.bg-blue-600` với text ``Import ${importPreview.length} sản phẩm`` hoặc `"Đang import..."` | Kích hoạt gửi dữ liệu lên backend; `disabled` khi `importing` hoặc `importPreview.length === 0` | `frontend-admin/src/App.jsx:385-425` |
| Hộp kết quả Thành công / Lỗi | `div` có class `bg-green-100` hoặc `bg-red-100` | Hiển thị thông báo `message`, số lượng `inserted` và danh sách lỗi từng dòng `errors` | `frontend-admin/src/App.jsx:459-480` |

### 2.3 User Interaction

| Action | Preconditions | Behavior | Evidence |
|---|---|---|---|
| Chọn file từ máy tính | Người dùng chọn bất kỳ file nào | Kích hoạt `onChange`, `FileReader.readAsText(file)` đọc nội dung, tách dòng bằng `split("\n")` và tách cột bằng `split(",")`, cập nhật `importPreview` state | `frontend-admin/src/App.jsx:358-382` |
| Bấm nút "Import ... sản phẩm" | `importPreview.length > 0` | 1. Chuyển đổi các alias header (`ten`/`Name` $\rightarrow$ `name`, `gia`/`Price` $\rightarrow$ `price`, `danh_muc` $\rightarrow$ `category_id`).<br>2. Giá rỗng mặc định `0`, category rỗng mặc định `1`.<br>3. Gửi `POST /api/admin/import-products` với `{ products: prods }`.<br>4. Lưu kết quả vào `importResult`, gọi `fetchData()` để cập nhật bảng sản phẩm. | `frontend-admin/src/App.jsx:386-424` |

### 2.4 Client-side Validation / State

| Behavior | Evidence |
|---|---|
| Kiểm tra đuôi file `.csv`: **Không có**. File `.txt`, `.png` hoặc bất kỳ định dạng nào đều được đưa vào `FileReader` | `frontend-admin/src/App.jsx:356-384` |
| Logic tách chuỗi CSV (Parser bug): Dùng `line.split(",")` đơn giản, không hỗ trợ dấu phẩy trong dấu ngoặc kép theo RFC 4180 | `frontend-admin/src/App.jsx:371` |
| Hỗ trợ alias tên cột: Chấp nhận `name`/`ten`/`Name`, `price`/`gia`/`Price`, `description`/`mo_ta`/`Description`, `imageUrl`/`image`/`Image`, `category_id`/`danh_muc` | `frontend-admin/src/App.jsx:391-402` |
| Fallback dữ liệu thiếu: `price` thiếu $\rightarrow$ gán `0`; `category_id` thiếu hoặc parse NaN $\rightarrow$ gán `1` | `frontend-admin/src/App.jsx:392,401` |

## 3. Backend Evidence

### 3.1 API Endpoints

| Method | Endpoint | Input | Response | Evidence |
|---|---|---|---|---|
| `POST` | `/api/admin/import-products` | Header: `Authorization: Bearer <token>`<br>Body JSON: `{ "products": [ { name, price, description, imageUrl, category_id } ] }` | Body rỗng/không phải mảng (400): `{ error: "Không có dữ liệu để import" }`<br>Thành công/Một phần (200): `{ message: "Import hoàn tất: X/Y sản phẩm được thêm", inserted: X, errors: [...] }`<br>Chưa xác thực (401/403) | `backend/server.js:199-241` |

### 3.2 Business Logic

| Rule | Implementation | Evidence |
|---|---|---|
| Quyền truy cập API | Sử dụng middleware `authenticateToken`. **Không kiểm tra `req.user.role === 'admin'`**. Bất kỳ token người dùng nào hợp lệ đều gọi được endpoint này | `backend/server.js:199,100-110` |
| Định dạng nhận vào | Nhận mảng JSON trong trường `products` (không nhận file multipart/form-data trực tiếp) | `backend/server.js:200` |
| Kiểm tra mảng rỗng | `if (!rows \|\| !Array.isArray(rows) \|\| rows.length === 0)` $\rightarrow$ trả HTTP 400 | `backend/server.js:202-204` |
| Chuẩn bị câu lệnh SQL | `db.prepare("INSERT INTO products (name, price, description, imageUrl, category_id) VALUES (?, ?, ?, ?, ?)")` | `backend/server.js:209-211` |
| Kiểm tra trường `name` | `if (!row.name)` $\rightarrow$ ghi nhận lỗi `Hàng ${index + 2}: Thiếu tên sản phẩm` và bỏ qua (`return`), không dừng các dòng khác | `backend/server.js:214-217` |
| Kiểm tra trường `price` | **Không có validation**. Giá âm, bằng 0, chữ chuỗi đều được insert vào SQLite | `backend/server.js:220` |
| Giá trị mặc định của trường phụ | `description || ""` (rỗng), `imageUrl || ""` (rỗng), `category_id || 1` (mặc định danh mục 1) | `backend/server.js:221-223` |
| Tính nguyên tử (Transaction/Rollback) | **Không có**. Dữ liệu được insert từng dòng độc lập; các dòng hợp lệ vẫn lưu vào CSDL ngay cả khi các dòng khác bị lỗi | `backend/server.js:213-232` |
| Đánh số hàng trong thông báo lỗi | Dùng `index + 2` (với `index` là chỉ mục phần tử trong mảng dữ liệu, tương ứng số dòng trong file gồm 1 dòng header) | `backend/server.js:215,226` |
| Tổng kết và hoàn tất | Gọi `stmt.finalize()` và trả về HTTP 200 kèm `message`, `inserted` và mảng `errors` | `backend/server.js:234-240` |

### 3.3 Error Handling

| Condition | Result | Evidence |
|---|---|---|
| Request không có Header Authorization | HTTP 401 `{ error: "Unauthorized" }` | `backend/server.js:103` |
| Token sai hoặc hết hạn | HTTP 403 `{ error: "Forbidden" }` | `backend/server.js:106` |
| Body thiếu `products`, `products` không phải mảng hoặc mảng rỗng | HTTP 400 `{ error: "Không có dữ liệu để import" }` | `backend/server.js:203` |
| Dòng thiếu trường `name` | Không dừng tiến trình; push chuỗi `"Hàng <X>: Thiếu tên sản phẩm"` vào mảng `errors`, tiếp tục dòng kế tiếp | `backend/server.js:214-217` |
| Lỗi khi thực thi câu lệnh SQL insert của một dòng | Không rollback các dòng trước; push chuỗi `"Hàng <X>: <err.message>"` vào mảng `errors` | `backend/server.js:225-227` |

## 4. Database Evidence

| Table / Collection | Field | Meaning / Usage | Evidence |
|---|---|---|---|
| `products` | `id` | Khóa chính tự tăng (INTEGER PRIMARY KEY AUTOINCREMENT) | `backend/database.js:65` |
| `products` | `name` | Tên sản phẩm (TEXT) | `backend/database.js:66` |
| `products` | `price` | Giá sản phẩm (INTEGER - không có constraint `CHECK (price > 0)`) | `backend/database.js:67` |
| `products` | `description` | Mô tả sản phẩm (TEXT) | `backend/database.js:68` |
| `products` | `imageUrl` | Đường dẫn ảnh sản phẩm (TEXT) | `backend/database.js:69` |
| `products` | `category_id` | ID danh mục (INTEGER - không có ràng buộc khóa ngoại FOREIGN KEY) | `backend/database.js:70` |

## 5. State / Persistence

| State / Data | Storage | Behavior | Evidence |
|---|---|---|---|
| Preview state | React state `importPreview` trong `App.jsx` | Lưu mảng các dòng sau khi parse từ file, reset khi chọn file mới | `frontend-admin/src/App.jsx:20,362,379` |
| Result state | React state `importResult` trong `App.jsx` | Lưu object phản hồi từ backend để render kết quả | `frontend-admin/src/App.jsx:21,409` |
| Dữ liệu sản phẩm import | CSDL SQLite bảng `products` | Các dòng hợp lệ được ghi vĩnh viễn vào SQLite bằng prepared statement | `backend/server.js:218-231` |
| Re-fetching sau import | Gọi `fetchData()` | Gửi `GET /api/products` cập nhật state `products` trên Admin UI | `frontend-admin/src/App.jsx:410,48` |

## 6. Cross-layer Flow

```
[Admin chọn file CSV trên Admin UI]
       │
       ▼
[FileReader (Client-side)]
       │ Đọc file text -> text.trim().split("\n") -> line.split(",")
       │ Cập nhật state importPreview
       ▼
[Giao diện Admin hiển thị bảng Preview]
       │ Admin kiểm tra và bấm nút "Import X sản phẩm"
       ▼
[Frontend Mapping prods]
       │ Map header alias (ten, gia, mo_ta, image, danh_muc)
       │ price mặc định 0 nếu thiếu, category_id mặc định 1 nếu thiếu
       ▼
[HTTP Request]
       │ POST http://localhost:3000/api/admin/import-products
       │ Header: Authorization: Bearer <adminToken>
       │ Body: { products: [ { name, price, description, imageUrl, category_id }, ... ] }
       ▼
[Backend server.js]
       │ 1. authenticateToken xác thực JWT
       │ 2. Kiểm tra products là mảng không rỗng (nếu rỗng -> 400)
       │ 3. db.prepare(INSERT INTO products...)
       │ 4. Lặp qua từng phần tử trong mảng:
       │      - Nếu !row.name -> errors.push("Hàng X: Thiếu tên sản phẩm")
       │      - Nếu có name -> stmt.run(...) -> inserted++ hoặc ghi lỗi SQL
       │ 5. stmt.finalize()
       │ 6. Trả HTTP 200 { message: "Import hoàn tất: X/Y...", inserted: X, errors: [...] }
       ▼
[Frontend Admin UI]
       │ Render thông báo kết quả (xanh nếu ok/partial, đỏ nếu lỗi 400)
       │ Gọi fetchData() cập nhật bảng sản phẩm
```

## 7. Important Implementation Details

1. **Parser CSV đơn giản không theo RFC 4180 (`App.jsx:367-378`)**:
   - Tách cột bằng `line.split(",")`. Nếu một trường có dấu phẩy nằm trong ngoặc kép (ví dụ `"iPhone 15, Vàng", 20000000`), chuỗi sẽ bị tách làm 2 phần tử, khiến các cột phía sau bị lệch vị trí và `category_id` bị gán sai.
2. **Không kiểm tra định dạng file đuôi `.csv` (`App.jsx:356`)**:
   - Thẻ `<input type="file">` không có thuộc tính `accept=".csv"`, cho phép chọn và đọc bất kỳ tệp tin nào (`.txt`, `.json`, `.csv`,...).
3. **Không có tính nguyên tử / Không Rollback (`server.js:213-240`)**:
   - Backend không sử dụng SQLite Transaction (`BEGIN TRANSACTION` / `ROLLBACK`). Khi import 10 sản phẩm mà dòng thứ 5 thiếu `name`, 9 sản phẩm còn lại vẫn được chèn thành công vào CSDL (Partial Import thành công với HTTP 200).
4. **Không kiểm tra giá dương (`server.js:220`, `App.jsx:392`)**:
   - Backend và Frontend không kiểm tra `price > 0`. Giá bằng `0`, số âm (`-50000`), hoặc chuỗi ký tự đều được chèn vào CSDL bảng `products`.
5. **Không kiểm tra quyền Admin ở Backend (`server.js:199`)**:
   - Endpoint `/api/admin/import-products` chỉ dùng middleware `authenticateToken`, không kiểm tra `req.user.role === 'admin'`. Token của User thông thường vẫn gọi và import thành công.
6. **Không kiểm tra khóa ngoại danh mục (`server.js:223`, `database.js:70`)**:
   - Bảng `products` không có foreign key constraint cho `category_id`. Nhập `category_id = 9999` (không tồn tại trong bảng `categories`) vẫn được insert thành công.
7. **Không kiểm tra trùng lặp (Duplicate Detection)**:
   - Import cùng 1 file CSV nhiều lần sẽ liên tục tạo thêm các dòng sản phẩm mới với ID tự tăng mới.
8. **Đánh số dòng lỗi bắt đầu từ Hàng 2 (`server.js:215`)**:
   - Backend quy ước dòng đầu tiên của file CSV là Header (Hàng 1), nên dòng dữ liệu thứ `index` (tính từ 0) được gán là `Hàng ${index + 2}`.

## 8. Unknown / Not Found

- Cơ chế giới hạn số lượng sản phẩm tối đa có thể import trong một request: *Not found in repository evidence*.
- Ghi log lịch sử import (ai import, thời gian import, file name): *Not found in repository evidence*.
