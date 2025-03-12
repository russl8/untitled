import {test,expect} from "@playwright/test"
import { createPrerenderSearchParamsForClientPage } from "next/dist/server/request/search-params"


test.describe("dashboard",()=>{
    test.beforeEach(async ({page})=> {
        await page.goto("http://localhost:3000/")
    }) 
    test("should see dashboard control checkboxes as navbar should be open by default (todo: disable checkboxes when not on /)", async({page})=>{
        await expect(page.getByText('Bookmark Manager')).toBeVisible();
        await expect(page.getByText('Workout Tracker')).toBeVisible();
        await expect(page.getByText('To-dos')).toBeVisible();
        await expect(page.getByText('Calendar')).toBeVisible();
    })

    test("clicking checkbox button should bring it up to/off of display", async({page})=>{
        // get count of displays up currently
        const initialNumberOfDisplays = await page.locator("id=dashboardDisplayTitle").count()

        // get whether the bookmark manager box is checked
        const bookmarkManagerCheckboxIsChecked = await page.getByRole("checkbox",{name:"Bookmark Manager"}).isChecked()

        // if the bookmark manager is already checked, uncheck it and # of displays should decrease by 1
        if (bookmarkManagerCheckboxIsChecked) {
            await page.getByRole("checkbox",{name:"Bookmark Manager"}).uncheck()
            const newNumberOfDisplays = await page.locator("id=dashboardDisplayTitle").count()
            await expect(newNumberOfDisplays).toEqual(initialNumberOfDisplays-1)
        } else {
            await page.getByRole("checkbox",{name:"Bookmark Manager"}).check()
            const newNumberOfDisplays = await page.locator("id=dashboardDisplayTitle").count()
            await expect(newNumberOfDisplays).toEqual(initialNumberOfDisplays+1)
        }
    })
})