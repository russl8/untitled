import DashboardPage from "@/components/dashboard/DashboardPage";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

export default function Page() {


  return (
    <div className="h-full w-full">
      <DashboardPage />
    </div>
  );
}
