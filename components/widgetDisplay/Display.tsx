import { DisplayId } from "@/store/features/dashboard/displaySlice";
import BookmarkManager from "../widgets/bookmarkManager/BookmarkManager";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { displaySize } from "./types";
import WorkoutTracker from "../workoutTracker/dashboard/Dashboard";
import { displays } from "@/lib/constants";
const DashboardDisplay = ({ displayId }: { displayId: DisplayId }) => {

    console.log("rerender")
    return (
        <div id="dashboardDisplayTitle" className="h-full w-full  border-lusion-background inset-shadow-sm p-8 rounded-xl">
        </div>
    );
}

export default DashboardDisplay;