import { useState, useEffect, useMemo, Suspense, SetStateAction, useContext } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from "@dnd-kit/sortable";

import { Edit } from "lucide-react";
import SortableItem from "./BookmarkItem";
import { displaySize } from "../../widgetDisplay/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AddBookmarkModal from "./AddBookmarkForm";
import toast from "react-hot-toast";
import { error } from "console";
import { changeBookmarkOrder } from "@/actions/bookmarkManager/changeBookmarkOrder";
import { FetchBookmarksContext } from "./BookmarkManager";

interface BookmarkGridProps {
    displaySize: displaySize;
    setItems: (value: SetStateAction<Bookmark[]>) => void;
    items: Array<Bookmark>;
}


const BookmarkGrid = ({ displaySize, setItems, items }: BookmarkGridProps) => {

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const fetchBookmarks: () => void = useContext(FetchBookmarksContext)

    const sliceAmount = useMemo(() => {
        if (displaySize === "fullsize") {
            return 50
        } else if (displaySize === "halfsize") {
            return 15
        } else {
            return 5
        }
    }, [displaySize])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex(item => item._id === active.id);
                const newIndex = items.findIndex(item => item._id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    /**
     * When user toggles isEditing from ON->OFF.
     * 
     * This should save the order of the user's bookmarks in the server.
     */
    const handleEditingEnd = async () => {
        setIsEditing(false);

        const res = await changeBookmarkOrder(items)
        if (res.status === "success") {
            toast.success("Edits saved successfully!");

        } else {
            toast.error(res.message || "Error with updating items") 
        }
        fetchBookmarks();

    }
    return (
        <>
            <div className="flex flex-row">
                <AddBookmarkModal />
                <Button
                    id="editBookmarksButton"
                    onClick={() => {
                        if (!isEditing) {
                            setIsEditing(true)
                        } else {
                            handleEditingEnd()
                        }
                    }}
                    className={cn("cursor-pointer ml-1 w-6 h-6 ", { "animate-pulse": isEditing })}>
                    <Edit />
                </Button>
            </div>
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-wrap flex-row h-full items-start w-full p-4"
                >
                    
                    {items.length > 0 &&
                        <SortableContext
                            items={items.map(item => item._id)}
                            strategy={rectSortingStrategy}>
                            {items.slice(0, sliceAmount).map((item, index) => (
                                <SortableItem
                                    key={item._id}
                                    bookmarkLink={item.bookmarkLink}
                                    imageSrc={item.bookmarkImage}
                                    bookmarkName={item.bookmarkName}
                                    id={item._id}
                                    value={item._id}
                                    isEditing={isEditing} />
                            )
                            )}
                        </SortableContext>}
                </div>
            </DndContext>

        </>
    );
};

export default BookmarkGrid