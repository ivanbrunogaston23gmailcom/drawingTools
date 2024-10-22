import React, {useState, useEffect} from 'react';

import { addStroke, triangleClickDetection, clickDetection, handleDrag } from '../HelperFunctions';

const DrawingTool = ({writingData}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth - 20);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight - 20);
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
        
        paintShape(e);
    }
    const unClickdetectionHandler = (e)=> {
        selectedShape = -1;
    }

    const dragHandler = (e) =>{
        
        if (selectedShape >=0) {
            //console.log(e);
            handleDrag(e,selectedShape,internalWritingData);
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
        }
    }

    const paintShape = (e) => {

        const newShape = {
            toolType: "filled triangle",
            color: "yellow",
            lineWidth: 10,
            startingPosition: [e.clientX,e.clientY],
            plotPoint2: [e.clientX-200,e.clientY+300],
            plotPoint3: [e.clientX+100,e.clientY+600]
        }
        internalWritingData.push(newShape);
        addStroke(newCanvas,newShape);
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