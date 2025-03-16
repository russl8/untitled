import Image from "next/image";
import { Reorder } from "framer-motion"
import React, { useEffect, useState } from "react";
import BookmarkGrid from "./BookmarkGrid";
import { displaySize } from "../types";
import AddBookmarkModal from "./AddBookmarkForm";
import { useUser } from "@clerk/nextjs";

const BookmarkManager = ({ displaySize }: { displaySize: displaySize }) => {

    useEffect(()=>{
        fetch("/api/dashboard/bookmarkManager")
        .then(res=>res.json())
        .then(json=>console.log(json))
        .catch(err=>console.error(err))
    })
    return (
        <div className="p-10 flex flex-col items-start justify-start w-full h-full overflow-visible">
            {/* <p className="">Bookmark manager</p> */}
            <AddBookmarkModal />
            <BookmarkGrid
                displaySize={displaySize}
            />
        </div>
    );
}

export default BookmarkManager;


