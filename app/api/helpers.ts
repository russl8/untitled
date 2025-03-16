import { currentUser } from "@clerk/nextjs/server";

export async function getCurrentUserOrGuestID(): Promise<string | "guest"> {
    /**
     * Set the id to "guest" if the user is not signed in.
     */
    const user = await currentUser();
    if (!user) {
      return "guest";
    }
    return user.id;
  }