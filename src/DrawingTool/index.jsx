import React, {useState, useEffect, useRef} from 'react';
import { addStroke, clickDetection, handleDrag } from '../HelperFunctions';
import DrawingToolCanvas from './DrawingToolCanvas';
import DrawingToolInteraction from './DrawingToolInteraction';

const DrawingTool = ({writingData, width, height, zIndex}) => {
    const [windowWidth, setWindowWidth] = useState(width);
    const [windowHeight, setWindowHeight] = useState(height);
    const internalZIndex = (!isNaN(zIndex) && Number(zIndex) >= 0 ) ? Number(zIndex) : 0; 
    const lastMouseDragPosition = useRef({xCoordinate: -1, yCoordinate: -1});
    const drawingInProgress = useRef(false);
    const newShapeParams = useRef({
        shapeType: "pen tool",
        shapeColor: "brown",
        lineWidth: 10
    });
    let selectedShape = -1;
    let internalWritingData = null;
    let canvasContainer = null;
    let newCanvas = null;

    const sendCanvasReferenceCallBack = (inboundCanvasContainer,inboundCanvas) => {
        internalWritingData = writingData;
        newCanvas = inboundCanvas;
        for (let i = 0; i < internalWritingData.length; i++) {
            addStroke(newCanvas,internalWritingData[i]);
        }
        canvasContainer = inboundCanvasContainer;
        document.getElementById("presentation").appendChild(canvasContainer);
    }

    const clickdetectionHandler = (e)=> {
        console.log("e",e);
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
                    startingPosition: [e.offsetX,e.offsetY],
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
                lastMouseDragPosition.current.xCoordinate = e.offsetX;
                lastMouseDragPosition.current.yCoordinate = e.offsetY;
            }

            const dragOffset = {
                xCoordinate: e.offsetX - lastMouseDragPosition.current.xCoordinate,
                yCoordinate: e.offsetY - lastMouseDragPosition.current.yCoordinate
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
            lastMouseDragPosition.current.xCoordinate = e.offsetX;
            lastMouseDragPosition.current.yCoordinate = e.offsetY;
        }
        if (drawingInProgress.current && selectedShape >=0) {
            switch(internalWritingData[selectedShape].toolType) {
                
                case "pen tool":
                    const newPlotPoint = [e.offsetX,e.offsetY];
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

                    if (hypotenuse > 7) {
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
                default:
            }
        }
    }


    /*useEffect(()=>{
        newCanvas.addEventListener('mousedown', clickdetectionHandler);
        newCanvas.addEventListener("mouseup", unClickdetectionHandler);
        newCanvas.addEventListener("mousemove", dragHandler);
        return (()=> { 
            newCanvas.removeEventListener('mousedown',clickdetectionHandler);
            newCanvas.removeEventListener("mouseup", unClickdetectionHandler);
            newCanvas.removeEventListener("mousemove", dragHandler);
        });
    }
    ,[]);*/
    return (
        <div id="presentation" style={{position: "relative", zIndex: internalZIndex, width: windowWidth, height: windowHeight}}>
            <DrawingToolInteraction
                width={windowWidth}
                height={windowHeight}
                zIndex={internalZIndex + 1}
            />
            <DrawingToolCanvas
                width ={windowWidth}
                height={windowHeight}
                sendCanvasReferenceCallBack={sendCanvasReferenceCallBack}
                showDrawings={true}
                zIndex={internalZIndex}
            />
        </div>
    );
}


export default DrawingTool;