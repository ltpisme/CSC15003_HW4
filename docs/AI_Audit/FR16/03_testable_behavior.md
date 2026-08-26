# FR-16 — Testable Behavior

## 1. Entry Points

| ID | Entry point | Evidence |
|---|---|---|
| TB-16-EP-01 | File Input trên tab "Sản phẩm" của Web Admin (`frontend-admin`) | `frontend-admin/src/App.jsx:356-384` |
| TB-16-EP-02 | Link "Tải file mẫu (template.csv)" trên Web Admin | `frontend-admin/src/App.jsx:347-353` |
| TB-16-EP-03 | Nút "Import ... sản phẩm" trên Web Admin | `frontend-admin/src/App.jsx:385-425` |
| TB-16-EP-04 | API Endpoint `POST /api/admin/import-products` | `backend/server.js:199-241`, `api_specification.md:184-200` |

## 2. Observable Behaviors

| ID | Action / Condition | Observable Result | Evidence |
|---|---|---|---|
| TB-16-OB-01 | Click link "Tải file mẫu (template.csv)" trên Admin UI | Trình duyệt tải về file `template_import.csv` chứa dữ liệu mẫu: `name,price,description,imageUrl,category_id\nTên sản phẩm mẫu,100000,Mô tả sản phẩm,https://placehold.co/300,1` | `frontend-admin/src/App.jsx:347-353` |
| TB-16-OB-02 | Chọn một file CSV hợp lệ gồm 2 sản phẩm và click "Import 2 sản phẩm" | - UI hiển thị bảng Preview 2 dòng trước khi bấm<br>- Bấm nút: gửi request `POST /api/admin/import-products`<br>- Nhận HTTP 200 `{ message: "Import hoàn tất: 2/2 sản phẩm được thêm", inserted: 2, errors: [] }`<br>- UI Admin hiển thị khung xanh với message thành công<br>- Bảng danh sách sản phẩm bên dưới được tự động cập nhật thêm 2 sản phẩm mới | `frontend-admin/src/App.jsx:368-415,459-478`, `backend/server.js:235-240` |
| TB-16-OB-03 | Upload file CSV có 3 dòng dữ liệu, trong đó dòng 2 (hàng thứ 3 trong file) bị rỗng `name` | - Backend chèn 2 dòng hợp lệ vào CSDL (`inserted = 2`)<br>- Backend ghi nhận lỗi `Hàng 3: Thiếu tên sản phẩm`<br>- Trả HTTP 200 `{ message: "Import hoàn tất: 2/3 sản phẩm được thêm", inserted: 2, errors: ["Hàng 3: Thiếu tên sản phẩm"] }`<br>- UI Admin hiển thị khung xanh thông báo thành công 2/3 kèm danh sách lỗi màu đỏ của Hàng 3 | `backend/server.js:214-239`, `frontend-admin/src/App.jsx:459-478` |
| TB-16-OB-04 | Upload file CSV sử dụng các alias cột tiếng Việt/chữ hoa (`ten`, `gia`, `mo_ta`, `image`, `danh_muc`) | - Frontend tự động map sang schema chuẩn (`name`, `price`, `description`, `imageUrl`, `category_id`)<br>- Import thành công vào CSDL | `frontend-admin/src/App.jsx:390-403` |
| TB-16-OB-05 | Upload file có trường chứa dấu phẩy trong nháy kép (ví dụ: `"SP 1, Edition A",100000,...`) | - Frontend tách chuỗi theo `split(",")` làm vỡ cột `"SP 1"` và `" Edition A"`<br>- Cột `category_id` bị nhận giá trị sai lệch<br>- Dữ liệu lưu vào CSDL bị hỏng format | `frontend-admin/src/App.jsx:371,391-403` |
| TB-16-OB-06 | Upload file có `price` âm hoặc bằng 0 (ví dụ `price = -50000`) | - Frontend và Backend không chặn<br>- Sản phẩm được lưu thành công vào CSDL với giá âm/0 | `frontend-admin/src/App.jsx:392`, `backend/server.js:220` |

## 3. Validation Behaviors

| ID | Input / Condition | Expected Observable Result | Evidence |
|---|---|---|---|
| TB-16-VAL-01 | Gửi `POST /api/admin/import-products` với body `{}` hoặc `{ products: [] }` | Backend trả HTTP 400 `{ error: "Không có dữ liệu để import" }` | `backend/server.js:202-204` |
| TB-16-VAL-02 | Gửi `POST /api/admin/import-products` với `{ products: "invalid_string" }` | Backend trả HTTP 400 `{ error: "Không có dữ liệu để import" }` | `backend/server.js:202-204` |
| TB-16-VAL-03 | Dòng sản phẩm thiếu trường `name` hoặc `name = ""` | Backend bỏ qua dòng đó, không chèn vào CSDL, thêm thông báo `"Hàng <X>: Thiếu tên sản phẩm"` vào mảng `errors` | `backend/server.js:214-217` |
| TB-16-VAL-04 | Dòng sản phẩm thiếu `price` trong CSV | Frontend map thành `price = 0`, Backend chấp nhận và chèn với giá 0 | `frontend-admin/src/App.jsx:392`, `backend/server.js:220` |
| TB-16-VAL-05 | Dòng sản phẩm thiếu `category_id` | Frontend map thành `category_id = 1`, Backend chèn với `category_id = 1` | `frontend-admin/src/App.jsx:401`, `backend/server.js:223` |
| TB-16-VAL-06 | Dòng sản phẩm có `category_id = 9999` (không tồn tại trong bảng `categories`) | Backend chấp nhận và insert thành công do không có foreign key constraint | `backend/server.js:223`, `backend/database.js:70` |

## 4. Error Behaviors

| ID | Error Condition | Observable Result | Evidence |
|---|---|---|---|
| TB-16-ERR-01 | Gọi `POST /api/admin/import-products` không có JWT token | HTTP 401 `{ error: "Unauthorized" }` | `backend/server.js:103` |
| TB-16-ERR-02 | Gọi `POST /api/admin/import-products` với token sai hoặc bị hỏng | HTTP 403 `{ error: "Forbidden" }` | `backend/server.js:106` |
| TB-16-ERR-03 | Gửi mảng `products` rỗng | HTTP 400 `{ error: "Không có dữ liệu để import" }` | `backend/server.js:203` |
| TB-16-ERR-04 | Import file có dòng dữ liệu lỗi | Trả về HTTP 200 (không trả 4xx/5xx), kèm mảng `errors` liệt kê chi tiết từng dòng | `backend/server.js:235-240` |

## 5. State Transitions

| ID | Initial State | Action | Resulting State | Evidence |
|---|---|---|---|---|
| TB-16-ST-01 | `importPreview = []` | Chọn file CSV có 5 dòng dữ liệu | `importPreview` chứa 5 object, UI hiển thị bảng xem trước 5 dòng, nút chuyển sang text `"Import 5 sản phẩm"` | `frontend-admin/src/App.jsx:379,423` |
| TB-16-ST-02 | `importPreview` có 5 dòng | Bấm nút "Import 5 sản phẩm" | Gửi API, `importing = true` (nút hiển thị `"Đang import..."`), sau khi nhận phản hồi gán `importResult`, gọi `fetchData()` cập nhật bảng `products` | `frontend-admin/src/App.jsx:388,409-410,422` |
| TB-16-ST-03 | Bảng `products` có $N$ bản ghi | Import file có $K$ dòng hợp lệ | Bảng `products` trong CSDL có $N + K$ bản ghi (ghi nhận vĩnh viễn) | `backend/server.js:220-231` |

## 6. API-observable Behaviors

| ID | Request | Expected Response | Evidence |
|---|---|---|---|
| TB-16-API-01 | `POST /api/admin/import-products` với `{ products: [ { name: "SP 1", price: 50000 } ] }` | HTTP 200 `{ message: "Import hoàn tất: 1/1 sản phẩm được thêm", inserted: 1, errors: [] }` | `backend/server.js:235-240` |
| TB-16-API-02 | `POST /api/admin/import-products` với `{ products: [ { price: 50000 }, { name: "SP 2", price: 100000 } ] }` | HTTP 200 `{ message: "Import hoàn tất: 1/2 sản phẩm được thêm", inserted: 1, errors: ["Hàng 2: Thiếu tên sản phẩm"] }` | `backend/server.js:215,235-240` |
| TB-16-API-03 | `POST /api/admin/import-products` với `{ products: [] }` | HTTP 400 `{ error: "Không có dữ liệu để import" }` | `backend/server.js:203` |
| TB-16-API-04 | `POST /api/admin/import-products` sử dụng JWT của user thường (`role = 'user'`) | HTTP 200 (thành công bình thường vì backend không check role) | `backend/server.js:199` |

## 7. Persistence Behaviors

| ID | Action | Persisted Data / State | Evidence |
|---|---|---|---|
| TB-16-PER-01 | Import $N$ sản phẩm hợp lệ | $N$ dòng dữ liệu mới được chèn vào bảng `products` trong CSDL SQLite `database.sqlite` với ID tự tăng | `backend/server.js:218-231`, `backend/database.js:64-71` |
| TB-16-PER-02 | Import file có lỗi ở dòng cuối cùng | Tất cả các dòng hợp lệ đứng trước vẫn được lưu vĩnh viễn vào CSDL SQLite (không bị rollback) | `backend/server.js:213-232` |

## 8. Automation Review Notes

Những sai lệch nghiêm trọng giữa đặc tả và implementation ảnh hưởng trực tiếp đến kết quả kiểm thử tự động:

1. **Không có tính nguyên tử / Không Rollback (`server.js:213-240`)**:
   - *Requirement*: `README.md:210` yêu cầu all-or-nothing rollback nếu có bất kỳ lỗi nào.
   - *Implementation*: Backend chèn độc lập từng dòng và trả về HTTP 200 với kết quả một phần (partial import).
   - *Rủi ro automation*: Test kiểm tra rollback (kỳ vọng 0 sản phẩm nào được lưu khi có dòng lỗi) sẽ FAIL hoàn toàn.
2. **Không kiểm tra định dạng đuôi file `.csv` (`App.jsx:356`)**:
   - *Requirement*: `README.md:204` yêu cầu đuôi file bắt buộc là `.csv`.
   - *Implementation*: Input file nhận mọi định dạng file (`.txt`, `.json`,...).
   - *Rủi ro automation*: Test chọn file non-csv kỳ vọng bị từ chối ở client sẽ thấy file vẫn được parse và render preview.
3. **Parser CSV vi phạm RFC 4180 (`App.jsx:371`)**:
   - *Requirement*: `README.md:206` yêu cầu hỗ trợ dấu phẩy trong dấu ngoặc kép.
   - *Implementation*: Dùng `line.split(",")` thô sơ. Dấu phẩy trong nháy kép sẽ làm lệch toàn bộ cột.
   - *Rủi ro automation*: Test kịch bản CSV có chuỗi `"Tên, Mô tả"` sẽ bị lỗi parse và lệch cột.
4. **Không kiểm tra giá dương (`server.js:220`)**:
   - *Requirement*: `README.md:209` yêu cầu `price` phải là số dương ($> 0$).
   - *Implementation*: Giá âm (`-100`) hoặc giá 0 vẫn được insert thành công.
   - *Rủi ro automation*: Test kỳ vọng lỗi validation khi `price <= 0` sẽ nhận kết quả insert thành công (FAIL test expectation).
5. **Partial Failure trả HTTP 200 thay vì 4xx/422**:
   - *Implementation*: Khi có dòng lỗi, backend vẫn trả HTTP 200 JSON `{ message, inserted, errors }`.
   - *Rủi ro automation*: Test assert status code 400/422 cho partial failure sẽ FAIL.
6. **Backend không kiểm tra quyền Admin (`server.js:199`)**:
   - *Implementation*: Endpoint chỉ yêu cầu JWT bất kỳ. Test gọi endpoint với token User thông thường sẽ thành công thay vì nhận HTTP 403.
7. **Đánh số dòng trong thông báo lỗi bắt đầu từ `index + 2`**:
   - *Implementation*: Dòng dữ liệu đầu tiên trong payload được log là `Hàng 2` (vì Hàng 1 là Header). Test assert số dòng cần lưu ý offset này.

## 9. Unknown / Ambiguous Behaviors

- **Hành vi xử lý file quá lớn**: Thao tác parse file chạy đồng bộ trên trình duyệt qua `FileReader`, và backend chạy vòng lặp `rows.forEach` không giới hạn kích thước mảng. Chưa có evidence về giới hạn payload tối đa của `bodyParser.json()` trong repo.
