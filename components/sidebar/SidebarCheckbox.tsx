'use client'
import { Checkbox } from "../ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DisplayId } from "@/store/features/dashboard/displaySlice";
import { toggleDisplay } from "@/store/features/dashboard/displaySlice";
interface SidebarCheckboxProps {
    displayName: string;
    displayId: DisplayId
}

const SidebarCheckbox = ({ displayName, displayId }: SidebarCheckboxProps) => {
    const displayState = useSelector((state: RootState) => state.displayReducer)
    const dispatch = useDispatch()

    return (
        <div
            className="flex items-center my-0.5 px-2 ">
            <Checkbox
                id={`${displayName}${displayId}`}
                checked={displayState[displayId]}
                onCheckedChange={(checked) => {
                    console.log("hi " + displayId)
                    dispatch(toggleDisplay(displayId))
                }}
            />
            <label
                htmlFor={`${displayName}${displayId}`}
                className=" ml-2 text-xs leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                Box {displayId}
            </label>


        </div>
    );
}

export default SidebarCheckbox;