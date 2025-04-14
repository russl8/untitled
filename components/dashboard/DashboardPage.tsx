"use client"
import 'split-pane-react/esm/themes/default.css';
import WorkoutTracker from '../widgets/workoutTracker/WorkoutTracker';
export default function DashboardPage() {
  return (
    <div className="h-full w-full  p-4 overflow-visible" >
        <WorkoutTracker displaySize={"fullsize"}/>
    </div>
  )
}

