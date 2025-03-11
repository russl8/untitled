'use client'
import { Checkbox } from "../ui/checkbox";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { DisplayId } from "@/store/features/dashboard/displaySlice";
import { toggleDisplay } from "@/store/features/dashboard/displaySlice";
import { Display } from "../displays/types";



const SidebarCheckbox = ({display}: {display:Display}) => {
    const displayState = useSelector((state: RootState) => state.displayReducer)
    const dispatch = useDispatch()

    const displayId=display.displayId

    const handleCheckedChange = (checked: boolean) => {
        dispatch(toggleDisplay(displayId))
    };
    return (
        <div
            className="flex items-center my-0.5 px-2 ">
            <Checkbox
                id={""+displayId}
                checked={displayState.includes(displayId)}
                onCheckedChange={handleCheckedChange}

            />
            <label
                htmlFor={""+displayId}
                className=" ml-2 text-xs leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {display.displayAlias}
            </label>


        </div>
    );
}

export default SidebarCheckbox;