'use client'
import { Checkbox } from "../ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DisplayId } from "@/store/features/dashboard/displaySlice";
import { toggleDisplay } from "@/store/features/dashboard/displaySlice";
import { Display } from "../widgetDisplay/types";
import { usePathname } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";
import { EyeCheckbox } from "../ui/eyeCheckbox";


const SidebarCheckbox = ({ display }: { display: Display }) => {
    const displayState = useSelector((state: RootState) => state.displayReducer)
    const dispatch = useDispatch()
    const pathname = usePathname()

    const displayId = display.displayId
    const pathnameIsDashboard = pathname === "/"
    const handleCheckedChange = (checked: boolean) => {
        dispatch(toggleDisplay(displayId))
    };
    return (
        <div
            className="flex items-center my-0.5 px-2 ">
            <EyeCheckbox
                disabled={!pathnameIsDashboard}
                id={"" + displayId}
                checked={displayState.includes(displayId)}
                onCheckedChange={handleCheckedChange}
                className="cursor-pointer"
            />

            <label
                htmlFor={"" + displayId}
                className=" 
                    ml-2 text-xs leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70
                    
                "
            >
                {display.displayAlias}
            </label>


        </div>
    );
}

export default SidebarCheckbox;