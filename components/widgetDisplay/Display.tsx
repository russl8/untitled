import { DisplayId } from "@/store/features/dashboard/displaySlice";
import BookmarkManager from "../widgets/bookmarkManager/BookmarkManager";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { displaySize } from "./types";
import WorkoutTracker from "../widgets/workoutTracker/WorkoutTracker";
import { displays } from "@/lib/constants";
const DashboardDisplay = ({ displayId }: { displayId: DisplayId }) => {

    const selectedBoxes: Array<DisplayId> = useSelector((state: RootState) => state.displayReducer);

    //get the size of the current display based on num of boxes selected and order of displayID
    const displaySize: displaySize = useMemo(() => {
        if (selectedBoxes.length === 0) {
            return undefined
        } else if (selectedBoxes.length === 1) {
            return "fullsize"
        } else if (selectedBoxes.length === 2) {
            return "halfsize"
        } else if (selectedBoxes.length === 3 && displayId === selectedBoxes[0]) {
            return "halfsize"
        }
        return "quartersize"
    }, [selectedBoxes]);


    console.log("rerender")
    return (
        <div id="dashboardDisplayTitle" className="h-full w-full border-lusion-background inset-shadow-sm p-8 rounded-xl">
            <p className="text-2xl">{displays[displayId].displayAlias}</p>
            {displayId === 1 && <BookmarkManager displaySize={displaySize} />}
            {displayId === 2 && <WorkoutTracker displaySize={displaySize} />}
            {displayId > 2 && <div className="w-full h-full flex items-center justify-center">Widget coming soon!</div>}
        </div>
    );
}

export default DashboardDisplay;