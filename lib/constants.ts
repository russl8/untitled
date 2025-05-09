import { Display } from "@/components/widgetDisplay/types";
import { DisplayId } from "@/store/features/dashboard/displaySlice";

export const displays:Record<DisplayId, Display> = {
  1: {
    displayId: 1,
    displayName: "bookmarkManager",
    displayAlias: "Bookmarks",
  },
  2: {
    displayId: 2,
    displayName: "workoutTracker",
    displayAlias: "Workouts",
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
