# HW04 – Automation Testing (EShop SUT)

> Sinh viên: Lê Thanh Phong
> MSSV: 23127452

---

## 1. Bảng Tự Đánh Giá

|       STT       | Tiêu Chí Đánh Giá                                                        | Điểm Tối Đa | Điểm Tự Đánh Giá |
| :-------------: | ----------------------------------------------------------------------------- | :-------------: | :--------------------: |
|        1        | **Task 1 – Feature A (FR-02: Login and Account Lockout)** 17 test      |       25       |           25           |
|        2        | **Task 1 – Feature B (FR-07: Shopping Cart)** 26 test cases,           |       25       |           25           |
|        3        | **Task 1 – Feature C (FR-16: Import Products from CSV)** 20 test cases |       25       |           25           |
|        4        | **Task 2 – Demo Video**                                                |       15       |           15           |
|        5        | **Agent Skills**                                                        |       10       |           10           |
| **Tổng** | **Tổng Điểm Đánh Giá**                                            |  **100**  |     **100**     |

---

## 2. Báo Cáo Tóm Tắt Kiểm Thử (Test Summary Report)

* **Số lượng tính năng (Features)**: 3 (`FR-02` - Pool A, `FR-07` - Pool B, `FR-16` - Pool C).
* **Số lượng kịch bản kiểm thử (Test Cases)**: 63 test cases (FR-02: 17, FR-07: 26, FR-16: 20).
* **Số lượng trình duyệt thực thi (Browsers)**: 3 trình duyệt (Chromium, Firefox, WebKit).
* **Tổng số lượt chạy trình duyệt (Browser Runs)**: 9 runs (189 test executions).
* **Kết quả thực thi toàn bộ Suite**:
  * **Passed**: 52 executions (27.51%).
  * **Failed**: 134 executions (70.90% — phản ánh chính xác các lỗi thực tế trên hệ thống SUT).
  * **Skipped**: 3 executions (1.59% — `TC_FR16_02` do thiếu cấu hình biến môi trường non-admin).
* **Số lượng lỗi phát hiện trên SUT (Bugs)**: 11 lỗi (FR-02: 1 bug, FR-07: 6 bugs, FR-16: 4 bugs).
* **Định danh báo cáo HTML**: `Run by: 23127452` | Timestamp: `2026-08-26T17:43:04.435Z`.

---

## 3. Tóm Tắt Thống Kê AI Audit (AI Audit Summary)

* **Tổng số phiên tương tác AI**: 5 phiên ghi nhận.
* **Tỷ lệ phân loại nhãn**:
  * `Valid`: 3 phiên (60.0%) — trích xuất yêu cầu, viết prompt và phân tích source code SUT.
  * `Invalid`: 1 phiên (20.0%) — mã Playwright ban đầu do AI sinh bị lỗi selector và giả định sai kiến trúc.
  * `Incomplete`: 1 phiên (20.0%) — thiết kế test case ban đầu còn thiếu test data chi tiết.

---

## 4. Hướng Dẫn Chạy Kiểm Thử (How to Run)

Toàn bộ test suite được chạy từ thư mục `automation/`:

```bash
# 1. Cài đặt các gói phụ thuộc
cd automation
npm install

# 2. Cài đặt các trình duyệt Playwright
npx playwright install

# 3. Chạy kiểm thử tự động với định danh sinh viên
STUDENT_ID=23127452 npx playwright test

# 4. Mở xem báo cáo HTML
npx playwright show-report reports/playwright
```

---

## 5. Tổng Quan Agent Skill: `browser-data-driven-testing`

**Video Demo Agent Skill**: [Video Demo](https://youtu.be/1V7XGN6TJw8)

Skill định nghĩa quy trình chuẩn hóa để thiết kế, sinh mã và thực thi kiểm thử tự động trên trình duyệt theo phương pháp **Data-Driven Testing (DDT)** sử dụng **Playwright**.

* **Mục đích**: Tự động hóa kiểm thử trình duyệt End-to-End (E2E), tách biệt hoàn toàn giữa dữ liệu kiểm thử và logic kịch bản, đảm bảo tính bền vững (resilient locators, web-first assertions) và khả năng truy vết yêu cầu (traceability).
* **Input chính**:
  * Mã nguồn và cấu trúc DOM của hệ thống cần kiểm thử (SUT - System Under Test).
  * Tài liệu đặc tả yêu cầu, API và tiêu chí chấp nhận (acceptance criteria).
  * Cấu hình dự án (`playwright.config.ts`, `package.json`).
  * Tập dữ liệu kiểm thử phân cấp hoặc bảng ma trận (JSON/CSV).
* **Output chính**:
  * Bộ dữ liệu kiểm thử tham số hóa (`.json` / `.csv`).
  * Kịch bản kiểm thử Playwright tự động hóa bằng TypeScript (`.ts` / `.spec.ts`) tích hợp Page/Action Helpers.
  * Báo cáo thực thi kiểm thử và phân tích nguyên nhân lỗi SUT (`test-report.md`).
* **Quy trình thực thi (6 pha tuần tự)**:
  1. **Discover**: Khảo sát cấu hình dự án, dependencies, đặc tả tính năng và mã nguồn frontend SUT để xác thực DOM thực tế.
  2. **Analyze**: Phân tích các kịch bản kiểm thử (happy path, negative, boundary, edge cases), xác định biến thiên dữ liệu và ánh xạ locator bền vững (`getByRole`, `getByLabel`, `getByTestId`).
  3. **Design**: Thiết kế mô hình dữ liệu kiểm thử độc lập và cấu trúc test suite đảm bảo truy vết mã yêu cầu (requirement traceability).
  4. **Generate**: Sinh dữ liệu test và mã kiểm thử Playwright với web-first assertions (tự động retry), nạp dataset động thay vì hardcode.
  5. **Review**: Rà soát tuân thủ quy tắc chất lượng (loại bỏ sleep cứng `waitForTimeout`, đảm bảo đồng bộ trạng thái rõ ràng, kiểm tra truy vết yêu cầu).
  6. **Output & Report**: Thực thi test suite bằng test runner và tổng hợp báo cáo kết quả kèm ma trận truy vết và phân tích lỗi.
