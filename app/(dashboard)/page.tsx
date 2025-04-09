"use client";

import { useEffect, useState } from "react";
import { Swappable, Plugins } from "@shopify/draggable";
import DashboardPage from "@/components/dashboard/DashboardPage";

export default function Page() {
  return (
    <div className="h-full">
      <DashboardPage />
    </div >
  );
}
