//                                      // axe-test.ts
// import { test as base, expect } from '@playwright/test';
// import { injectAxe, checkA11y } from 'axe-playwright';
//
// // Extend the base test
// const test = base.extend({});
//
// // Inject Axe before each test
// test.beforeEach(async ({ page }) => {
//   await injectAxe(page);
// });
//
// // Perform accessibility checks after each test
// test.afterEach(async ({ page }) => {
//   // Ensure no try-catch block suppresses errors
//     await page.waitForSelector('img[src="https://picsum.photos/200/300"]', { state: 'visible' });
//   await checkA11y(page);
// });
//
//
//
// export { test, expect };
