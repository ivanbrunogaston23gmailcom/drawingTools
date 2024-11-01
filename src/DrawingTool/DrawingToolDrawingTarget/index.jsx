import React, {useEffect,useRef} from "react";
import HandlePointSquare from "../assets/HandlePointSquare";





const DrawningToolDrawingTarget = ({
    selectedDrawingId,
    interactionInteractionCallBack,
    sideInteractionCallBack,
    height,
    width,
    top,
    left,
    isVisible,
    handleClick,
    getCurrentlySelectedDrawing,
    dragHandler
}) => {
    const internalHeight = (isNaN(height)) ? 100 : height;
    const internalWidth = (isNaN(width)) ? 100 : width;
    const internalTop = (isNaN(top)) ? 0 : Number(top);
    const internalLeft =  (isNaN(left)) ? 0 : Number(left);
    const internalIsVisible = (typeof isVisible !== "boolean" || isVisible === false) ? "hidden" : "visible";
    const internalHandleClick = (typeof handleClick === "function") ? handleClick : ()=>{};
    const internalGetCurrentlySelectedDrawing = (typeof getCurrentlySelectedDrawing === "function") ? getCurrentlySelectedDrawing : ()=>{ return -1};
    const internalDragHandler = (typeof dragHandler === "function") ? dragHandler : ()=>{};
    const drawingToolFocusTarget = useRef(null);
    const focusToolUpperLeftKnob = useRef(null);
    const focusToolUpperRightKnob = useRef(null);
    const focusToolLowerLeftKnob = useRef(null);
    const focusToolLowerRightKnob = useRef(null);
    const dragingInProgress = useRef(false);
    const handleCornerClick = (e) => {
        e.stopPropagation();
        const focusTargetInfo = {
            fromFocusTarget: true,
            selectedShape: internalGetCurrentlySelectedDrawing()

        }
        dragingInProgress.current = true;
        internalHandleClick(e,focusTargetInfo);     
    }
    const handleTargetDrag = (e)=> {
        //e.stopPropagation();
        if (dragingInProgress.current) {            
            /*
            drawingToolFocusTarget.current.style.left = `${drawingToolFocusTarget.current.style.left.substring(0, drawingToolFocusTarget.current.style.left.length - 2) + e.movementX}px`;
            drawingToolFocusTarget.current.style.top = `${drawingToolFocusTarget.current.style.top.substring(0, drawingToolFocusTarget.current.style.top.length - 2) + e.movementY}px`;
            focusToolUpperLeftKnob.current.style.left = `${focusToolUpperLeftKnob.current.style.left.substring(0, focusToolUpperLeftKnob.current.style.left.length - 2) + e.movementX}px`;
            focusToolUpperLeftKnob.current.style.top = `${focusToolUpperLeftKnob.current.style.top.substring(0, focusToolUpperLeftKnob.current.style.top.length - 2) + e.movementY}px`;
            focusToolUpperRightKnob.current.style.left = `${focusToolUpperRightKnob.current.style.left.substring(0, focusToolUpperRightKnob.current.style.left.length - 2) + e.movementX}px`;
            focusToolUpperRightKnob.current.style.top = `${focusToolUpperRightKnob.current.style.top.substring(0, focusToolUpperRightKnob.current.style.top.length - 2) + e.movementY}px`;
            focusToolLowerLeftKnob.current.style.left = `${focusToolLowerLeftKnob.current.style.left.substring(0, focusToolLowerLeftKnob.current.style.left.length - 2) + e.movementX}px`;
            focusToolLowerLeftKnob.current.style.top = `${focusToolLowerLeftKnob.current.style.top.substring(0, focusToolLowerLeftKnob.current.style.top.length - 2) + e.movementY}px`;
            focusToolLowerRightKnob.current.style.left = `${focusToolLowerRightKnob.current.style.left.substring(0, focusToolLowerRightKnob.current.style.left.length - 2) + e.movementX}px`;
            focusToolLowerRightKnob.current.style.top = `${focusToolLowerRightKnob.current.style.top.substring(0, focusToolLowerRightKnob.current.style.top.length - 2) + e.movementY}px`;
            */
            internalDragHandler(e);
        }
    }
    const handleMouseUp = (e)=> {
        e.stopPropagation();
        dragingInProgress.current = false;
    }


    useEffect(()=>{
        drawingToolFocusTarget.current.addEventListener("mousedown",handleCornerClick);
        drawingToolFocusTarget.current.addEventListener("mousemove", handleTargetDrag);
        drawingToolFocusTarget.current.addEventListener("mouseup",handleMouseUp);
        return (()=> {
            drawingToolFocusTarget.current.removeEventListener("mousedown",handleCornerClick);
            drawingToolFocusTarget.current.removeEventListener("mousemove", handleTargetDrag);
            drawingToolFocusTarget.current.removeEventListener("mouseup",handleMouseUp);
        })
    },[]);
    return(
        <div ref={drawingToolFocusTarget} id="drawingToolImageFocusTarget" style={{width: internalWidth, 
                    height: internalHeight,
                    border: "2px solid #012A85",
                    position: "absolute",
                    top: internalTop,
                    left: internalLeft,
                    visibility: internalIsVisible
                }}
        >
            <div ref={focusToolUpperLeftKnob} style={{position: "absolute", top: -10, left: -9}}>
                <HandlePointSquare/>
            </div>
            <div ref={focusToolUpperRightKnob} id="two" style={{position: "absolute", top: -10, left: internalWidth-7}}>
                <HandlePointSquare/>
            </div>
            <div ref={focusToolLowerLeftKnob} style={{position: "absolute", top: internalHeight-9, left: -9}}>
                <HandlePointSquare/>
            </div>
            <div ref={focusToolLowerRightKnob} style={{position: "absolute", top: internalHeight-9, left: internalWidth-7}}>
                <HandlePointSquare/>
            </div>
        </div>
    );

}


export default DrawningToolDrawingTarget;