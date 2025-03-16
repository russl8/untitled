
import React, { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy
} from "@dnd-kit/sortable";

import SortableItem from "./BookmarkItem";
import { displaySize } from "../types";

const DraggableDisplay = ({ displaySize }: { displaySize: displaySize }) => {
    const [isEditing, setIsEditing] = useState<boolean>(true);

    const [items, setItems] = useState([
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
        "27",
        "28",
        "29"
    ]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    );


    // const handleDragStart = (event: any) => {
    //     setActiveId(event.active.id);
    // };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (!over) return;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id);
                const newIndex = items.indexOf(over.id);

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
                <SortableContext items={items} strategy={rectSortingStrategy}>
                    {items.slice(0, 5).map((id, index) => (
                        <SortableItem
                            imageSrc="/squareImage.jpg"
                            bookmarkName="eclass"
                            key={id}
                            id={id}
                            handle={true}
                            value={id}
                            isEditing={isEditing} />
                    )
                    )}
                </SortableContext>
            </div>
        </DndContext>
    );
};

export default DraggableDisplay