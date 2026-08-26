# AI Audit for HW4

## 1. Trích dẫn thông tin từ FR-02, FR-07, FR-16

<a id="log-1"></a>

- **Timestamp**: 15:51 22/08/2026
- **Tools**: NotebookLM
- **Input**: `HW02_report.md`, `api_specification.md`, `README_sut.md`, `HW04.pdf`
- **Prompt**:

==Prompt Start==
Cho tôi toàn bộ thông tin về FR-02, FR-07, FR-16, để thực hiện automation testing cho HW4
Quy tắc:

    Không tóm tắt

    Không suy diễn

    Không tự tạo thông tin không có trong nguồn
==Promp End==

- **Output**

==Output Start==
`FR-02_Extract.md`

`FR-07_Extract.md`

`FR-16_Extract.md`
==Output End==

- **Verdict**: Valid
- **Reasoning**: NotebookLM đã trích dẫn đầy đủ thông tin từ các file theo yêu cầu
- **Student fix**: Không cần thiết

## 2. Thiết kế Test case cho FR-02, FR-07, FR-16

<a id="log-2"></a>

- **Timestamp**: 16:06 22/08/2026
- **Tools**: ChatGPT
- **Input**: `FR-02_Extract.md`, `FR-07_Extract.md`, `FR-16_Extract.md`
- **Prompt**:

==Prompt Start==
[Nhiệm vụ]
Dựa vào thông tin sau
Đọc và thiết kế các test case cho FR-02, FR-07, FR-16
Đây là test case cho automation testing, chỉ thực hiện test trên browser, test web

[16:04 22/08/2026]
==Promp End==

- **Output**

==Output Start==

`FR-02_TestPlan.md`

`FR-07_TestPlan.md`

`FR-16_TestPlan.md`

==Output End==

- **Verdict**: Incomplete
- **Reasoning**: ChatGPT đã thiết kế các test case nhưng chưa làm rõ các test data
- **Student fix**: Cần hoàn thiện test data

## 3. Viết prompt để trích thông tin

<a id="log-3"></a>

- **Timestamp**: 00:33 26/08/2026
- **Tools**: ChatGPT
- **Input**: Repo Eshop SUT
- **Prompt**:

==Prompt Start==
[Cấu trúc thư mục hiện tai]
ype help for instructions on how to use fish
╭─ltp at ltp in ⌁/Code/Course/Testing/Project/CSC15003-EShopSUT (main ✚2…7)
╰─λ tree -a -I ".git|node_modules"                                                                                                 0 (0.000s) < 00:29:09
.
├── analysis
│   ├── FR02_login_account_lockout.md
│   ├── FR05_product_search.md
│   ├── FR07_shopping_cart.md
│   ├── FR08_checkout.md
│   ├── FR10_order_state_machine.md
│   └── FR16_product_import_csv.md
├── api_specification.md
├── atlas-credentials.env
├── backend
│   ├── database.js
│   ├── database.sqlite
│   ├── feature_analysis.md
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── test_profile.js
├── codex_output.md
├── frontend-admin
│   ├── eslint.config.js
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── frontend-mobile
│   ├── App.js
│   ├── app.json
│   ├── assets
│   │   ├── adaptive-icon.png
│   │   ├── favicon.png
│   │   ├── icon.png
│   │   └── splash-icon.png
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
├── frontend-web
│   ├── eslint.config.js
│   ├── .gitignore
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   ├── hero.png
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   ├── context
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   └── pages
│   │       ├── Cart.jsx
│   │       ├── Checkout.jsx
│   │       ├── ForgotPassword.jsx
│   │       ├── Home.jsx
│   │       ├── Login.jsx
│   │       ├── ProductDetail.jsx
│   │       ├── Profile.jsx
│   │       └── Register.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
├── .github
│   └── workflows
│       └── playwright.yml
├── .gitignore
├── Makefile
├── package.json
├── package-lock.json
├── playwright.config.js
├── playwright-report
│   ├── data
│   │   ├── 65640af2213c8a53ae03ac648d8173482e963078.md
│   │   └── ebe6786ea573dea10630f17eb271f4b7ee1e7ec1.md
│   └── index.html
├── README.md
├── run_servers.sh
├── setup_guide.md
├── test-results
│   ├── example-get-started-link-webkit
│   │   └── error-context.md
│   ├── example-has-title-webkit
│   │   └── error-context.md
│   └── .last-run.json
├── tests
│   └── example.spec.js
└── .vscode
    └── mcp.json

24 directories, 89 files

[Nhiệm vụ]
Prompt cho antigravity để trích ra toàn bộ thông tin có trong repo SUT liên quan đến chức năng FR-02, FR-07 và FR-16, mỗi chức năng viết thành 3 file, không tạo thêm file nào khác
không đọc frontend-mobile
chỉ đọc các file liên quan

mục đích của việc trích thông tin là để đối chiếu kết quả automation testing

[00:33 26/08/2026]
==Promp End==

- **Output**

==Output Start==
Bạn nên cho Antigravity làm theo hướng **repo evidence extraction**, tức là không yêu cầu nó tự suy diễn expected behavior, mà chỉ trích xuất những gì thực sự tồn tại trong SUT để sau đó đối chiếu với kết quả Playwright automation.

Có 3 chức năng × 3 file = **9 file**, và prompt nên khóa chặt phạm vi đọc/ghi để tránh agent tự tạo thêm file.

# Nhiệm vụ

Bạn đang làm nhiệm vụ **trích xuất thông tin từ repository của SUT (System Under Test)** để phục vụ việc **đối chiếu và đánh giá kết quả automation testing bằng Playwright**.

Hãy đọc repository hiện tại và trích xuất **toàn bộ thông tin có trong source code/configuration/documentation liên quan trực tiếp đến 3 chức năng sau**:

* **FR-02 — Login / Account Lockout**
* **FR-07 — Shopping Cart**
* **FR-16 — Product Import CSV**

## Mục tiêu

Kết quả trích xuất sẽ được sử dụng làm **evidence/reference** để:

1. Đối chiếu test case automation với behavior thực tế được implement trong SUT.
2. Kiểm tra automation có test đúng chức năng hay không.
3. Kiểm tra expected result của automation có phù hợp với implementation hay không.
4. Phát hiện các assertion/behavior trong automation không có căn cứ từ SUT.
5. Hỗ trợ review Verdict, Reasoning và Student Fix cho automation testing.

**Không được tự suy diễn requirement hoặc behavior không có evidence trong repository.**

---

# 1. Quy tắc đọc repository

## 1.1. Không đọc frontend-mobile

**TUYỆT ĐỐI KHÔNG đọc bất kỳ file nào bên trong:**

```text
frontend-mobile/
```

Không sử dụng thông tin từ `frontend-mobile` cho bất kỳ kết luận nào.

---

## 1.2. Chỉ đọc file liên quan

Không cần đọc toàn bộ repository một cách máy móc.

Chỉ mở/đọc những file có khả năng chứa evidence liên quan trực tiếp đến:

* FR-02
* FR-07
* FR-16

Ưu tiên các nguồn sau:

### Backend

```text
backend/server.js
backend/database.js
backend/feature_analysis.md
backend/test_profile.js
api_specification.md
```

và các file backend khác nếu thực sự liên quan đến 3 FR.

### Frontend Web

Được phép đọc:

```text
frontend-web/src/App.jsx
frontend-web/src/context/*
frontend-web/src/pages/*
frontend-web/src/*.jsx
frontend-web/src/*.css
frontend-web/src/*.config nếu liên quan
```

Chỉ đọc những file có behavior/UI liên quan đến 3 FR.

### Frontend Admin

Được phép đọc:

```text
frontend-admin/src/*
```

nhưng chỉ khi có behavior liên quan đến FR-16 hoặc các chức năng cần thiết để hiểu FR-16.

### Documentation / specification

Có thể đọc:

```text
README.md
api_specification.md
analysis/FR02_login_account_lockout.md
analysis/FR07_shopping_cart.md
analysis/FR16_product_import_csv.md
```

và các documentation khác nếu chúng thực sự chứa evidence liên quan.

### Configuration

Chỉ đọc các configuration file nếu chúng ảnh hưởng trực tiếp đến behavior của 3 FR.

Ví dụ:

```text
package.json
playwright.config.js
vite.config.js
```

Chỉ đưa vào output nếu configuration đó có ý nghĩa đối với việc hiểu hoặc đối chiếu automation behavior.

---

# 2. Nguyên tắc evidence

Đây là nhiệm vụ **evidence extraction**, không phải nhiệm vụ phân tích hoặc thiết kế test.

Tuân thủ các nguyên tắc sau:

### MUST

* Chỉ ghi thông tin có thể xác định từ repository.
* Ưu tiên trích dẫn **file path + line number**.
* Khi mô tả behavior, phải chỉ ra source code/documentation làm căn cứ.
* Phân biệt rõ:

  * implemented behavior
  * UI behavior
  * API behavior
  * database behavior
  * validation
  * error handling
  * state transition
* Ghi nhận cả positive và negative behavior nếu có evidence.
* Ghi nhận edge case nếu source code thể hiện rõ.
* Ghi nhận giá trị cụ thể như:

  * URL/route
  * HTTP method
  * request body
  * response body
  * status code
  * field name
  * default value
  * validation rule
  * error message
  * state/value
  * localStorage/sessionStorage/cookie behavior
  * database field/table
  * UI text
  * button/link/input
  * redirect
  * loading/error state

### MUST NOT

* Không tự suy diễn requirement.
* Không tự tạo expected behavior.
* Không đoán behavior từ tên function nếu implementation không chứng minh điều đó.
* Không coi test case là source of truth nếu test case mâu thuẫn với implementation.
* Không sửa source code.
* Không sửa test code.
* Không chạy refactor.
* Không tạo test mới.
* Không tạo screenshot.
* Không tạo report.
* Không tạo file phụ để lưu notes.
* Không tạo summary file ngoài 9 file được yêu cầu.

Nếu có thông tin không xác định được từ repository, ghi rõ:

> `Not found in repository evidence`

Không được điền bằng suy đoán.

---

# 3. Output bắt buộc

Chỉ được tạo **ĐÚNG 9 FILE** sau:

```text
analysis/
├── FR02/
│   ├── 01_requirements_and_scope.md
│   ├── 02_implementation_evidence.md
│   └── 03_testable_behavior.md
├── FR07/
│   ├── 01_requirements_and_scope.md
│   ├── 02_implementation_evidence.md
│   └── 03_testable_behavior.md
└── FR16/
    ├── 01_requirements_and_scope.md
    ├── 02_implementation_evidence.md
    └── 03_testable_behavior.md
```

Nếu các directory `analysis/FR02`, `analysis/FR07`, `analysis/FR16` chưa tồn tại, được phép tạo **3 directory này**.

**Không tạo bất kỳ file nào khác.**

Không tạo:

* summary.md
* index.md
* notes.md
* extraction.md
* report.md
* json
* csv
* txt
* temporary files
* backup files

---

# 4. File 01 — Requirements and Scope

File:

```text
analysis/FRXX/01_requirements_and_scope.md
```

Trong đó `FRXX` là `FR02`, `FR07` hoặc `FR16`.

Mục đích: xác định **chức năng này được mô tả như thế nào trong repository**.

Cấu trúc:

```markdown
# FR-XX — Requirements and Scope

## 1. Sources

| Source | Relevant information |
|---|---|
| `path/to/file` | ... |

## 2. Functional Scope

Mô tả chính xác phạm vi chức năng dựa trên evidence.

## 3. Actors / Entry Points

- ...

## 4. Inputs

| Input | Type | Source | Constraints |
|---|---|---|---|
| ... | ... | ... | ... |

## 5. Outputs / Observable Results

| Result | Evidence |
|---|---|
| ... | `path:line` |

## 6. Preconditions

- ...

## 7. Postconditions

- ...

## 8. Explicit Constraints / Rules

- ...

## 9. Unknown / Not Found

- ...
```

### Quy tắc

Nếu repository không có formal requirement cho một phần nào đó, **không được tự tạo requirement**.

Ghi:

```text
Not explicitly specified in repository evidence.
```

---

# 5. File 02 — Implementation Evidence

File:

```text
analysis/FRXX/02_implementation_evidence.md
```

Đây là file quan trọng nhất.

Mục tiêu là mô tả **SUT thực sự implement behavior như thế nào**.

Cấu trúc:

```markdown
# FR-XX — Implementation Evidence

## 1. Relevant Files

| File | Role | Relevant area |
|---|---|---|
| `path` | Backend / Frontend / Database / Config | ... |

## 2. Frontend Evidence

### 2.1 Routes / Pages

- ...

### 2.2 UI Elements

| Element | Selector / Text / Identifier | Behavior | Evidence |
|---|---|---|---|
| ... | ... | ... | `path:line` |

### 2.3 User Interaction

| Action | Preconditions | Behavior | Evidence |
|---|---|---|---|
| ... | ... | ... | `path:line` |

### 2.4 Client-side Validation / State

| Behavior | Evidence |
|---|---|
| ... | `path:line` |

## 3. Backend Evidence

### 3.1 API Endpoints

| Method | Endpoint | Input | Response | Evidence |
|---|---|---|---|---|
| ... | ... | ... | ... | `path:line` |

### 3.2 Business Logic

| Rule | Implementation | Evidence |
|---|---|---|
| ... | ... | `path:line` |

### 3.3 Error Handling

| Condition | Result | Evidence |
|---|---|---|
| ... | ... | `path:line` |

## 4. Database Evidence

| Table / Collection | Field | Meaning / Usage | Evidence |
|---|---|---|---|
| ... | ... | ... | `path:line` |

## 5. State / Persistence

| State / Data | Storage | Behavior | Evidence |
|---|---|---|---|
| ... | ... | ... | `path:line` |

## 6. Cross-layer Flow

Mô tả flow từ UI → API → backend → database → response nếu evidence cho phép xác định.

## 7. Important Implementation Details

Liệt kê những implementation detail có khả năng ảnh hưởng trực tiếp đến automation testing.

## 8. Unknown / Not Found

- ...
```

---

# 6. File 03 — Testable Behavior

File:

```text
analysis/FRXX/03_testable_behavior.md
```

Mục đích: chuyển implementation evidence thành **các observable behaviors có thể dùng để đối chiếu automation**.

Đây **không phải test case generation**.

Không tạo Playwright code.

Không tạo test script.

Không thiết kế thêm scenario ngoài những behavior có evidence.

Cấu trúc:

```markdown
# FR-XX — Testable Behavior

## 1. Entry Points

| ID | Entry point | Evidence |
|---|---|---|
| TB-XX-001 | ... | `path:line` |

## 2. Observable Behaviors

| ID | Action / Condition | Observable Result | Evidence |
|---|---|---|---|
| TB-XX-001 | ... | ... | `path:line` |
| TB-XX-002 | ... | ... | `path:line` |

## 3. Validation Behaviors

| ID | Input / Condition | Expected Observable Result | Evidence |
|---|---|---|---|
| ... | ... | ... | ... |

## 4. Error Behaviors

| ID | Error Condition | Observable Result | Evidence |
|---|---|---|---|
| ... | ... | ... | ... |

## 5. State Transitions

| ID | Initial State | Action | Resulting State | Evidence |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## 6. API-observable Behaviors

| ID | Request | Expected Response | Evidence |
|---|---|---|---|
| ... | ... | ... | ... |

## 7. Persistence Behaviors

| ID | Action | Persisted Data / State | Evidence |
|---|---|---|---|
| ... | ... | ... | ... |

## 8. Automation Review Notes

Chỉ ghi những implementation details có khả năng khiến automation test:

- pass/fail không như dự kiến;
- assert sai selector;
- assert sai text;
- assert sai state;
- assert sai API response;
- bỏ sót validation;
- bỏ sót error state;
- hoặc kiểm tra một behavior không tồn tại.

Mỗi observation phải có evidence.

## 9. Unknown / Ambiguous Behaviors

Liệt kê những behavior mà repository không cung cấp đủ evidence để kết luận.

Không được suy diễn.
```

---

# 7. Phạm vi riêng cho từng FR

## FR-02 — Login / Account Lockout

Tập trung tìm evidence về:

* Login UI
* Login route/page
* username/email input
* password input
* submit/login button
* authentication API
* credentials validation
* failed login
* successful login
* account lockout
* số lần login thất bại nếu có
* trạng thái locked nếu có
* thời gian lockout nếu có
* error message
* HTTP status
* authentication token/session
* redirect sau login
* persistence của authentication state
* logout nếu có liên quan trực tiếp đến login flow

Không được tự giả định:

* số lần thử tối đa;
* thời gian lock;
* message;
* status code;

nếu repository không chứng minh được.

---

## FR-07 — Shopping Cart

Tập trung tìm evidence về:

* Product → Add to Cart
* Cart page
* cart state
* cart context/state management
* quantity
* increase/decrease quantity
* remove item
* subtotal
* total
* product price
* stock/quantity constraints nếu có
* empty cart
* cart persistence
* login/cart relationship nếu có
* checkout transition nếu có liên quan trực tiếp
* API calls liên quan đến cart nếu tồn tại

Đặc biệt xác định:

```text
UI action
→ client state
→ API
→ backend
→ database
→ resulting UI
```

nếu repository có đầy đủ evidence.

Không tự giả định cách tính total nếu implementation không chứng minh rõ.

---

## FR-16 — Product Import CSV

Tập trung tìm evidence ở cả admin frontend và backend nếu tồn tại:

* CSV import UI
* file input
* upload/import button
* accepted file type
* CSV parsing
* required columns
* column names
* data validation
* duplicate handling
* invalid row handling
* transaction behavior
* successful import
* failed import
* partial import
* error messages
* imported product fields
* database insertion/update
* API endpoint
* HTTP method/status
* response payload
* result summary/count nếu có

Đặc biệt phải xác định chính xác:

```text
CSV input
→ frontend validation
→ upload/API request
→ backend parsing
→ validation
→ database operation
→ response
→ admin UI result
```

chỉ khi repository có evidence cho từng bước.

---

# 8. Evidence citation

Mỗi thông tin quan trọng phải có source.

Ưu tiên format:

```text
`backend/server.js:120-145`
```

hoặc:

```text
Source: `frontend-web/src/pages/Login.jsx:25-48`
```

Nếu có thể, ghi chính xác line range.

Không chỉ ghi:

```text
Source: backend/server.js
```

nếu có thể xác định vị trí cụ thể.

---

# 9. Conflict handling

Nếu các source trong repository mâu thuẫn nhau:

1. Không tự chọn một behavior mà không nói rõ.
2. Ghi nhận conflict.
3. Liệt kê từng source.
4. Mô tả sự khác biệt.
5. Đánh dấu behavior là ambiguous nếu chưa thể xác định.

Ví dụ:

```markdown
## Conflict

`api_specification.md` mô tả endpoint trả HTTP 400.

Tuy nhiên implementation trong `backend/server.js:...` trả HTTP 422.

Therefore the repository contains conflicting evidence.

- Specification: 400
- Current implementation: 422

Do not resolve this conflict by assumption.
```

---

# 10. Phân biệt specification và implementation

Khi có cả specification và source code, phải giữ hai loại evidence riêng biệt.

Ví dụ:

```markdown
### Specification Evidence

`api_specification.md:...`

Describes ...

### Current Implementation Evidence

`backend/server.js:...`

Currently implements ...
```

Không được biến specification thành implementation fact nếu source code không chứng minh.

Mục đích cuối cùng là giúp reviewer biết automation đang kiểm tra:

* specification;
* current SUT implementation;
* hay một behavior không có evidence.

---

# 11. Không chạy automation

Trong nhiệm vụ này **không cần chạy Playwright test**.

Không sửa:

```text
tests/
playwright.config.js
package.json
```

Không tạo test.

Mục tiêu hiện tại chỉ là tạo **SUT evidence baseline** để một bước khác dùng nó đối chiếu với automation output.

---

# 12. Quy trình thực hiện

Thực hiện theo thứ tự:

### Step 1 — Xác định source liên quan

Tìm các file có liên quan đến:

```text
FR-02
FR-07
FR-16
login
authentication
lockout
cart
shopping cart
product import
CSV
upload
admin product
```

Không đọc `frontend-mobile`.

### Step 2 — Trace implementation

Với mỗi FR, trace từ UI/API entry point xuống business logic và database nếu có.

### Step 3 — Extract evidence

Ghi lại:

* file;
* line;
* function/component;
* route;
* API;
* input;
* output;
* validation;
* state;
* error;
* persistence.

### Step 4 — Cross-check

Kiểm tra các layer có nhất quán không:

```text
Specification
    ↓
Frontend
    ↓
API
    ↓
Backend
    ↓
Database
```

### Step 5 — Viết 3 file cho từng FR

Tổng cộng chính xác 9 file.

### Step 6 — Final verification

Trước khi kết thúc, kiểm tra:

* Có đúng 9 file mới được tạo không?
* Có file nào ngoài 9 file trên được tạo không?
* Có đọc `frontend-mobile` không?
* Mỗi claim quan trọng có evidence không?
* Có claim nào là suy diễn không?
* Có phân biệt specification với implementation không?
* Có ghi rõ unknown/ambiguous behavior không?

Nếu phát hiện file ngoài phạm vi do chính task tạo ra, xóa file đó trước khi kết thúc.

---

# 13. Tiêu chí chất lượng

Output phải đủ chi tiết để một reviewer có thể lấy một automation test case và trả lời được:

1. Test đang kiểm tra behavior nào?
2. Behavior đó có tồn tại trong SUT không?
3. UI/API/database evidence nằm ở đâu?
4. Expected result của test có phù hợp với SUT không?
5. Selector/text/assertion có căn cứ từ implementation không?
6. Error/validation condition có thực sự tồn tại không?
7. State transition có đúng không?
8. Có behavior nào automation đang kiểm tra nhưng repository không chứng minh không?
9. Nếu test fail, failure có thể được giải thích từ SUT implementation không?

**Không cần trả lời các câu hỏi này trong một file summary riêng.**

Hãy đảm bảo 9 file được tạo ra chứa đủ evidence để reviewer có thể tự trả lời chúng.

---

# 14. Final output

Sau khi hoàn thành, chỉ báo cáo ngắn gọn:

```text
Created exactly 9 evidence files:

analysis/FR02/01_requirements_and_scope.md
analysis/FR02/02_implementation_evidence.md
analysis/FR02/03_testable_behavior.md

analysis/FR07/01_requirements_and_scope.md
analysis/FR07/02_implementation_evidence.md
analysis/FR07/03_testable_behavior.md

analysis/FR16/01_requirements_and_scope.md
analysis/FR16/02_implementation_evidence.md
analysis/FR16/03_testable_behavior.md

No other files were created.
frontend-mobile was not read.
```

Không tạo thêm file để chứa final output.

**Lưu ý:** Tôi cố ý tách `02_implementation_evidence.md` và `03_testable_behavior.md`. Khi review automation, file 02 giúp xác minh **“SUT thực sự làm gì”**, còn file 03 là lớp trung gian giúp reviewer nhanh chóng map **automation action/assertion → observable behavior → source evidence**. Điều này sẽ hữu ích hơn nếu sau này bạn đưa cả test script và Playwright report cho AI để chấm `Valid / Invalid / Incomplete`.
==Output End==

- **Verdict**: Valid
- **Reasoning**: Prompt chứa đầy đủ các phần được yêu cầu, có cấu trúc tài liệu rõ ràng để đối chiếu
- **Student fix**: Không cần thiết

## 4. Thực hiện trích thông tin để đối chiếu

<a id="log-4"></a>

- **Timestamp**: 00:35 26/08/2026
- **Tools**: Antigravity - Gemini 3.7 Flash
- **Input**: Repo Eshop SUT
- **Prompt**:

==Prompt Start==
Prompt sinh ra ở [log 3](#log-3)
==Promp End==

- **Output**

==Output Start==
Files:
FR02/01_requirements_and_scope.md
FR02/02_implementation_evidence.md
FR02/03_testable_behavior.md

FR07/01_requirements_and_scope.md
FR07/02_implementation_evidence.md
FR07/03_testable_behavior.md

FR16/01_requirements_and_scope.md
FR16/02_implementation_evidence.md
FR16/03_testable_behavior.md
==Output End==

- **Verdict**: Valid
- **Reasoning**: Trích dẫn thông tin có nguồn đối chứng, và đã tự kiểm chứng các tài liệu AI sinh ra
- **Student fix**: Không cần thiết

## 5. Sinh script Playwright
<a id="log-5"></a>
- **Timestamp**: 16:54 26/08/2026
- **Tools**: ChatGPT
- **Input**: `FR-02_TestPlan.md`, `FR-07_TestPlan.md`, `FR-16_TestPlan.md` 
- **Prompt**:

==Prompt Start==
[Nhiệm vụ]
Dựa vào Test Plan, sinh ra tất cả script test case Playwright ts trong 1 file cho từng feature

[16:54 26/08/2026]
==Promp End==

- **Output**

==Output Start==
`fr02.spec.ts`
`fr07.spec.ts`
`fr16.spec.ts`
==Output End==

- **Verdict**: Invalid
- **Reasoning**: ChatGPT sinh test case chưa đúng với data-driven test
- **Student fix**: Cần sửa lại script