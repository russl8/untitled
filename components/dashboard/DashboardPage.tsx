"use client"
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { useState } from "react";
import SplitPane, { Pane } from "split-pane-react";
import 'split-pane-react/esm/themes/default.css';

export default function DashboardPage() {
  const [sizes, setSizes] = useState([50, 50]); 
  const [sizes2, setSizes2] = useState([50, 50]); 
  const [sizes3, setSizes3] = useState([50, 50]);


  return (
    <div className="h-[100vh]">
      <SplitPane
        split='vertical'
        sizes={sizes}
        allowResize={true}
        sashRender={() => <></>}
        onChange={setSizes}
        resizerSize={10}
      >
        <div className="h-full w-full" >
          <SplitPane
            split='horizontal'
            sizes={sizes2}
            allowResize={true}
            sashRender={() => <></>}
            onChange={setSizes2}
            resizerSize={10}>

            <div className="h-full bg-amber-300" >

            </div>

            <div className="h-full bg-blue-300">

            </div>
          </SplitPane>
        </div>
        <div className="h-full w-full" >
          <SplitPane
            split='horizontal'
            sizes={sizes3}
            allowResize={true}
            sashRender={() => <></>}
            onChange={setSizes3}
            resizerSize={10}>


            <div className="h-full bg-red-300">

            </div>

            <div className="h-full bg-green-300">

            </div>
          </SplitPane>
        </div>


      </SplitPane>
    </div>
  );
}
