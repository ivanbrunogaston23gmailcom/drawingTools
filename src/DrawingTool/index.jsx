import React, {useState, useEffect} from 'react';

import { addStroke, triangleClickDetection, pathPointDetection } from '../HelperFunctions';

const DrawingTool = ({writingData}) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth - 20);
    const [windowHeight, setWindowHeight] = useState(window.innerHeight - 20);
    let internalWritingData = null;
    let canvasContainer = null;
    let newCanvas = null;


    const canvasTaddler = (e) => {
        for (let i = (internalWritingData.length - 1); i >= 0; i--) {
            switch (internalWritingData[i].toolType) {
                case "ellipse":
                    const xSide = Math.abs(e.clientX - internalWritingData[i].startingPosition[0]);
                    const ySide = Math.abs(e.clientY - internalWritingData[i].startingPosition[1]);
                    const hypotenuse = Math.sqrt(xSide * xSide + ySide * ySide);
                    if (hypotenuse <= (internalWritingData[i].radius + internalWritingData[i].lineWidth - 5)) {
                        alert(`you clicked within the circle: ${i}`);
                        return;
                    }
                    break;
                case "hollow rectangle":
                    const upperLeftXCoord = internalWritingData[i].startingPosition[0] + internalWritingData[i].width + internalWritingData[i].lineWidth - 3;
                    const lowerRightyCoord = internalWritingData[i].startingPosition[1] + internalWritingData[i].width + internalWritingData[i].lineWidth - 3;
                    if ((e.clientX >= internalWritingData[i].startingPosition[0] && e.clientX <= upperLeftXCoord) &&
                        (e.clientY >= internalWritingData[i].startingPosition[1] && e.clientY <= lowerRightyCoord)
                    ) {
                        alert(`you clicked within the filled square: ${i}`);
                        return;
                    }
                    break;

                case "filled rectangle":
                    const upperLeftXCoordinate = internalWritingData[i].startingPosition[0] + internalWritingData[i].width;
                    const lowerRightyCoordinate = internalWritingData[i].startingPosition[1] + internalWritingData[i].width;
                    if ((e.clientX >= internalWritingData[i].startingPosition[0] && e.clientX <= upperLeftXCoordinate) &&
                        (e.clientY >= internalWritingData[i].startingPosition[1] && e.clientY <= lowerRightyCoordinate)
                    ) {
                        alert(`you clicked within the filled square: ${i}`);
                        return;
                    }
                    break;

                case "filled triangle":                   
                    const trianglePlotPointA = [internalWritingData[i].startingPosition[0],internalWritingData[i].startingPosition[1]];
                    const trianglePlotPointB = [internalWritingData[i].plotPoint2[0],internalWritingData[i].plotPoint2[1]];
                    const trianglePlotPointC = [internalWritingData[i].plotPoint3[0],internalWritingData[i].plotPoint3[1]];
                    const userClickPoint = [e.clientX,e.clientY];

                    if (triangleClickDetection(trianglePlotPointA, trianglePlotPointB, trianglePlotPointC, userClickPoint)) {
                        alert(`you clicked within the filled triangle: ${i}`);
                        return;
                    }
                    break;
                case "hollow triangle":                   
                    const trianglePlotA = [internalWritingData[i].startingPosition[0],internalWritingData[i].startingPosition[1]];
                    const trianglePlotB = [internalWritingData[i].plotPoint2[0],internalWritingData[i].plotPoint2[1]];
                    const trianglePlotC = [internalWritingData[i].plotPoint3[0],internalWritingData[i].plotPoint3[1]];
                    const clickPoint = [e.clientX,e.clientY];

                    if (triangleClickDetection(trianglePlotA, trianglePlotB, trianglePlotC, clickPoint)) {
                        alert(`you clicked within the hollow triangle: ${i}`);
                        return;
                    }
                    break;
                case "pen tool":
                    /*const userClick = [e.clientX,e.clientY];
                    if (pathPointDetection(userClick,internalWritingData[i].startingPosition,(internalWritingData[i].lineWidth/2))) {
                        alert(`you clicked within the hollow triangle: ${i}`);
                        return;
                    }
                    
                    for (let i = 0; i < internalWritingData[i].plotPoint2[0]; i++) {

                    }*/
                    break;

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
        newCanvas.addEventListener('mousedown',canvasTaddler);
        return (()=> { 
            newCanvas.removeEventListener('mousedown',canvasTaddler);
            canvasContainer.remove()
        });
    }
    ,[]);
    return (
        <div/>
    );
}


export default DrawingTool;