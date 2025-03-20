import { DisplayId } from "@/store/features/dashboard/displaySlice";
import { displays } from "@/lib/constants";
import BookmarkManager from "./BookmarkManager/BookmarkManager";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { displaySize } from "./types";

const DashboardDisplay = ({ displayId }: { displayId: DisplayId }) => {


    // const display = displays[displayId];
    const selectedBoxes = useSelector((state: RootState) => state.displayReducer);

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

    

    return (
        <div id="dashboardDisplayTitle"
            className="h-full w-full bg-[#D3D3D3] border-2 rounded-xl"
        >
            {displayId === 1 && <BookmarkManager displaySize={displaySize}/>}
        </div>
    );
}

export default DashboardDisplay;