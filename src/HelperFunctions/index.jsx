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
    }
    ctx.stroke();
    return ctx;
}

export const getTriangleArea = (point1, point2, point3) => {
    const checkObject = {
        point1: point1,
        point2: point2,
        point3: point3,
    }
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

export const pathPointDetection = (clickPoint, pathPoint, tolerance) => {

    const xSide = Math.abs(clickPoint[0] - pathPoint[0]);
    const ySide = Math.abs(clickPoint[1] - pathPoint[1]);

    const hypotenuse = Math.sqrt(xSide * xSide + ySide * ySide);

    if(hypotenuse <= tolerance) {
        return true;
    }
    return false;
}



export const clickDetection = (e,internalWritingData) => {
    let clickedObjectIndex = -1;
    for (let i = (internalWritingData.length - 1); i >= 0; i--) {
        switch (internalWritingData[i].toolType) {
            case "ellipse":
                const xSide = Math.abs(e.clientX - internalWritingData[i].startingPosition[0]);
                const ySide = Math.abs(e.clientY - internalWritingData[i].startingPosition[1]);
                const hypotenuse = Math.sqrt(xSide * xSide + ySide * ySide);
                if (hypotenuse <= (internalWritingData[i].radius + internalWritingData[i].lineWidth - 5)) {
                    clickedObjectIndex = i;
                }
                break;
            case "hollow rectangle":
                const upperLeftXCoord = internalWritingData[i].startingPosition[0] + internalWritingData[i].width + internalWritingData[i].lineWidth - 3;
                const lowerRightyCoord = internalWritingData[i].startingPosition[1] + internalWritingData[i].width + internalWritingData[i].lineWidth - 3;
                if ((e.clientX >= internalWritingData[i].startingPosition[0] && e.clientX <= upperLeftXCoord) &&
                    (e.clientY >= internalWritingData[i].startingPosition[1] && e.clientY <= lowerRightyCoord)
                ) {
                    clickedObjectIndex = i;
                }
                break;

            case "filled rectangle":
                const upperLeftXCoordinate = internalWritingData[i].startingPosition[0] + internalWritingData[i].width;
                const lowerRightyCoordinate = internalWritingData[i].startingPosition[1] + internalWritingData[i].width;
                if ((e.clientX >= internalWritingData[i].startingPosition[0] && e.clientX <= upperLeftXCoordinate) &&
                    (e.clientY >= internalWritingData[i].startingPosition[1] && e.clientY <= lowerRightyCoordinate)
                ) {
                    clickedObjectIndex = i;
                }
                break;

            case "filled triangle":                   
                const trianglePlotPointA = [internalWritingData[i].startingPosition[0],internalWritingData[i].startingPosition[1]];
                const trianglePlotPointB = [internalWritingData[i].plotPoint2[0],internalWritingData[i].plotPoint2[1]];
                const trianglePlotPointC = [internalWritingData[i].plotPoint3[0],internalWritingData[i].plotPoint3[1]];
                const userClickPoint = [e.clientX,e.clientY];

                if (triangleClickDetection(trianglePlotPointA, trianglePlotPointB, trianglePlotPointC, userClickPoint)) {
                    clickedObjectIndex = i;
                }
                break;
            case "hollow triangle":                   
                const trianglePlotA = [internalWritingData[i].startingPosition[0],internalWritingData[i].startingPosition[1]];
                const trianglePlotB = [internalWritingData[i].plotPoint2[0],internalWritingData[i].plotPoint2[1]];
                const trianglePlotC = [internalWritingData[i].plotPoint3[0],internalWritingData[i].plotPoint3[1]];
                const clickPoint = [e.clientX,e.clientY];

                if (triangleClickDetection(trianglePlotA, trianglePlotB, trianglePlotC, clickPoint)) {
                    clickedObjectIndex = i;
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
                clickedObjectIndex = 0;
                break;
        } 
    }
    return clickedObjectIndex;
}
