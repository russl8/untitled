import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUserOrGuestID() {
  /**
   * Set the id to "guest" if the user is not signed in.
   */
  try {
    const user = await currentUser();
    if (!user) {
      return "guest";
    }
    return user.id;
  } catch (e) {
    throw new Error("Error getting user: " + e);
  }
}
