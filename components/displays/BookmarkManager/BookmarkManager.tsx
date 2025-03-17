import BookmarkGrid from "./BookmarkGrid";
import { displaySize } from "../types";
import AddBookmarkModal from "./AddBookmarkForm";
import useRefresh from "@/hooks/useRefresh";

const BookmarkManager = ({ displaySize }: { displaySize: displaySize }) => {
    
    /**
     * usage:
     * 
     * when a bookmark is added in AddBookmarkModal, triggerStateRefresh is invoked
     * which causes the below refreshKey state to change.
     * 
     * Since refresh key is a prop in BookmarkGrid, it is forced to rerender on state change
     * and make it re-fetch for the latest bookmarks to show the recently updated bookmark.
     */
    const [refreshKey, triggerStateRefresh] = useRefresh()

    return (
        <div className="p-10 flex flex-col items-start justify-start w-full h-full overflow-visible">
            {/* <p className="">Bookmark manager</p> */}
            <AddBookmarkModal triggerParentStateRefresh={triggerStateRefresh} />
            <BookmarkGrid
                refreshKey={refreshKey}
                displaySize={displaySize}
            />
        </div>
    );
}

export default BookmarkManager;


