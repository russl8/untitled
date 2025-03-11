import Image from "next/image";
const BookmarkManager = () => {
    return (
        <>
            <Bookmark />
        </>
    );
}

const Bookmark = () => {
    return (
        <div className="flex flex-col justify-center h-20 w-14 bg-gra">

            <div className="object-contain overflow-hidden h-14 w-14 rounded-sm">
                <Image alt="sample" src="/squareImage.jpg" width={4000} height={4000} />
            </div>
            <p className=" text-center text-sm">EClass</p>
        </div>
    )
}
export default BookmarkManager;