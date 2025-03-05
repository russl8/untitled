import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function Home() {
  const user = await currentUser()
  //TODO: allow creation of usernames
  // resume tutorial https://www.youtube.com/watch?v=pjFbcXi8eCM&list=PLOkvsV3KKCCgz050L_pOdfpbDfdxAUb4t
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {user?.username}
    </div>
  );
}
