import { test, expect, Page } from "@playwright/test";

test.describe("Adding bookmark", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("checkbox", { name: "Bookmark Manager" }).check();
    await page.waitForTimeout(3000);
  });
  test("Adding a bookmark should increase the number of bookmarks by one", async ({
    page,
  }) => {
    //get the number of bookmarkitems
    const initialNumberOfBookmarks = (await page.locator(".bookmarkItem").all())
      .length;
    await insertBookmark(page);
    const newNumberOfBookMarks = (await page.locator(".bookmarkItem").all())
      .length;
    await expect(newNumberOfBookMarks).toEqual(initialNumberOfBookmarks + 1);
  });
});



test.describe("Removing bookmark", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
    await page.getByRole("checkbox", { name: "Bookmark Manager" }).check();
    await page.waitForTimeout(3000);
  });
  test("Deleting a bookmark should decrease the number of bookmarks by one", async ({
    page,
  }) => {
    let initialNumberOfBookmarks = await page.locator(".bookmarkItem").count();
    console.log("Initial bookmarks:", initialNumberOfBookmarks);

    // If no bookmarks exist, add one first
    if (initialNumberOfBookmarks === 0) {
      await insertBookmark(page);
      initialNumberOfBookmarks += 1;
      await expect(page.locator(".bookmarkItem")).toHaveCount(
        initialNumberOfBookmarks,
        { timeout: 15000 }
      );
    }

    await deleteBookmark(page);

    await expect(page.locator(".bookmarkItem")).toHaveCount(
      initialNumberOfBookmarks - 1,
      { timeout: 15000 }
    );

    console.log("Bookmark deleted successfully!");
  });
});

async function deleteBookmark(page: Page) {
  await page.locator("#editBookmarksButton").click();
  await page
    .locator('[data-testid="deleteBookmarkButton"]')
    .first()
    .dispatchEvent("pointerdown");
  await page.waitForSelector(".bookmarkItem", {
    timeout: 10000,
  });
}

async function insertBookmark(page: Page) {
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
  await page.waitForSelector(".bookmarkItem", { timeout: 10000 });
  await page.keyboard.press("Escape");
}
