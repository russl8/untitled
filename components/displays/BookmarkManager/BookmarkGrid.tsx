import { useState, useEffect, useMemo, Suspense, SetStateAction } from "react";
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
import { Button } from "@/components/ui/button";

interface BookmarkGridProps {
    displaySize: displaySize;
    setItems: (value: SetStateAction<Bookmark[]>) => void;
    items: Array<Bookmark>;
}


const BookmarkGrid = ({ displaySize, setItems, items }: BookmarkGridProps) => {

    const [isEditing, setIsEditing] = useState<boolean>(false);


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

    return (
        <Suspense fallback={<p>Loading feed...</p>}>
            <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "destructive" : "default"}
            >Edit Bookmarks</Button>
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
                                    isEditing={isEditing} />
                            )
                            )}
                        </SortableContext>}
                </div>
            </DndContext>

        </Suspense>
    );
};

export default BookmarkGrid