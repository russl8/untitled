import Image from "next/image";
import { Reorder } from "framer-motion"
import { useState } from "react";
import DraggableDisplay from "./DraggableDisplay";
import { displaySize } from "../types";

const BookmarkManager = ({ displaySize }: { displaySize: displaySize }) => {
    return (
        <div className="p-10 flex flex-col items-start justify-start w-full h-full overflow-visible">
            <p className="">Bookmark manager</p>
            <DraggableDisplay />
        </div>
    );
}






// function List() {
//     const [items, setItems] = useState([0, 1, 2, 3, 4, 5, 6])

//     return (
//         <Reorder.Group
//             className="bg-amber-600 grid grid-cols-3 grid-rows-4 gap-1"
//             values={items}
//             onReorder={setItems}
//             // drag
//             axis="x"
//         >
//             {items.map(item => (
//                 <Reorder.Item key={item} value={item}>
//                     <Bookmark />
//                 </Reorder.Item>
//             ))}
//         </Reorder.Group>
//     )
// }



export default BookmarkManager;


