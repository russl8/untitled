import { test, expect, Page } from "@playwright/test";

test.describe("Adding a workout adds a workout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:3000/");
  });

  test("Adding a workout should increase the number of workouts by one", async ({
    page,
  }) => {
    await page.waitForTimeout(2000)

    const initialNumberOfWorkouts = await page.locator(".workoutCard").count();

    //should see the addWorkout button
    const addWorkoutButton = await page.getByRole("button",{name: "add"})
    await expect(addWorkoutButton ).toBeVisible()

    await addWorkoutButton.click();

    // should be in the addWorkout modal
    const addCustomWorkoutLink= await page.locator("id=customWorkoutOption")
    await expect(addCustomWorkoutLink).toBeVisible()

    //click the "here" link to add a custom workout
    await addCustomWorkoutLink.click()

    const workoutNameInput = await page.getByPlaceholder("Enter a workout name")
    await expect(workoutNameInput).toBeVisible()  

    //fill workout name textbox
    await workoutNameInput.fill("test_workout")

    // add exercise
    const addExerciseButton = await page.locator("id=addExerciseButton")
    await expect(addExerciseButton).toBeVisible()
    await addExerciseButton.click()

    const exerciseBox = await page.locator("[name='exercises.0.exerciseName']")
    const setsBox = await page.locator("[name='exercises.0.sets']")
    const repsBox = await page.locator("[name='exercises.0.reps']")
    const weightBox = await page.locator("[name='exercises.0.weight']")

    await expect(exerciseBox).toBeVisible()
    await expect(setsBox).toBeVisible()
    await expect(repsBox).toBeVisible()
    await expect(weightBox).toBeVisible()

    await exerciseBox.fill("test_workout")
    await setsBox.fill("1")
    await repsBox.fill("20")
    

    await page.getByRole("button",{name:"Submit"}).click()

    await page.reload()
    await page.waitForTimeout(2000)

    const newNumberOfWorkouts = await page.locator(".workoutCard").count();

    await expect(newNumberOfWorkouts).toEqual(initialNumberOfWorkouts+1)  });
});
