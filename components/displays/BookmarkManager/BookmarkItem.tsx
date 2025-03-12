import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";
import { redirect } from "next/dist/server/api-utils";

const BookmarkItem = (props: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,

    zIndex: isDragging ? "100" : "auto",
    opacity: isDragging ? 0.3 : 1
  };

  return (
    <div
  
      className="flex flex-col justify-center h-20 w-14 mx-2 cursor-grab active:cursor-grabbing"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}>
      <div className="object-contain overflow-hidden h-14 w-14 rounded-sm">
        <Image
          draggable={false}
          alt="sample"
          src="/squareImage.jpg"
          width={4000}
          height={4000} />
      </div>
      <p className=" text-center text-sm">EClass</p>
    </div>
  );
};

export default BookmarkItem;


// const Bookmark = () => {
//   return (
//       <div className="flex flex-col justify-center h-20 w-14 mx-2 cursor-grab active:cursor-grabbing">
//           {/*  */}
//           <div className="object-contain overflow-hidden h-14 w-14 rounded-sm">
//               <Image
//                   draggable={false}
//                   alt="sample"
//                   src="/squareImage.jpg"
//                   width={4000}
//                   height={4000} />
//           </div>
//           <p className=" text-center text-sm">EClass</p>
//       </div>
//   )
// }