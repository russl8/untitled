import { useState, useEffect, useMemo } from "react";
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

import SortableItem from "./BookmarkItem";
import { displaySize } from "../types";

const BookmarkGrid = ({ displaySize, refreshKey }: { displaySize: displaySize, refreshKey: number }) => {

    const [isEditing, setIsEditing] = useState<boolean>(true);
    const [items, setItems] = useState<Array<Bookmark>>([]);
    const sliceAmount = useMemo(() => {
        console.log("display size change")
        if (displaySize === "fullsize") {
            return 50
        } else if (displaySize === "halfsize") {
            return 15
        } else {
            return 5
        }
    }, [displaySize])
    useEffect(() => {
        fetch("/api/dashboard/bookmarkManager")
            .then(res => res.json())
            .then(json => { setItems(json.bookmarks) })
            .catch(err => console.error(err))
    }, [refreshKey])

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

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-wrap flex-row h-full items-center justify-center w-full overflow-ellipsis"
            >
                {items.length > 0 &&
                    <SortableContext
                        items={items.map(item => item._id)}
                        strategy={rectSortingStrategy}>
                        {items.slice(0, sliceAmount).map((item, index) => (
                            <SortableItem
                                bookmarkLink={item.bookmarkLink}
                                imageSrc={item.bookmarkImage}
                                bookmarkName={item.bookmarkName}
                                key={item._id}
                                id={item._id}
                                value={item._id}
                                isEditing={true} />
                        )
                        )}
                    </SortableContext>}
            </div>
        </DndContext>
    );
};

export default BookmarkGrid