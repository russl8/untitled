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
import { Button } from "../ui/button";
import { useState } from "react";
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
                        bg-transparent hover:bg-transparent opacity-60 hover:opacity-80`,
                        {
                            "opacity-100": displayState.includes(displayId)
                        }
                    )}
            >
                {display.displayAlias}
            </Button>


        </div>
    );
}

export default SidebarCheckbox;