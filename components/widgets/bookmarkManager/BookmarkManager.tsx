import BookmarkGrid from "./BookmarkGrid";
import { displaySize } from "../../widgetDisplay/types";
import AddBookmarkModal from "./AddBookmarkForm";
import { useCallback, useEffect, useState } from "react";
import DisplayLoading from "../../widgetDisplay/DisplayLoading";
import { createContext } from "react";


export const FetchBookmarksContext = createContext<(() => void)>(() => { });

const BookmarkManager = ({ displaySize }: { displaySize: displaySize }) => {

    /**
     * usage:
     * 
     * when a bookmark is added in AddBookmarkModal, triggerStateRefresh is invoked
     * which causes the below refreshKey state to change in this component to force useEffect to run again.
     */
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState<Array<Bookmark>>([]);
    const fetchBookmarks = useCallback(() => {
        fetch("/api/dashboard/bookmarkManager")
            .then(res => res.json())
            .then(json => {
                setItems(json.bookmarks || [])
            })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [])
    useEffect(() => {
        fetchBookmarks();
    }, [])

    if (loading) return <DisplayLoading />;

    return (
        <div className="p-2 flex flex-col items-start justify-start w-full h-full overflow-visible">

            <FetchBookmarksContext.Provider value={fetchBookmarks}>
                {/* <p className="">Bookmark manager</p> */}
                <BookmarkGrid
                    // triggerParentStateRefresh={triggerStateRefresh}
                    items={items}
                    setItems={setItems}
                    displaySize={displaySize}
                />
            </FetchBookmarksContext.Provider>
        </div>
    );
}

export default BookmarkManager;


