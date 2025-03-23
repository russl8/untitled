import DisplayLoading from "@/components/widgetDisplay/DisplayLoading";
import { displaySize } from "@/components/widgetDisplay/types";
import { useState } from "react";
const WorkoutTracker = ({ displaySize }: { displaySize: displaySize }) => {

    const [loading, setLoading] = useState(false);
    if (loading) return <DisplayLoading />;
    return (
        <div>
                Hi
        </div>
    );
}

export default WorkoutTracker;