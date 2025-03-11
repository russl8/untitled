import { Display } from "@/components/displays/types";
import { DisplayId } from "@/store/features/dashboard/displaySlice";

export const displays:Record<DisplayId, Display> = {
  1: {
    displayId: 1,
    displayName: "bookmarkManager",
    displayAlias: "Bookmark Manager",
  },
  2: {
    displayId: 2,
    displayName: "workoutTracker",
    displayAlias: "Workout Tracker",
  },
  3: {
    displayId: 3,
    displayName: "todos",
    displayAlias: "To-dos",
  },
  4: {
    displayId: 4,
    displayName: "calendar",
    displayAlias: "Calendar",
  },
};
