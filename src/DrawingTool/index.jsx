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
    let selectedShape = useRef(-1);
    const [internalWritingData, setWritingData] = useState(writingData);
    let canvasContainer = null;
    let newCanvas = null;
    const clearAndRepaintCanvas = (newWritingData)=> {
        const ctx = newCanvas.getContext("2d");
        ctx.clearRect(0, 0, newCanvas.width, newCanvas.height);
        for (let i = 0; i < newWritingData.length; i++) {
            addStroke(newCanvas,newWritingData[i]);
        }
    }
    const sendCanvasReferenceCallBack = (inboundCanvasContainer,inboundCanvas) => {
        newCanvas = inboundCanvas;
        for (let i = 0; i < internalWritingData.length; i++) {
            addStroke(newCanvas,internalWritingData[i]);
        }
        canvasContainer = inboundCanvasContainer;
        document.getElementById("presentation").appendChild(canvasContainer);
    }
    const getInternalWritingData = () => {
        return internalWritingData;
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
            selectedShape.current = internalWritingData.length-1;
        } 
    }
    const interactionCallBack = (interactionCallBackMessage) =>{
        switch(interactionCallBackMessage.userAction) {
            case "dragShape":
                setWritingData([...interactionCallBackMessage.updatedimageList]);
                break;
            default:
                break;
        }
    }
    return (
        <div id="presentation" style={{position: "relative", zIndex: internalZIndex, width: windowWidth, height: windowHeight}}>
            <DrawingToolInteraction
                width={windowWidth}
                height={windowHeight}
                zIndex={internalZIndex + 1}
                getInternalWritingData={getInternalWritingData}
                reportInteractionCallBack={interactionCallBack}
                clearAndRepaintCanvas={clearAndRepaintCanvas}
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