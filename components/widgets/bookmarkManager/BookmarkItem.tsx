import React, { useContext, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { redirect } from "next/dist/server/api-utils";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { deleteBookmark } from "@/actions/bookmarkManager/deleteBookmark";
import toast from "react-hot-toast";
import { FetchBookmarksContext } from "./BookmarkManager";
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
  const [isDeleting, setIsDeleting] = useState(false);
  const fetchBookmarks: () => void = useContext(FetchBookmarksContext)
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.3 : 1
  };

  const handleDeleteBookmark = async () => {
    setIsDeleting(true)
    const response = await deleteBookmark(id);
    if (response.success) {
      toast.success('Bookmark deleted');
      fetchBookmarks();

    } else {
      toast.error("Error with deleting bookmark: " + response?.error)
    }
    setIsDeleting(false)
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
      className={cn("bookmarkItem flex flex-col justify-center overflow-ellipsis h-20 w-14 mx-2  cursor-pointer", {
        "cursor-grab active:cursor-grabbing ": isEditing
      })}

      ref={isEditing ? setNodeRef : null}
      style={style}
      {...a}
      {...l}
    >
      <div className={cn("overflow-ellipsis", { "animate-pulse": isEditing })}>
        {/* Delete button */}
        {isEditing &&
          <div className="w-full relative">
            <X
              data-testid="deleteBookmarkButton"
              className={cn("absolute w-5 h-5 p-1 right-0 bg-gray-900 text-white cursor-pointer rounded-full hover:bg-gray-400",
                { "cursor-not-allowed": isDeleting }
              )}
              onPointerDown={(e) => {
                // e.stopPropagation();
                if (!isDeleting) {
                  handleDeleteBookmark();
                }
              }}
            />
          </div>}
        <div className="object-cover overflow-hidden h-14 w-14 rounded-sm   ">
          <Image
            draggable={false}
            alt="image"
            src={imageSrc}
            width={4000}
            height={4000} />
        </div>
        <p className=" text-center text-sm flex flex-col overflow-auto">{bookmarkName}</p>
      </div>
    </div>
  );
};

export default BookmarkItem;

