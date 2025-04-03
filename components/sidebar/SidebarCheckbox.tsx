'use client'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toggleDisplay } from "@/store/features/dashboard/displaySlice";
import { Display } from "../widgetDisplay/types";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";


const SidebarCheckbox = ({ display }: { display: Display }) => {
    const displayState = useSelector((state: RootState) => state.displayReducer)
    const dispatch = useDispatch()
    const pathname = usePathname()

    const displayId = display.displayId
    const pathnameIsDashboard = pathname === "/"
    const handleCheckedChange = () => {
        dispatch(toggleDisplay(displayId))
    };
    return (
        <div
            className="flex items-center my-0.5">

            <Button
                variant="ghost"
                disabled={!pathnameIsDashboard}
                onClick={handleCheckedChange}
                id={"" + displayId}
                className={
                    cn(
                        `ml-2 text-xs leading-none cursor-pointer 
                        peer-disabled:cursor-not-allowed peer-disabled:opacity-50
                        bg-transparent hover:bg-transparent opacity-60 hover:opacity-100`,
                        {
                            "opacity-100 font-semibold": displayState.includes(displayId)
                        }
                    )}
            >
                {display.displayAlias}
            </Button>


        </div>
    );
}

export default SidebarCheckbox;