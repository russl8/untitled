import BookmarkGrid from "./BookmarkGrid";
import { displaySize } from "../types";
import AddBookmarkModal from "./AddBookmarkForm";
import useRefresh from "@/hooks/useRefresh";
import { useEffect, useState } from "react";
import DisplayLoading from "../DisplayLoading";

const BookmarkManager = ({ displaySize }: { displaySize: displaySize }) => {

    /**
     * usage:
     * 
     * when a bookmark is added in AddBookmarkModal, triggerStateRefresh is invoked
     * which causes the below refreshKey state to change in this component to force useEffect to run again.
     */
    const [refreshKey, triggerStateRefresh] = useRefresh()
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Array<Bookmark>>([]);

    useEffect(() => {
        fetch("/api/dashboard/bookmarkManager")
            .then(res => res.json())
            .then(json => setItems(json.bookmarks))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [refreshKey])
    if (loading) return <DisplayLoading />; 

    return (
        <div className="p-10 flex flex-col items-start justify-start w-full h-full overflow-visible">
            {/* <p className="">Bookmark manager</p> */}
            <AddBookmarkModal triggerParentStateRefresh={triggerStateRefresh} />
            <BookmarkGrid
                items={items}
                setItems={setItems}
                displaySize={displaySize}
            />
        </div>
    );
}

export default BookmarkManager;


