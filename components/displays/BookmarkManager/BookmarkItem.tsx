import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { redirect } from "next/dist/server/api-utils";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { deleteBookmark } from "@/actions/dashboard/bookmarkActions";
interface BookmarkItemProps {
  id: any;
  isEditing: boolean;
  value: string;
  imageSrc: string;
  bookmarkName: string;
  bookmarkLink: string;
}
const BookmarkItem = ({ id, isEditing, imageSrc, bookmarkName, bookmarkLink }: BookmarkItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.3 : 1
  };

  const handleDeleteBookmark = async () => {
    const response = await deleteBookmark(id);
    alert("todo: delete item " + id)
  }

  const [a, l] = isEditing ? [attributes, listeners] : [null, null]

  return (
    <div
      onClick={(e) => {
        if (!isEditing) {
          e.stopPropagation(); // Prevent dnd-kit interference
          window.open(bookmarkLink, "_blank", "noopener,noreferrer");
        }
      }}
      className={cn("flex flex-col justify-center h-20 w-14 mx-2  cursor-pointer", {
        "cursor-grab active:cursor-grabbing ": isEditing
      })}

      ref={isEditing ? setNodeRef : null}
      style={style}
      {...a}
      {...l}
    >
      <div className={cn("", { "animate-pulse": isEditing })}>
        {/* Delete button */}
        {isEditing &&
          <div className="w-full relative">
            <X
              className="absolute w-5 h-5 p-1 right-0 bg-gray-900 text-white cursor-pointer rounded-full hover:bg-gray-400"
              onPointerDown={(e) => {
                e.stopPropagation();
                handleDeleteBookmark();
              }}
            />
          </div>}
        <div className="object-cover overflow-hidden h-14 w-14 rounded-sm  ">
          <Image
            draggable={false}
            alt="image"
            src={imageSrc}
            width={4000}
            height={4000} />
        </div>
        <p className=" text-center text-sm">{bookmarkName}</p>
      </div>
    </div>
  );
};

export default BookmarkItem;

