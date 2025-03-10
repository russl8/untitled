import { useState } from "react";
import SplitPane from "split-pane-react";

const SplitPaneCustom = ({ orientation, initialSize, children }: {
    orientation: "vertical" | "horizontal",
    initialSize: [number, number],
    children: React.ReactNode
}) => {
    const [sizes, setSizes] = useState(initialSize ? initialSize : [50, 50]);

    return (
        <SplitPane
            split={orientation}
            sizes={sizes}
            allowResize={true}
            sashRender={() => <></>}
            onChange={setSizes}
            resizerSize={10}
        >
            {Array.isArray(children) ? children : [children]}

        </SplitPane>

    );
}

export default SplitPaneCustom;