"use client"
import { DisplayId } from "@/store/features/dashboard/displaySlice";
import { useEffect, useState } from "react";
import 'split-pane-react/esm/themes/default.css';
import SplitPaneCustom from "./SplitPaneCustom";

export default function DashboardPage() {
  const [boxes, setBoxes] = useState<Array<DisplayId>>([1, 2, 3])
  const [initialSizes, setInitialSizes] = useState<any>(() => {
    let sizes;
    if (boxes.length === 1) {
      sizes = {
        vertical1: [100, 0],
        horizontal1: [100, 0],
        horizontal2: [0.0001,0.00001]
      }
    } else if (boxes.length === 2) {
      sizes = {
        vertical1: [50, 50],
        horizontal1: [100, 0],
        horizontal2: [100, 0]
      }
    } else if (boxes.length === 3) {
      sizes = {
        vertical1: [50, 50],
        horizontal1: [100, 0],
        horizontal2: [50, 50]
      }
    } else if (boxes.length === 4) {
      sizes = {
        vertical1: [50, 50],
        horizontal1: [50, 50],
        horizontal2: [50, 50]
      }
    }
    return sizes
  })

  return (
    <div className="h-full w-full">
      <SplitPaneCustom orientation="vertical" initialSize={initialSizes["vertical1"]}>
        <SplitPaneCustom orientation="horizontal" initialSize={initialSizes["horizontal1"]}>
          {boxes.length > 0 && <Box boxId={boxes[0]} />}
          {boxes.length > 3 && <Box boxId={boxes[3]} />}

        </SplitPaneCustom>
        <SplitPaneCustom orientation="horizontal" initialSize={initialSizes["horizontal2"]}>
          {boxes.length > 1 && <Box boxId={boxes[1]} />}
          {boxes.length > 2 && <Box boxId={boxes[2]} />}

        </SplitPaneCustom>
      </SplitPaneCustom>
    </div>
  )

}

const Box = ({ boxId }: { boxId: DisplayId }) => {
  return (
    <div className={`h-full w-full from-red-500 to-blue-500 bg-gradient-to-l`}>
      Box {boxId}
    </div>
  )
}