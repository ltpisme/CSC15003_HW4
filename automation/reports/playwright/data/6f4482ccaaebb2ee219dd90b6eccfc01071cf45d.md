# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr07.spec.ts >> FR-07 - Shopping Cart >> TC_FR07_21 - Breadcrumb của trang Giỏ hàng
- Location: tests/fr07.spec.ts:845:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]').first()

```

```yaml
- banner:
  - link "EShop":
    - /url: /
  - navigation:
    - link "Giỏ hàng":
      - /url: /cart
    - link "Đăng nhập":
      - /url: /login
    - link "Đăng ký":
      - /url: /register
- main:
  - heading "Giỏ hàng của bạn đang trống" [level=2]
  - link "Tiếp tục mua sắm":
    - /url: /
- contentinfo: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  754 | 
  755 |     const dialog = deleteDialog(page);
  756 | 
  757 |     await expect(dialog).toBeVisible();
  758 | 
  759 |     await dialog.getByRole('button', {
  760 |       name: /Không|Hủy|Cancel/i,
  761 |     }).click();
  762 | 
  763 |     await expect(dialog).not.toBeVisible();
  764 | 
  765 |     /*
  766 |      * Product and quantity must remain unchanged.
  767 |      */
  768 |     await expect(row).toBeVisible();
  769 | 
  770 |     expect(
  771 |       await getCartQuantity(page)
  772 |     ).toBe(quantityBefore);
  773 |   });
  774 | 
  775 |   test('TC_FR07_19 - Xóa item cuối cùng chuyển giỏ hàng sang Empty State', async ({
  776 |     page,
  777 |   }) => {
  778 |     await addProduct(page, MIN_QUANTITY);
  779 |     await openCartFromNavbar(page);
  780 | 
  781 |     await deleteProductAndConfirm(page);
  782 | 
  783 |     await expect(
  784 |       page.getByText(
  785 |         /giỏ hàng.*trống/i
  786 |       )
  787 |     ).toBeVisible();
  788 | 
  789 |     await expect(
  790 |       emptyCartState(page)
  791 |     ).toBeVisible();
  792 | 
  793 |     const productRow = productCartRow(page);
  794 | 
  795 |     await expect(productRow).not.toBeVisible();
  796 |   });
  797 | 
  798 |   /* ============================================================
  799 |    * Navbar / Breadcrumb / Feedback
  800 |    * ========================================================== */
  801 | 
  802 |   test('TC_FR07_20 - Badge số lượng trên Navbar', async ({
  803 |     page,
  804 |   }) => {
  805 |     await openHomePage(page);
  806 | 
  807 |     const cartLink = page.getByRole('link', {
  808 |       name: /Giỏ hàng/i,
  809 |     }).first();
  810 | 
  811 |     await expect(cartLink).toBeVisible();
  812 | 
  813 |     const badge = cartBadge(page);
  814 | 
  815 |     await expect(badge).toBeVisible();
  816 | 
  817 |     await addProduct(page, MIN_QUANTITY);
  818 | 
  819 |     await openHomePage(page);
  820 | 
  821 |     await expect(badge).toContainText('1');
  822 | 
  823 |     /*
  824 |      * Add the same product again with quantity 1.
  825 |      */
  826 |     await openProductPage(page);
  827 | 
  828 |     const quantityInput =
  829 |       productQuantityInput(page);
  830 | 
  831 |     await quantityInput.fill('1');
  832 | 
  833 |     await page.getByRole('button', {
  834 |       name: /Thêm vào giỏ hàng/i,
  835 |     }).click();
  836 | 
  837 |     await openHomePage(page);
  838 | 
  839 |     /*
  840 |      * The SRS requires the badge to reflect cart quantity.
  841 |      */
  842 |     await expect(badge).toContainText('2');
  843 |   });
  844 | 
  845 |   test('TC_FR07_21 - Breadcrumb của trang Giỏ hàng', async ({
  846 |     page,
  847 |   }) => {
  848 |     await openCartPage(page);
  849 | 
  850 |     const breadcrumb = page.locator(
  851 |       '[aria-label="breadcrumb"], .breadcrumb, [data-testid="breadcrumb"]'
  852 |     ).first();
  853 | 
> 854 |     await expect(breadcrumb).toBeVisible();
      |                              ^ Error: expect(locator).toBeVisible() failed
  855 | 
  856 |     await expect(
  857 |       breadcrumb
  858 |     ).toContainText(/Giỏ hàng/i);
  859 |   });
  860 | 
  861 |   test('TC_FR07_22 - Trang Giỏ hàng có đúng một h1', async ({
  862 |     page,
  863 |   }) => {
  864 |     await openCartPage(page);
  865 | 
  866 |     const h1 = page.locator('h1');
  867 | 
  868 |     await expect(h1).toHaveCount(1);
  869 | 
  870 |     await expect(h1.first()).toBeVisible();
  871 | 
  872 |     await expect(h1.first()).toContainText(
  873 |       /Giỏ hàng/i
  874 |     );
  875 |   });
  876 | 
  877 |   test('TC_FR07_23 - Có phản hồi trực quan sau khi thêm vào giỏ', async ({
  878 |     page,
  879 |   }) => {
  880 |     await openProductPage(page);
  881 | 
  882 |     const quantityInput =
  883 |       productQuantityInput(page);
  884 | 
  885 |     await quantityInput.fill(
  886 |       String(MIN_QUANTITY)
  887 |     );
  888 | 
  889 |     await page.getByRole('button', {
  890 |       name: /Thêm vào giỏ hàng/i,
  891 |     }).click();
  892 | 
  893 |     /*
  894 |      * SRS permits visual feedback such as:
  895 |      * - toast
  896 |      * - cart badge update
  897 |      * - equivalent visual feedback
  898 |      */
  899 |     const toast = page.locator(
  900 |       '[role="alert"], [data-testid="toast"], .toast'
  901 |     ).first();
  902 | 
  903 |     const badge = cartBadge(page);
  904 | 
  905 |     const hasToast =
  906 |       await toast.count() > 0 &&
  907 |       await toast.isVisible().catch(() => false);
  908 | 
  909 |     const hasBadge =
  910 |       await badge.count() > 0 &&
  911 |       await badge.isVisible().catch(() => false);
  912 | 
  913 |     expect(
  914 |       hasToast || hasBadge
  915 |     ).toBeTruthy();
  916 |   });
  917 | 
  918 |   /* ============================================================
  919 |    * GUI / Accessibility
  920 |    * ========================================================== */
  921 | 
  922 |   test('TC_FR07_24 - Giao diện FR-07 sử dụng tiếng Việt', async ({
  923 |     page,
  924 |   }) => {
  925 |     await addProduct(page, MIN_QUANTITY);
  926 |     await openCartFromNavbar(page);
  927 | 
  928 |     const requiredTexts = [
  929 |       'Giỏ hàng',
  930 |       'Sản phẩm',
  931 |       'Đơn giá',
  932 |       'Số lượng',
  933 |       'Thành tiền',
  934 |       'Thao tác',
  935 |       'Tổng cộng',
  936 |     ];
  937 | 
  938 |     for (const text of requiredTexts) {
  939 |       await expect(
  940 |         page.getByText(
  941 |           text,
  942 |           { exact: true }
  943 |         )
  944 |       ).toBeVisible();
  945 |     }
  946 |   });
  947 | 
  948 |   test('TC_FR07_25 - Kiểm tra màu nút hành động và nút nguy hiểm', async ({
  949 |     page,
  950 |   }) => {
  951 |     await addProduct(page, MIN_QUANTITY);
  952 |     await openCartFromNavbar(page);
  953 | 
  954 |     const row = productCartRow(page);
```