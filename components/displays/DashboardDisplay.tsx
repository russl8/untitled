import { DisplayId } from "@/store/features/dashboard/displaySlice";
import { displays } from "@/lib/constants";
import BookmarkManager from "./BookmarkManager/BookmarkManager";

const DashboardDisplay = ({displayId}: {displayId:DisplayId}) => {
    const display = displays[displayId];
    return (
        <div id="dashboardDisplayTitle" className="h-full w-full border-2 border-black">
            {displayId===1 && <BookmarkManager/>}
        </div>
    );
}

export default DashboardDisplay;