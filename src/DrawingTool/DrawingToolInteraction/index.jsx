import React, { useEffect, useRef, useState } from "react";
import DrawingToolBar from "../DrawingToolBar";
import './index.css';
import DrawningToolDrawingTarget from "../DrawingToolDrawingTarget";
import { addStroke, clickDetection, handleDrag, strechImage, strechSideways } from '../../HelperFunctions';
import { changeDrawingTargetFocus } from '../../HelperFunctions/ImageFocusTargetFunctions';


const DrawingToolInteraction = ({
    getInternalWritingData,
    reportInteractionCallBack,
    showDrawingToolBar,
    zIndex,
    clearAndRepaintCanvas,
}) => {
    const internalGetWritingData = (typeof getInternalWritingData === "function") ?  getInternalWritingData : ()=> { return {}};
    const internalWritingData = internalGetWritingData();
    const internalreportInteractionCallBack = (typeof reportInteractionCallBack === "function") ? reportInteractionCallBack : ()=>{};
    const internalShowDrawingToolBar = (typeof showDrawingToolBar === "boolean") ? showDrawingToolBar : true;
    const interactionLayerReference = useRef(null);
    const currentlySelectedShape = useRef(-1);
    const newShapeParams = useRef({
        shapeType: "pen tool",
        shapeColor: "brown",
        lineWidth: 10
    });
    let mouseIsClicked = false;
    let shapeDraggingInProgress = false;
    let shapeTargetSelectedElement = null;
    const [drawingTargetProps, setDrawingTargetProps] = useState({
        height: 1,
        width: 1,
        top: 0,
        left: 0,
        isVisible: false
    })
    const getCurrentlySelectedDrawing = () => {
        return currentlySelectedShape.current;
    }
    const handleClick = (e, focusTargetInfo = {fromFocusTarget: false, selectedShape: -1}) => {
        mouseIsClicked = true;
        if (e?.target?.id === "drawingToolImageFocusTarget") {
            shapeTargetSelectedElement = e?.target?.id;
            return;
        }
        if(
            e?.target?.parentElement?.parentElement?.id === "drawingToolImageFocusHandleOne" ||
            e?.target?.parentElement?.parentElement?.id === "drawingToolImageFocusHandleTwo" ||
            e?.target?.parentElement?.parentElement?.id === "drawingToolImageFocusHandleThree" ||
            e?.target?.parentElement?.parentElement?.id === "drawingToolImageFocusHandleFour"
        ){
            shapeTargetSelectedElement = e?.target?.parentElement?.parentElement?.id;


            return;
        }
        let previouslySelectedShape = currentlySelectedShape.current;
        currentlySelectedShape.current = clickDetection(e,internalWritingData);
        if (previouslySelectedShape === currentlySelectedShape.current) {
            return;
        }
        if (previouslySelectedShape >= 0 && currentlySelectedShape.current < 0) {
            setDrawingTargetProps({
                height: 1,
                width: 1,
                top: 0,
                left: 0,
                isVisible: false
            });
        }
        if (previouslySelectedShape < 0 && currentlySelectedShape.current >= 0) {            
            changeDrawingTargetFocus(setDrawingTargetProps,internalWritingData[currentlySelectedShape.current]);
        }
        if (previouslySelectedShape >= 0 && currentlySelectedShape.current >= 0) {
            changeDrawingTargetFocus(setDrawingTargetProps,internalWritingData[currentlySelectedShape.current]);
        }
    }
    
    const dragHandler = (e) => {
        if (mouseIsClicked === false || currentlySelectedShape.current < 0) {
            return;
        }
        shapeDraggingInProgress = true;
        const dragOffset = {
            xCoordinate: e.movementX,
            yCoordinate: e.movementY,
        }          
        
        let mainTarget = document.getElementById('drawingToolImageFocusTarget');
        
        if (shapeTargetSelectedElement === mainTarget.id) {
            mainTarget.style.left = `${Number(mainTarget.style.left.substring(0, mainTarget.style.left.length - 2)) + e.movementX}px`;
            mainTarget.style.top = `${Number(mainTarget.style.top.substring(0, mainTarget.style.top.length - 2)) + e.movementY}px`;
            handleDrag(dragOffset,currentlySelectedShape.current,internalWritingData);
            clearAndRepaintCanvas(internalWritingData);
            return;
        }

        if (shapeTargetSelectedElement === "drawingToolImageFocusHandleOne") {
            let upperRightControlHandle = document.getElementById('drawingToolImageFocusHandleTwo');
            let bottomLeftControlHandle = document.getElementById('drawingToolImageFocusHandleThree');
            let bottomRightControlHandle = document.getElementById('drawingToolImageFocusHandleFour');

            if (Number(mainTarget.style.width.substring(0, mainTarget.style.width.length - 2)) - e.movementX >= 20){
                mainTarget.style.left = `${Number(mainTarget.style.left.substring(0, mainTarget.style.left.length - 2)) + e.movementX}px`;
                mainTarget.style.width = `${Number(mainTarget.style.width.substring(0, mainTarget.style.width.length - 2)) - e.movementX}px`;
                upperRightControlHandle.style.left = `${Number(upperRightControlHandle.style.left.substring(0, upperRightControlHandle.style.left.length - 2)) - e.movementX}px`;
                bottomRightControlHandle.style.left = `${Number(bottomRightControlHandle.style.left.substring(0, bottomRightControlHandle.style.left.length - 2)) - e.movementX}px`;
                strechSideways(dragOffset,currentlySelectedShape.current,internalWritingData);
                clearAndRepaintCanvas(internalWritingData);
            }
            
            if (Number(mainTarget.style.height.substring(0, mainTarget.style.height.length - 2)) - e.movementY >= 20) {
                mainTarget.style.top = `${Number(mainTarget.style.top.substring(0, mainTarget.style.top.length - 2)) + e.movementY}px`;
                mainTarget.style.height = `${Number(mainTarget.style.height.substring(0, mainTarget.style.height.length - 2)) - e.movementY}px`;
                bottomLeftControlHandle.style.top = `${Number(bottomLeftControlHandle.style.top.substring(0, bottomLeftControlHandle.style.top.length - 2)) - e.movementY}px`;
                bottomRightControlHandle.style.top = `${Number(bottomRightControlHandle.style.top.substring(0, bottomRightControlHandle.style.top.length - 2)) - e.movementY}px`;
                strechImage(dragOffset,currentlySelectedShape.current,internalWritingData);
                clearAndRepaintCanvas(internalWritingData);
            }
        }
        if (shapeTargetSelectedElement === "drawingToolImageFocusHandleTwo") {
            let upperRightControlHandle = document.getElementById('drawingToolImageFocusHandleTwo');
            let bottomLeftControlHandle = document.getElementById('drawingToolImageFocusHandleThree');
            let bottomRightControlHandle = document.getElementById('drawingToolImageFocusHandleFour');

            if (Number(mainTarget.style.width.substring(0, mainTarget.style.width.length - 2)) + e.movementX >= 20){
                mainTarget.style.width = `${Number(mainTarget.style.width.substring(0, mainTarget.style.width.length - 2)) + e.movementX}px`;
                upperRightControlHandle.style.left = `${Number(upperRightControlHandle.style.left.substring(0, upperRightControlHandle.style.left.length - 2)) + e.movementX}px`;
                bottomRightControlHandle.style.left = `${Number(bottomRightControlHandle.style.left.substring(0, bottomRightControlHandle.style.left.length - 2)) + e.movementX}px`;
                strechSideways(dragOffset,currentlySelectedShape.current,internalWritingData,"from right");
                clearAndRepaintCanvas(internalWritingData);
            }
            
            if (Number(mainTarget.style.height.substring(0, mainTarget.style.height.length - 2)) - e.movementY >= 20) {
                mainTarget.style.top = `${Number(mainTarget.style.top.substring(0, mainTarget.style.top.length - 2)) + e.movementY}px`;
                mainTarget.style.height = `${Number(mainTarget.style.height.substring(0, mainTarget.style.height.length - 2)) - e.movementY}px`;
                bottomLeftControlHandle.style.top = `${Number(bottomLeftControlHandle.style.top.substring(0, bottomLeftControlHandle.style.top.length - 2)) - e.movementY}px`;
                bottomRightControlHandle.style.top = `${Number(bottomRightControlHandle.style.top.substring(0, bottomRightControlHandle.style.top.length - 2)) - e.movementY}px`;
                strechImage(dragOffset,currentlySelectedShape.current,internalWritingData);
                clearAndRepaintCanvas(internalWritingData);
            }
        }
        if (shapeTargetSelectedElement === "drawingToolImageFocusHandleThree") {
            let upperRightControlHandle = document.getElementById('drawingToolImageFocusHandleTwo');
            let bottomLeftControlHandle = document.getElementById('drawingToolImageFocusHandleThree');
            let bottomRightControlHandle = document.getElementById('drawingToolImageFocusHandleFour');

            if (Number(mainTarget.style.width.substring(0, mainTarget.style.width.length - 2)) - e.movementX >= 20){
                mainTarget.style.left = `${Number(mainTarget.style.left.substring(0, mainTarget.style.left.length - 2)) + e.movementX}px`;
                mainTarget.style.width = `${Number(mainTarget.style.width.substring(0, mainTarget.style.width.length - 2)) - e.movementX}px`;
                upperRightControlHandle.style.left = `${Number(upperRightControlHandle.style.left.substring(0, upperRightControlHandle.style.left.length - 2)) - e.movementX}px`;
                bottomRightControlHandle.style.left = `${Number(bottomRightControlHandle.style.left.substring(0, bottomRightControlHandle.style.left.length - 2)) - e.movementX}px`;
                strechSideways(dragOffset,currentlySelectedShape.current,internalWritingData);
                clearAndRepaintCanvas(internalWritingData);
            }
            
            if (Number(mainTarget.style.height.substring(0, mainTarget.style.height.length - 2)) + e.movementY >= 20) {
                mainTarget.style.height = `${Number(mainTarget.style.height.substring(0, mainTarget.style.height.length - 2)) + e.movementY}px`;
                bottomLeftControlHandle.style.top = `${Number(bottomLeftControlHandle.style.top.substring(0, bottomLeftControlHandle.style.top.length - 2)) + e.movementY}px`;
                bottomRightControlHandle.style.top = `${Number(bottomRightControlHandle.style.top.substring(0, bottomRightControlHandle.style.top.length - 2)) + e.movementY}px`;
                strechImage(dragOffset,currentlySelectedShape.current,internalWritingData, "from below");
                clearAndRepaintCanvas(internalWritingData);
            }
        }
        if (shapeTargetSelectedElement === "drawingToolImageFocusHandleFour") {
            let upperRightControlHandle = document.getElementById('drawingToolImageFocusHandleTwo');
            let bottomLeftControlHandle = document.getElementById('drawingToolImageFocusHandleThree');
            let bottomRightControlHandle = document.getElementById('drawingToolImageFocusHandleFour');

            if (Number(mainTarget.style.width.substring(0, mainTarget.style.width.length - 2)) + e.movementX >= 20){
                mainTarget.style.width = `${Number(mainTarget.style.width.substring(0, mainTarget.style.width.length - 2)) + e.movementX}px`;
                upperRightControlHandle.style.left = `${Number(upperRightControlHandle.style.left.substring(0, upperRightControlHandle.style.left.length - 2)) + e.movementX}px`;
                bottomRightControlHandle.style.left = `${Number(bottomRightControlHandle.style.left.substring(0, bottomRightControlHandle.style.left.length - 2)) + e.movementX}px`;
                strechSideways(dragOffset,currentlySelectedShape.current,internalWritingData,"from right");
                clearAndRepaintCanvas(internalWritingData);
            }
            
            if (Number(mainTarget.style.height.substring(0, mainTarget.style.height.length - 2)) + e.movementY >= 20) {
                mainTarget.style.height = `${Number(mainTarget.style.height.substring(0, mainTarget.style.height.length - 2)) + e.movementY}px`;
                bottomLeftControlHandle.style.top = `${Number(bottomLeftControlHandle.style.top.substring(0, bottomLeftControlHandle.style.top.length - 2)) + e.movementY}px`;
                bottomRightControlHandle.style.top = `${Number(bottomRightControlHandle.style.top.substring(0, bottomRightControlHandle.style.top.length - 2)) + e.movementY}px`;
                strechImage(dragOffset,currentlySelectedShape.current,internalWritingData, "from below");
                clearAndRepaintCanvas(internalWritingData);
            }
        }
        
        
    }
    const handleMouseUp = (e) => {
        mouseIsClicked = false;
        shapeTargetSelectedElement = null;
        if (shapeDraggingInProgress) {
            shapeDraggingInProgress = false;
            const interactionCallBackMessage = {
                userAction: "dragShape",
                currentlySelectedShape: currentlySelectedShape.current,
                updatedimageList: internalWritingData
            };
            changeDrawingTargetFocus(setDrawingTargetProps,internalWritingData[currentlySelectedShape.current]);
            internalreportInteractionCallBack(interactionCallBackMessage);
        }
    }
    const internalZIndex = (!isNaN(zIndex) && Number(zIndex) >= 0 ) ? Number(zIndex) : 1;
    useEffect(()=>{
        interactionLayerReference.current.addEventListener("mousedown",handleClick);
        interactionLayerReference.current.addEventListener("mousemove",dragHandler);
        interactionLayerReference.current.addEventListener("mouseup",handleMouseUp);
        return (()=> {
            interactionLayerReference.current.removeEventListener("mousedown",handleClick);
            interactionLayerReference.current.removeEventListener("mousemove",dragHandler);
            interactionLayerReference.current.removeEventListener("mousemove",handleMouseUp);
        })
    },[]);
    return (
    <div 
        ref={interactionLayerReference}
        className ={"react-drawing-tool-interactions"}
        style={{zIndex: internalZIndex}}
    >
        <div>
            <DrawningToolDrawingTarget
                height = {drawingTargetProps.height}
                width = {drawingTargetProps.width}
                top = {drawingTargetProps.top}
                left = {drawingTargetProps.left}
                isVisible = {drawingTargetProps.isVisible}
                handleClick = {handleClick}
                getCurrentlySelectedDrawing = {getCurrentlySelectedDrawing}
                dragHandler={dragHandler}      
            />
        </div>
        {
            internalShowDrawingToolBar && (
                <div style={{position: 'absolute', top: window.innerHeight - 30, zIndex: 2}}>
                    <DrawingToolBar/>
                </div>
            )
        }

    </div>
    );
}


export default DrawingToolInteraction;