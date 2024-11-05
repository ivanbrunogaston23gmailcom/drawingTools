import React, {useEffect,useRef} from "react";
import HandlePointSquare from "../assets/HandlePointSquare";





const DrawningToolDrawingTarget = ({
    selectedDrawingId,
    height,
    width,
    top,
    left,
    isVisible,
}) => {
    const internalHeight = (isNaN(height)) ? 100 : height;
    const internalWidth = (isNaN(width)) ? 100 : width;
    const internalTop = (isNaN(top)) ? 0 : Number(top);
    const internalLeft =  (isNaN(left)) ? 0 : Number(left);
    const drawingToolImageFocusTarget = useRef(null);

    const internalIsVisible = (typeof isVisible !== "boolean" || isVisible === false) ? "hidden" : "visible";

    return(
        <div ref={drawingToolImageFocusTarget} id="drawingToolImageFocusTarget" style={{width: internalWidth, 
                    height: internalHeight,
                    border: "2px solid #012A85",
                    position: "absolute",
                    top: internalTop,
                    left: internalLeft,
                    visibility: internalIsVisible
                }}
        >
            <div id="drawingToolImageFocusHandleOne" style={{position: "absolute", top: -10, left: -9}}>
                <HandlePointSquare/>
            </div>
            <div id="drawingToolImageFocusHandleTwo" style={{position: "absolute", top: -10, left: internalWidth-7}}>
                <HandlePointSquare/>
            </div>
            <div id="drawingToolImageFocusHandleThree" style={{position: "absolute", top: internalHeight-9, left: -9}}>
                <HandlePointSquare/>
            </div>
            <div id="drawingToolImageFocusHandleFour" style={{position: "absolute", top: internalHeight-9, left: internalWidth-7}}>
                <HandlePointSquare/>
            </div>
        </div>
    );

}

export default DrawningToolDrawingTarget;