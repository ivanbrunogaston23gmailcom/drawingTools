import HandlePointSquare from "../assets/HandlePointSquare";
import React from "react";




const DrawningToolDrawingTarget = ({
    selectedDrawingId,
    interactionInteractionCallBack,
    sideInteractionCallBack,
    height,
    width,
    top,
    left,
    isVisible
}) => {
    const internalHeight = (isNaN(height)) ? 100 : height;
    const internalWidth = (isNaN(width)) ? 100 : width;
    const internalTop = (isNaN(top)) ? 0 : Number(top);
    const internalLeft =  (isNaN(left)) ? 0 : Number(left);
    const internalIsVisible = (typeof isVisible !== "boolean" || isVisible === false) ? "hidden" : "visible";
    const handleCornerClick = (e) => {

    }

    return(
        <div id="drawingToolImageFocusTarget" style={{width: internalWidth, 
                    height: internalHeight,
                    border: "2px solid #012A85",
                    position: "absolute",
                    top: internalTop,
                    left: internalLeft,
                    visibility: internalIsVisible
                }}
        >
            <div style={{position: "absolute", top: -10, left: -9}}>
                <HandlePointSquare/>
            </div>
            <div style={{position: "absolute", top: -10, left: internalWidth-7}}>
                <HandlePointSquare/>
            </div>
            <div style={{position: "absolute", top: internalHeight-9, left: -9}}>
                <HandlePointSquare/>
            </div>
            <div style={{position: "absolute", top: internalHeight-9, left: internalWidth-7}}>
                <HandlePointSquare/>
            </div>
        </div>
    );

}


export default DrawningToolDrawingTarget;