import { test, expect } from "@playwright/test";

test.describe("bookmark manager", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("checkbox", { name: "Bookmark Manager" }).check();
    await page.waitForTimeout(3000);
  });
  test("Adding a bookmark should increase the number of bookmarks by one", async ({
    page,
  }) => {
    //get the number of bookmarkitems
    const initialNumberOfBookmarks = await page
      .locator("id=bookmarkItem")
      .count();

    await page.locator("#addBookmarkModalTrigger").click();

    await page.locator("#addBookmarkNameInput").fill("test_id");
    await page.locator("#addBookmarkLinkInput").fill("https://playwright.dev");

    const filePath = "public/sampleIcon.png";
    try {
      await page.getByPlaceholder("addBookmarkImage").setInputFiles(filePath);
    } catch (error) {
      console.error("Error setting input files:", error);
    }
    await page.getByRole("button", { name: "Submit" }).click();
    await page.waitForTimeout(10000);

    const newNumberOfBookMarks = await page.locator("id=bookmarkItem").count();

    await expect(newNumberOfBookMarks).toEqual(initialNumberOfBookmarks + 1);
  });
});
