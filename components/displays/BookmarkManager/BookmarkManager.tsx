import Image from "next/image";
import { Reorder } from "framer-motion"
import { useEffect, useState } from "react";
import DraggableDisplay from "./DraggableDisplay";
import { displaySize } from "../types";
import AddBookmarkModal from "./AddBookmarkForm";
import { useUser } from "@clerk/nextjs";

const BookmarkManager = ({ displaySize }: { displaySize: displaySize }) => {
    let { isSignedIn, user, isLoaded } = useUser()
    if (!user) {
        user="guest"
    }
    return (
        <div className="p-10 flex flex-col items-start justify-start w-full h-full overflow-visible">
            {/* <p className="">Bookmark manager</p> */}
            
            <AddBookmarkModal />
            <DraggableDisplay
                displaySize={displaySize}
            />
        </div>
    );
}

export default BookmarkManager;


