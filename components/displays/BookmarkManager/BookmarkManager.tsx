import BookmarkGrid from "./BookmarkGrid";
import { displaySize } from "../types";
import AddBookmarkModal from "./AddBookmarkForm";
import { useState } from "react";

const BookmarkManager = ({ displaySize }: { displaySize: displaySize }) => {
    const [refreshKey, setRefreshKey] = useState(0); // change key to force re-render
    const handleBookmarkAdded = () => {
        setRefreshKey(prevKey => prevKey + 1); // update key to trigger re-render
    };
    return (
        <div className="p-10 flex flex-col items-start justify-start w-full h-full overflow-visible">
            {/* <p className="">Bookmark manager</p> */}
            <AddBookmarkModal  onBookmarkAdded={handleBookmarkAdded}/>
            <BookmarkGrid
             refreshKey={refreshKey}
                displaySize={displaySize}
            />
        </div>
    );
}

export default BookmarkManager;


