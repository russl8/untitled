"use client"
import { DisplayId } from "@/store/features/dashboard/displaySlice";
import { useEffect, useReducer, useState } from "react";
import 'split-pane-react/esm/themes/default.css';
import SplitPaneCustom from "./SplitPaneCustom";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
export default function DashboardPage() {
  const boxes = useSelector((state: RootState) => state.displayReducer);

  // Use computed state directly instead of updating via useEffect
  const initialSizes = useMemo<any>(() => {
    return getDimensionsBasedOnBoxesLength(boxes.length);
  }, [boxes.length])

  return (
    <div className="h-full w-full">
      {boxes.length > 0 && (
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
      )}
    </div>
  )
}

const getDimensionsBasedOnBoxesLength = (length: number) => {
  let sizes = {};
  if (length <= 1) {
    sizes = {
      vertical1: [100, 0],
      horizontal1: [100, 0],
      horizontal2: [0.0001, 0.00001]
    }
  } else if (length === 2) {
    sizes = {
      vertical1: [50, 50],
      horizontal1: [100, 0.0001],
      horizontal2: [100, 0.0001]
    }
  } else if (length === 3) {
    sizes = {
      vertical1: [50, 50],
      horizontal1: [100, 0],
      horizontal2: [50, 50]
    }
  } else if (length > 3) {
    sizes = {
      vertical1: [50, 50],
      horizontal1: [50, 50],
      horizontal2: [50, 50]
    }
  }
  return sizes;
}

const Box = ({ boxId }: { boxId: DisplayId }) => {
  return (
    <div className="h-full w-full from-red-500 to-blue-500 bg-gradient-to-l">
      Box {boxId}
    </div>
  )
}
