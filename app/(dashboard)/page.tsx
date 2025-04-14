"use client";

import { useEffect, useState } from "react";
import { Swappable, Plugins } from "@shopify/draggable";
import Dashboard from "@/components/workoutTracker/dashboard/Dashboard";

export default function Page() {
  return (
    <div className="h-full w-full  p-4 overflow-visible" >
      <Dashboard displaySize={"fullsize"} />
    </div>
  );
}
