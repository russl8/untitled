import { DisplayId } from "@/store/features/dashboard/displaySlice";
import { displays } from "@/lib/constants";

const DashboardDisplay = ({displayId}: {displayId:DisplayId}) => {
    const display = displays[displayId];
    return (
        <div className="h-full w-full from-red-500 to-blue-500 bg-gradient-to-l">
            {display.displayAlias}
        </div>
    );
}

export default DashboardDisplay;