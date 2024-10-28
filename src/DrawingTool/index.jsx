import React, {useState, useEffect, useRef} from 'react';

import { addStroke, clickDetection, handleDrag } from '../HelperFunctions';

const DrawingTool = ({writingData}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth - 20);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight - 20);
    const lastMouseDragPosition = useRef({xCoordinate: -1, yCoordinate: -1});
    const drawingInProgress = useRef(false);
    const newShapeParams = useRef({
        shapeType: "pen tool",
        shapeColor: "#0abab5",
        lineWidth: 10
    });
    let selectedShape = -1;
    let internalWritingData = null;
    let canvasContainer = null;
    let newCanvas = null;

    const clickdetectionHandler = (e)=> {
        const results = clickDetection(e,internalWritingData);        
        if (results >= 0 ) {
            selectedShape = results;
            return;
        }      
        paintShape(e,newShapeParams);
    }
    const unClickdetectionHandler = (e)=> {
        selectedShape = -1;
        lastMouseDragPosition.current = {xCoordinate: -1, yCoordinate: -1};
        drawingInProgress.current = false;
    }
    const paintShape = (e,shapeParams) => {
        drawingInProgress.current = true;
        let newShape = null;
        switch(shapeParams.current.shapeType) {
            case "pen tool":
                newShape = {
                    toolType: shapeParams.current.shapeType,
                    color: shapeParams.current.shapeColor,
                    lineWidth: shapeParams.current.lineWidth,
                    startingPosition: [e.clientX,e.clientY],
                    plotPoints: [],
                }
              break;
            default:      
        }
        if (newShape !== null) {
            internalWritingData.push(newShape);
            selectedShape = internalWritingData.length-1;
        } 
    }
    const dragHandler = (e) =>{
        if (!drawingInProgress.current && selectedShape >=0) {
            if (lastMouseDragPosition.current.xCoordinate === -1 || lastMouseDragPosition.current.yCoordinate === -1) {
                lastMouseDragPosition.current.xCoordinate = e.clientX;
                lastMouseDragPosition.current.yCoordinate = e.clientY;
            }

            const dragOffset = {
                xCoordinate: e.clientX - lastMouseDragPosition.current.xCoordinate,
                yCoordinate: e.clientY - lastMouseDragPosition.current.yCoordinate
            };
            handleDrag(dragOffset,selectedShape,internalWritingData);
            /*if (selectedShape > 0) {
                const moveobject = internalWritingData[selectedShape];
                const newDrawingArray = [];
                newDrawingArray.push(moveobject);
                for (let i = 0; i < internalWritingData.length; i++) {
                    if (i === selectedShape) {
                        continue;
                    }
                    newDrawingArray.push(internalWritingData[i]);
                }
                internalWritingData = newDrawingArray;
                selectedShape = 0;
            }*/
            const ctx = newCanvas.getContext("2d");
            ctx.clearRect(0, 0, newCanvas.width, newCanvas.height);
            for (let i = 0; i < internalWritingData.length; i++) {
                addStroke(newCanvas,internalWritingData[i]);
            }
            lastMouseDragPosition.current.xCoordinate = e.clientX;
            lastMouseDragPosition.current.yCoordinate = e.clientY;
        }
        if (drawingInProgress.current && selectedShape >=0) {
            switch(internalWritingData[selectedShape].toolType) {
                
                case "pen tool":
                    const newPlotPoint = [e.clientX,e.clientY];
                    const pointCount = internalWritingData[selectedShape].plotPoints.length;

                    let lastPlotPoint = [];
                    if (pointCount > 0) {
                        lastPlotPoint.push(internalWritingData[selectedShape].plotPoints[pointCount - 1].xCoordinate);
                        lastPlotPoint.push(internalWritingData[selectedShape].plotPoints[pointCount - 1].yCoordinate);
                    } else {
                        lastPlotPoint = internalWritingData[selectedShape].startingPosition;
                    }
                    const xSide = Math.abs(lastPlotPoint[0] - newPlotPoint[0]);
                    const ySide = Math.abs(lastPlotPoint[1] - newPlotPoint[1]);
                    const hypotenuse = Math.sqrt((xSide * xSide) + (ySide * ySide));

                    if (hypotenuse > 10) {
                        const newPointToAdd = {
                            xCoordinate: newPlotPoint[0],
                            yCoordinate: newPlotPoint[1]
                        }
                        internalWritingData[selectedShape].plotPoints.push(newPointToAdd);
                        const ctxt = newCanvas.getContext("2d");
                        ctxt.clearRect(0, 0, newCanvas.width, newCanvas.height);
                        for (let i = 0; i < internalWritingData.length; i++) {
                            addStroke(newCanvas,internalWritingData[i]);
                        }
                    }
                    return;                    
                  break;
                default:
            }
        }
    }


    useEffect(()=>{
        internalWritingData = writingData;
        canvasContainer = document.createElement("div");
        canvasContainer.width = '100%';
        canvasContainer.height = '100%';
        newCanvas = document.createElement("canvas");
        canvasContainer.appendChild(newCanvas);
        newCanvas.height = windowHeight;
        newCanvas.width = windowWidth;
        /*
            canvasContainer.style.left
            canvasContainer.style.top
            canvasContainer.style.position = 'fixed';
        */
        newCanvas.style.zIndex = 20;
        newCanvas.style.border = "2px solid black";
        for (let i = 0; i < internalWritingData.length; i++) {
            addStroke(newCanvas,internalWritingData[i]);
        }
        document.body.appendChild(canvasContainer);
        newCanvas.addEventListener('mousedown', clickdetectionHandler);
        newCanvas.addEventListener("mouseup", unClickdetectionHandler);
        newCanvas.addEventListener("mousemove", dragHandler);
        return (()=> { 
            newCanvas.removeEventListener('mousedown',clickdetectionHandler);
            newCanvas.removeEventListener("mouseup", unClickdetectionHandler);
            newCanvas.removeEventListener("mousemove", dragHandler);
            canvasContainer.remove()
        });
    }
    ,[]);
    return (
        <div>

        </div>
    );
}


export default DrawingTool;