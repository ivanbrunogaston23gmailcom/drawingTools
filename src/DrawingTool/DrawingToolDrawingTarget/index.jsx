import HandlePointSquare from "../assets/HandlePointSquare";
import React from "react";




const DrawningToolDrawingTarget = ({
    selectedDrawingId,
    interactionInteractionCallBack,
    sideInteractionCallBack,
    height,
    width
}) => {
    const internalHeight = (isNaN(height)) ? 100 : height;
    const internalWidth = (isNaN(width)) ? 100 : width;
    const handleConerClick = (e) => {

    }

    return(
        <div style={{width: internalWidth, height: internalHeight, border: "2px solid #012A85", position: "absolute", top: 700, left: 700}}>
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