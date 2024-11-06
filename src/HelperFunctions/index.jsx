export const addStroke = (canvasReference,strokeInfo) => {
    const ctx = canvasReference.getContext("2d");
    switch (strokeInfo.toolType){        
        case 'filled rectangle':            
            ctx.fillStyle = strokeInfo.color;
            ctx.fillRect(strokeInfo.startingPosition[0],strokeInfo.startingPosition[1],strokeInfo.width,strokeInfo.height);
            break;
        case 'hollow rectangle':
            ctx.strokeStyle = strokeInfo.color;
            ctx.lineWidth = strokeInfo.lineWidth;
            ctx.strokeRect(strokeInfo.startingPosition[0],strokeInfo.startingPosition[1],strokeInfo.width,strokeInfo.height);
            break;
        case 'ellipse':
            ctx.strokeStyle = strokeInfo.color;
            ctx.beginPath();
            ctx.lineWidth = strokeInfo.lineWidth;
            //ctx.ellipse(strokeInfo.startingPosition[0], strokeInfo.startingPosition[1], strokeInfo.radius, strokeInfo.radius,180, 0,0);
            ctx.ellipse(strokeInfo.startingPosition[0], strokeInfo.startingPosition[1], strokeInfo.radius, strokeInfo.radius, Math.PI / 4, 0, 2 * Math.PI);
        break;
        case 'hollow triangle':
            ctx.strokeStyle = strokeInfo.color;
            ctx.fillStyle = strokeInfo.color;
            ctx.beginPath();
            ctx.lineWidth = strokeInfo.lineWidth;
            //ctx.ellipse(strokeInfo.startingPosition[0], strokeInfo.startingPosition[1], strokeInfo.radius, strokeInfo.radius,180, 0,0);
            ctx.moveTo(strokeInfo.startingPosition[0], strokeInfo.startingPosition[1]);
            ctx.lineTo(strokeInfo.plotPoint2[0],strokeInfo.plotPoint2[1]);
            ctx.lineTo(strokeInfo.plotPoint3[0],strokeInfo.plotPoint3[1]);
            ctx.lineTo(strokeInfo.startingPosition[0], strokeInfo.startingPosition[1]);
        break;
        case 'filled triangle':
            ctx.strokeStyle = strokeInfo.color;
            ctx.fillStyle = strokeInfo.color;
            ctx.beginPath();
            ctx.lineWidth = strokeInfo.lineWidth;
            //ctx.ellipse(strokeInfo.startingPosition[0], strokeInfo.startingPosition[1], strokeInfo.radius, strokeInfo.radius,180, 0,0);
            ctx.moveTo(strokeInfo.startingPosition[0], strokeInfo.startingPosition[1]);
            ctx.lineTo(strokeInfo.plotPoint2[0],strokeInfo.plotPoint2[1]);
            ctx.lineTo(strokeInfo.plotPoint3[0],strokeInfo.plotPoint3[1]);
            ctx.lineTo(strokeInfo.startingPosition[0], strokeInfo.startingPosition[1]);
            ctx.fill();
        break;
        case 'pen tool':
            ctx.strokeStyle = strokeInfo.color;
            ctx.fillStyle = strokeInfo.color;
            ctx.beginPath();
            ctx.lineWidth = strokeInfo.lineWidth;
            ctx.moveTo(strokeInfo.startingPosition[0], strokeInfo.startingPosition[1]);
            for (let i = 0; i < strokeInfo.plotPoints.length; i++) {
                ctx.lineTo(strokeInfo.plotPoints[i].xCoordinate,strokeInfo.plotPoints[i].yCoordinate);
            }
        break;
        default:
            alert(`invalid drawing tool ${strokeInfo.toolType}`);
    }
    ctx.stroke();
    return ctx;
}

export const getTriangleArea = (point1, point2, point3) => {
    const sideA = Math.sqrt(Math.abs(point1[0] - point2[0]) ** 2 + Math.abs(point1[1] - point2[1]) ** 2);
    const sideB = Math.sqrt(Math.abs(point2[0] - point3[0]) ** 2 + Math.abs(point2[1] - point3[1]) ** 2);
    const sideC = Math.sqrt(Math.abs(point3[0] - point1[0]) ** 2 + Math.abs(point3[1] - point1[1]) ** 2);

    /*Heron's Formula for triangle area from the sides of a triangle*/
    const area = 0.25 * Math.sqrt((sideA + sideB + sideC) * (sideB + sideC - sideA) * (sideA + sideC - sideB) * (sideA + sideB - sideC));
    return area;
}

export const triangleClickDetection = (trianglePointA, trianglePointB, trianglePointC, clickPoint) => {
    const targetTriangleArea = getTriangleArea(trianglePointA, trianglePointB, trianglePointC);
    const fractionalTriangleArea1 = getTriangleArea(clickPoint,trianglePointA,trianglePointB);
    const fractionalTriangleArea2 = getTriangleArea(clickPoint,trianglePointA,trianglePointC);
    const fractionalTriangleArea3 = getTriangleArea(clickPoint,trianglePointB,trianglePointC);
    const fractionalAreaSum = fractionalTriangleArea1 + fractionalTriangleArea2 + fractionalTriangleArea3;
    if (Math.round(fractionalAreaSum) === Math.round(targetTriangleArea)) {
        return true;
    }
    return false;

}

export const pathPointDetection = (e, pathPoints, tolerance) => {
    if (pathPoints.length === 0) {
        return false;
    }
    if (pathPoints.length === 1) {
        return lineClickDetection(e,pathPoints[0], pathPoints[0], tolerance);
    }

    for (let i = 1; i < pathPoints.length ; i++){
        const lineClickResult = lineClickDetection(e,pathPoints[i-1], pathPoints[i], tolerance);
        if (lineClickResult === true){
            return true;
        }
    }
    return false;
}

export const lineClickDetection =(e,pathPointOne, pathPointTwo, tolerance)=> {
    if (pathPointOne.xCoordinate === pathPointTwo.xCoordinate) {
        if (pathPointOne.yCoordinate === pathPointTwo.yCoordinate) {
            const xSide = Math.abs(e.offsetX
 - pathPointOne.xCoordinate);
            const ySide = Math.abs(e.offsetY
 - pathPointOne.yCoordinate);
            const hypotenuse = Math.sqrt(xSide * xSide + ySide * ySide);  
            if(hypotenuse <= tolerance) {
                return true;
            }
        }
        if (
            e.offsetX
 >= pathPointOne.xCoordinate - tolerance &&
            e.offsetX
 <= pathPointOne.xCoordinate + tolerance &&
            e.offsetY
 >= Math.min(pathPointOne.yCoordinate,pathPointTwo.yCoordinate) - tolerance &&
            e.offsetY
 <= Math.max(pathPointOne.yCoordinate,pathPointTwo.yCoordinate) + tolerance
        ) {
            return true;
        }
        return false;
    }

    if (
        e.offsetX
 > Math.max(pathPointOne.xCoordinate,pathPointTwo.xCoordinate) + tolerance ||
        e.offsetX
 < Math.min(pathPointOne.xCoordinate,pathPointTwo.xCoordinate) - tolerance
    ) {
        return false;
    }

    const furthestLeftLinePoint = (pathPointOne.xCoordinate <= pathPointTwo.xCoordinate) ? pathPointOne : pathPointTwo;
    const furthestRightLinePoint = (pathPointOne.xCoordinate > pathPointTwo.xCoordinate) ? pathPointOne : pathPointTwo;
    const lineSlope = ((furthestLeftLinePoint.yCoordinate - furthestRightLinePoint.yCoordinate)/(furthestLeftLinePoint.xCoordinate - furthestRightLinePoint.xCoordinate));
    const yIntercept = furthestLeftLinePoint.yCoordinate - lineSlope * furthestLeftLinePoint.xCoordinate;
    const lineMeasurePoint = lineSlope * e.offsetX
 + yIntercept;
    if (e.offsetY
 >= lineMeasurePoint - tolerance && e.offsetY
 <= lineMeasurePoint + tolerance) {
        return true;
    }
    return false;
}


export const clickDetection = (e,internalWritingData) => {
    let clickedObjectIndex = -1;
    for (let i = (internalWritingData.length - 1); i >= 0; i--) {
        switch (internalWritingData[i].toolType) {
            case "ellipse":
                const xSide = Math.abs(e.offsetX
 - internalWritingData[i].startingPosition[0]);
                const ySide = Math.abs(e.offsetY
 - internalWritingData[i].startingPosition[1]);
                const hypotenuse = Math.sqrt(xSide * xSide + ySide * ySide);
                if (hypotenuse <= (internalWritingData[i].radius + internalWritingData[i].lineWidth - 5)) {
                    return i;
                }
                break;
            case "hollow rectangle":
                const upperLeftXCoord = internalWritingData[i].startingPosition[0] + internalWritingData[i].width + internalWritingData[i].lineWidth - 3;
                const lowerRightyCoord = internalWritingData[i].startingPosition[1] + internalWritingData[i].width + internalWritingData[i].lineWidth - 3;
                if ((e.offsetX
 >= internalWritingData[i].startingPosition[0] && e.offsetX
 <= upperLeftXCoord) &&
                    (e.offsetY
 >= internalWritingData[i].startingPosition[1] && e.offsetY
 <= lowerRightyCoord)
                ) {
                    return i;
                }
                break;

            case "filled rectangle":
                const upperLeftXCoordinate = internalWritingData[i].startingPosition[0] + internalWritingData[i].width;
                const lowerRightyCoordinate = internalWritingData[i].startingPosition[1] + internalWritingData[i].width;
                if ((e.offsetX
 >= internalWritingData[i].startingPosition[0] && e.offsetX
 <= upperLeftXCoordinate) &&
                    (e.offsetY
 >= internalWritingData[i].startingPosition[1] && e.offsetY
 <= lowerRightyCoordinate)
                ) {
                    return i;
                }
                break;

            case "filled triangle":                   
                const trianglePlotPointA = [internalWritingData[i].startingPosition[0],internalWritingData[i].startingPosition[1]];
                const trianglePlotPointB = [internalWritingData[i].plotPoint2[0],internalWritingData[i].plotPoint2[1]];
                const trianglePlotPointC = [internalWritingData[i].plotPoint3[0],internalWritingData[i].plotPoint3[1]];
                const userClickPoint = [e.offsetX
,e.offsetY
];

                if (triangleClickDetection(trianglePlotPointA, trianglePlotPointB, trianglePlotPointC, userClickPoint)) {
                    return i;
                }
                break;
            case "hollow triangle":                   
                const trianglePlotA = [internalWritingData[i].startingPosition[0],internalWritingData[i].startingPosition[1]];
                const trianglePlotB = [internalWritingData[i].plotPoint2[0],internalWritingData[i].plotPoint2[1]];
                const trianglePlotC = [internalWritingData[i].plotPoint3[0],internalWritingData[i].plotPoint3[1]];
                const clickPoint = [e.offsetX
,e.offsetY
];

                if (triangleClickDetection(trianglePlotA, trianglePlotB, trianglePlotC, clickPoint)) {
                    return i;
                }
                break;
            case "pen tool":
                const pathPoints = [];
                const startingPath = {
                    xCoordinate: internalWritingData[i].startingPosition[0],
                    yCoordinate: internalWritingData[i].startingPosition[1]
                }
                pathPoints.push(startingPath,...internalWritingData[i].plotPoints);
                if (pathPointDetection(e, pathPoints, internalWritingData[i].lineWidth/2)){
                    return i;
                }       
                break;
            default:
                break;
        } 
    }
    return clickedObjectIndex;
}


export const handleDrag = (dragOffset,selectedShape,internalWritingData) => {
    let writingData = internalWritingData;

    switch (writingData[selectedShape].toolType){        
        case 'filled rectangle':            
        case 'hollow rectangle':
        case 'ellipse':
            writingData[selectedShape].startingPosition[0] = writingData[selectedShape].startingPosition[0] + dragOffset.xCoordinate;
            writingData[selectedShape].startingPosition[1] = writingData[selectedShape].startingPosition[1] + dragOffset.yCoordinate;
            break;
        case 'hollow triangle':
        case 'filled triangle':
        writingData[selectedShape].startingPosition[0] = writingData[selectedShape].startingPosition[0] + dragOffset.xCoordinate;
        writingData[selectedShape].startingPosition[1] = writingData[selectedShape].startingPosition[1] + dragOffset.yCoordinate;
        writingData[selectedShape].plotPoint2[0] = writingData[selectedShape].plotPoint2[0] + dragOffset.xCoordinate;
        writingData[selectedShape].plotPoint2[1] = writingData[selectedShape].plotPoint2[1] + dragOffset.yCoordinate;
        writingData[selectedShape].plotPoint3[0] = writingData[selectedShape].plotPoint3[0] + dragOffset.xCoordinate;
        writingData[selectedShape].plotPoint3[1] = writingData[selectedShape].plotPoint3[1] + dragOffset.yCoordinate;
        break;
        case 'pen tool':
            writingData[selectedShape].startingPosition[0] = writingData[selectedShape].startingPosition[0] + dragOffset.xCoordinate;
            writingData[selectedShape].startingPosition[1] = writingData[selectedShape].startingPosition[1] + dragOffset.yCoordinate;
            for (let i = 0; i < writingData[selectedShape].plotPoints.length; i++ ) {
                writingData[selectedShape].plotPoints[i].xCoordinate = writingData[selectedShape].plotPoints[i].xCoordinate + dragOffset.xCoordinate;
                writingData[selectedShape].plotPoints[i].yCoordinate = writingData[selectedShape].plotPoints[i].yCoordinate + dragOffset.yCoordinate;
            }
        break;
        default:
           // alert(`invalid drawing tool ${strokeInfo.toolType}`);
    }
};

export const strechImage = (movementOffset, selectedShape, internalWritingData, fromDirection = "from above") => {
    switch (internalWritingData[selectedShape].toolType){        
        case 'filled rectangle':            
        case 'hollow rectangle':
            if (fromDirection === "from above") {
                internalWritingData[selectedShape].startingPosition[1] = internalWritingData[selectedShape].startingPosition[1] + movementOffset.yCoordinate;
                internalWritingData[selectedShape].height = internalWritingData[selectedShape].height - movementOffset.yCoordinate;
            }
            if (fromDirection === "from below") {
                internalWritingData[selectedShape].height = internalWritingData[selectedShape].height + movementOffset.yCoordinate;
            }
        case 'ellipse':
            break;
        case 'hollow triangle':
        case 'filled triangle':
            const maxXBeforeStretch = Math.max(internalWritingData[selectedShape].startingPosition[0], internalWritingData[selectedShape].plotPoint2[0],internalWritingData[selectedShape].plotPoint3[0]);
            const minXBeforeStretch = Math.min(internalWritingData[selectedShape].startingPosition[0], internalWritingData[selectedShape].plotPoint2[0],internalWritingData[selectedShape].plotPoint3[0]);
            const maxYBeforeStretch = Math.max(internalWritingData[selectedShape].startingPosition[1], internalWritingData[selectedShape].plotPoint2[1],internalWritingData[selectedShape].plotPoint3[1]);
            const minYBeforeStretch = Math.min(internalWritingData[selectedShape].startingPosition[1], internalWritingData[selectedShape].plotPoint2[1],internalWritingData[selectedShape].plotPoint3[1]);
            
            /*const heightBeforeStretch = maxYBeforeStretch - minYBeforeStretch;
            const widthBeforeStretch = maxXBeforeStretch - minXBeforeStretch;

            const tester = {
                maxXBeforeStretch: maxXBeforeStretch,
                minXBeforeStretch: minXBeforeStretch,
                maxYBeforeStretch: maxYBeforeStretch,
                minYBeforeStretch: minYBeforeStretch,
                heightBeforeStretch:heightBeforeStretch,
                widthBeforeStretch:widthBeforeStretch,
                fullShapeData: internalWritingData[selectedShape]
            }
            console.log(tester);*/
            if (fromDirection === "from above") {
                internalWritingData[selectedShape].startingPosition[1] = stretchScalingFunction(internalWritingData[selectedShape].startingPosition[1], maxYBeforeStretch,minYBeforeStretch,movementOffset.yCoordinate, fromDirection);
                internalWritingData[selectedShape].plotPoint2[1] = stretchScalingFunction(internalWritingData[selectedShape].plotPoint2[1], maxYBeforeStretch,minYBeforeStretch,movementOffset.yCoordinate, fromDirection);
                internalWritingData[selectedShape].plotPoint3[1] = stretchScalingFunction(internalWritingData[selectedShape].plotPoint3[1], maxYBeforeStretch,minYBeforeStretch,movementOffset.yCoordinate, fromDirection);
            }
            if (fromDirection === "from below") {
                //internalWritingData[selectedShape].height = internalWritingData[selectedShape].height + movementOffset.yCoordinate;
            }
        break;
        case 'pen tool':
        break;
        default:
           // alert(`invalid drawing tool ${strokeInfo.toolType}`);
    }
}

export const strechSideways = (movementOffset,selectedShape,internalWritingData, fromDirection = "from left") => {
    switch (internalWritingData[selectedShape].toolType){        
        case 'filled rectangle':            
        case 'hollow rectangle':
            if (fromDirection === "from left") {
                internalWritingData[selectedShape].startingPosition[0] = internalWritingData[selectedShape].startingPosition[0] + movementOffset.xCoordinate;
                internalWritingData[selectedShape].width = internalWritingData[selectedShape].width - movementOffset.xCoordinate;
            }
            if (fromDirection === "from right") {
                //internalWritingData[selectedShape].startingPosition[0] = internalWritingData[selectedShape].startingPosition[0] + movementOffset.xCoordinate;
                internalWritingData[selectedShape].width = internalWritingData[selectedShape].width + movementOffset.xCoordinate;
            }
        case 'ellipse':
            break;
        case 'hollow triangle':
        case 'filled triangle':
        break;
        case 'pen tool':
        break;
        default:
           // alert(`invalid drawing tool ${strokeInfo.toolType}`);
    }
}


const stretchScalingFunction = (pointToBeScaled, maxValueBeforeStretch,minValueBeforeStretch,stretchAmount, direction = "from above") => {
    
    let scaledValue = pointToBeScaled;
    if (direction === "from above"){
        if (pointToBeScaled === minValueBeforeStretch) {
            scaledValue = pointToBeScaled + stretchAmount;
        }        
        if (pointToBeScaled === maxValueBeforeStretch) {
            scaledValue = pointToBeScaled;
        } 
        if (pointToBeScaled !== minValueBeforeStretch && pointToBeScaled !== maxValueBeforeStretch) {
            const percentageOfMax = (pointToBeScaled - minValueBeforeStretch)/(maxValueBeforeStretch - minValueBeforeStretch);            
            if (pointToBeScaled + (percentageOfMax * stretchAmount) > minValueBeforeStretch) {
                scaledValue = pointToBeScaled + (percentageOfMax * stretchAmount);
            }
        }
    }
    return scaledValue;
}