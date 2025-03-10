import { RootState } from "@/store/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SplitPane from "split-pane-react";

const SplitPaneCustom = ({ orientation, initialSize, children }: {
    orientation: "vertical" | "horizontal",
    initialSize: [number, number],
    children: React.ReactNode
}) => {
    const boxes = useSelector((state: RootState) => state.displayReducer)
    const [sizes, setSizes] = useState(initialSize ? initialSize : [50, 50]);

    useEffect(()=>{
        setSizes(initialSize)
    },[boxes.length])
    return (
        <SplitPane
            split={orientation}
            sizes={sizes}
            allowResize={false}
            sashRender={() => <></>}
            onChange={setSizes}
            resizerSize={10}
        >
            {Array.isArray(children) ? children : [children]}

        </SplitPane>

    );
}

export default SplitPaneCustom;