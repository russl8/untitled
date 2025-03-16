
import { useState, useEffect } from "react";
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

const BookmarkGrid = ({ displaySize }: { displaySize: displaySize }) => {

    const [isEditing, setIsEditing] = useState<boolean>(true);
    const [items, setItems] = useState<Array<Bookmark>>([]);
    useEffect(() => {
        fetch("/api/dashboard/bookmarkManager")
            .then(res => res.json())
            .then(json =>{ console.log(json.bookmarks);setItems(json.bookmarks)})
            .catch(err => console.error(err))

    }, [])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );


    // const handleDragStart = (event: any) => {
    //     setActiveId(event.active.id);
    // };

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
        // onDragStart={handleDragStart}
        >
            <div className="flex flex-wrap flex-row h-full items-center justify-center w-full overflow-ellipsis"
            >
                {items.length > 0 &&
                    <SortableContext items={items.map(item => item._id)} strategy={rectSortingStrategy}>
                        {items.map((item, index) => (
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