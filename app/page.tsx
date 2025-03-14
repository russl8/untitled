import DashboardPage from "@/components/dashboard/DashboardPage";
import ImageForm from "@/components/displays/BookmarkManager/ImageForm";
import ExampleReduxComponent from "@/store/features/example/ExampleReduxComponent";

export default function Page() {


  return (
    <div className="h-[100vh]">
      <ImageForm/>
      {/* <DashboardPage /> */}
    </div>
  );
}
