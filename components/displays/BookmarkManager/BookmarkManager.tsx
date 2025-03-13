import Image from "next/image";
import { Reorder } from "framer-motion"
import { useState } from "react";
import DraggableDisplay from "./DraggableDisplay";
import { displaySize } from "../types";

const BookmarkManager = ({ displaySize }: { displaySize: displaySize }) => {
    return (
        <div className="p-10 flex flex-col items-start justify-start w-full h-full overflow-visible">
            {/* <p className="">Bookmark manager</p> */}
            <DraggableDisplay displaySize={displaySize} />
        </div>
    );
}

export default BookmarkManager;


