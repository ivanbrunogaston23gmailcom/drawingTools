export const changeDrawingTargetFocus = (setDrawingTargetProps,drawingInfo) => {
    let targetProps = {}
    let maxXCoord = 0;
    let minXCoord = 0;
    let maxYCoord = 0;
    let minYCoord = 0;
    switch(drawingInfo.toolType) {
        case "ellipse":
            targetProps = {
                height: drawingInfo.radius * 2 + (drawingInfo.lineWidth/2),
                width: drawingInfo.radius * 2  + (drawingInfo.lineWidth/2),
                top: drawingInfo.startingPosition[1] - (drawingInfo.radius + drawingInfo.lineWidth/2),
                left: drawingInfo.startingPosition[0] - (drawingInfo.radius + drawingInfo.lineWidth/2),
                isVisible: true
            }
            setDrawingTargetProps(targetProps);
            break;
        case "hollow rectangle":
            targetProps = {
                height: drawingInfo.height + drawingInfo.lineWidth/2 + 3,
                width: drawingInfo.width + drawingInfo.lineWidth/2 + 3,
                top: drawingInfo.startingPosition[1] - (drawingInfo.lineWidth/2 + 1.5),
                left: drawingInfo.startingPosition[0] - (drawingInfo.lineWidth/2 + 1.5),
                isVisible: true
            }
            setDrawingTargetProps(targetProps);
            break;
        case "filled rectangle":
            targetProps = {
                height: drawingInfo.height - 2,
                width: drawingInfo.width - 2,
                top: drawingInfo.startingPosition[1],
                left: drawingInfo.startingPosition[0],
                isVisible: true
            }
            setDrawingTargetProps(targetProps);
            break;
        case "filled triangle":
            maxXCoord = Math.max(drawingInfo.startingPosition[0],drawingInfo.plotPoint2[0],drawingInfo.plotPoint3[0]);
            minXCoord = Math.min(drawingInfo.startingPosition[0],drawingInfo.plotPoint2[0],drawingInfo.plotPoint3[0]);
            maxYCoord = Math.max(drawingInfo.startingPosition[1],drawingInfo.plotPoint2[1],drawingInfo.plotPoint3[1]);
            minYCoord = Math.min(drawingInfo.startingPosition[1],drawingInfo.plotPoint2[1],drawingInfo.plotPoint3[1]);
            targetProps = {
                height: maxYCoord - minYCoord,
                width: maxXCoord - minXCoord,
                top: minYCoord,
                left: minXCoord,
                isVisible: true
            }
            setDrawingTargetProps(targetProps);
            break;
        case "hollow triangle":
            maxXCoord = Math.max(drawingInfo.startingPosition[0],drawingInfo.plotPoint2[0],drawingInfo.plotPoint3[0]);
            minXCoord = Math.min(drawingInfo.startingPosition[0],drawingInfo.plotPoint2[0],drawingInfo.plotPoint3[0]);
            maxYCoord = Math.max(drawingInfo.startingPosition[1],drawingInfo.plotPoint2[1],drawingInfo.plotPoint3[1]);
            minYCoord = Math.min(drawingInfo.startingPosition[1],drawingInfo.plotPoint2[1],drawingInfo.plotPoint3[1]);
            targetProps = {
                height: maxYCoord - minYCoord,
                width: maxXCoord - minXCoord,
                top: minYCoord  - drawingInfo.lineWidth/2 - 1.5,
                left: minXCoord  + drawingInfo.lineWidth/2 - 1.5,
                isVisible: true
            }
            setDrawingTargetProps(targetProps);           
            break;
        case "pen tool":
            maxXCoord = drawingInfo.startingPosition[0];
            minXCoord = drawingInfo.startingPosition[0];
            maxYCoord = drawingInfo.startingPosition[1];
            minYCoord = drawingInfo.startingPosition[1];

            for (let i = 0; i < drawingInfo.plotPoints.length; i++) {
                maxXCoord = Math.max(maxXCoord,drawingInfo.plotPoints[i].xCoordinate);
                minXCoord = Math.min(minXCoord,drawingInfo.plotPoints[i].xCoordinate);
                maxYCoord = Math.max(maxYCoord,drawingInfo.plotPoints[i].yCoordinate);
                minYCoord = Math.min(minYCoord,drawingInfo.plotPoints[i].yCoordinate);
            }          
            targetProps = {
                height: maxYCoord - minYCoord,
                width: maxXCoord - minXCoord,
                top: minYCoord  - drawingInfo.lineWidth/2 - 1.5,
                left: minXCoord  + drawingInfo.lineWidth/2 - 1.5,
                isVisible: true
            }
            setDrawingTargetProps(targetProps);  

            break;
        default:
            targetProps = {
                height: 1,
                width: 1,
                top: 0,
                left: 0,
                isVisible: false
            }
            setDrawingTargetProps(targetProps);
            break;
    }
}




/* 
        switch (internalWritingData[i].toolType) {
            case "ellipse":
                const xSide = Math.abs(e.offsetX - internalWritingData[i].startingPosition[0]);
                const ySide = Math.abs(e.offsetY - internalWritingData[i].startingPosition[1]);
                const hypotenuse = Math.sqrt(xSide * xSide + ySide * ySide);
                if (hypotenuse <= (internalWritingData[i].radius + internalWritingData[i].lineWidth - 5)) {
                    return i;
                }
                break;
            case "hollow rectangle":
                const upperLeftXCoord = internalWritingData[i].startingPosition[0] + internalWritingData[i].width + internalWritingData[i].lineWidth - 3;
                const lowerRightyCoord = internalWritingData[i].startingPosition[1] + internalWritingData[i].width + internalWritingData[i].lineWidth - 3;
                if ((e.offsetX >= internalWritingData[i].startingPosition[0] && e.offsetX <= upperLeftXCoord) &&
                    (e.offsetY >= internalWritingData[i].startingPosition[1] && e.offsetY <= lowerRightyCoord)
                ) {
                    return i;
                }
                break;

            case "filled rectangle":
                const upperLeftXCoordinate = internalWritingData[i].startingPosition[0] + internalWritingData[i].width;
                const lowerRightyCoordinate = internalWritingData[i].startingPosition[1] + internalWritingData[i].width;
                if ((e.offsetX >= internalWritingData[i].startingPosition[0] && e.offsetX <= upperLeftXCoordinate) &&
                    (e.offsetY >= internalWritingData[i].startingPosition[1] && e.offsetY <= lowerRightyCoordinate)
                ) {
                    return i;
                }
                break;

            case "filled triangle":                   
                const trianglePlotPointA = [internalWritingData[i].startingPosition[0],internalWritingData[i].startingPosition[1]];
                const trianglePlotPointB = [internalWritingData[i].plotPoint2[0],internalWritingData[i].plotPoint2[1]];
                const trianglePlotPointC = [internalWritingData[i].plotPoint3[0],internalWritingData[i].plotPoint3[1]];
                const userClickPoint = [e.offsetX,e.offsetY];

                if (triangleClickDetection(trianglePlotPointA, trianglePlotPointB, trianglePlotPointC, userClickPoint)) {
                    return i;
                }
                break;
            case "hollow triangle":                   
                const trianglePlotA = [internalWritingData[i].startingPosition[0],internalWritingData[i].startingPosition[1]];
                const trianglePlotB = [internalWritingData[i].plotPoint2[0],internalWritingData[i].plotPoint2[1]];
                const trianglePlotC = [internalWritingData[i].plotPoint3[0],internalWritingData[i].plotPoint3[1]];
                const clickPoint = [e.offsetX,e.offsetY];

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


*/

/*
export const writingData = [
    {
        toolType: "filled rectangle",
        color: "red",
        startingPosition: [0,0],
        width: 200,
        height: 200
    },
    {
        toolType: "filled rectangle",
        color: "black",
        startingPosition: [201,201],
        width: 300,
        height: 300
    },
    {
        toolType: "hollow rectangle",
        color: "green",
        lineWidth: 10,
        startingPosition: [0,510],
        width: 300,
        height: 300
    },
    {
        toolType: "ellipse",
        color: "purple",
        lineWidth: 10,
        startingPosition: [700,510],
        radius: 150,
    },
    {
        toolType: "hollow triangle",
        color: "orange",
        lineWidth: 10,
        startingPosition: [500,0],
        plotPoint2: [300,300],
        plotPoint3: [600,200]
    },
    {
        toolType: "filled triangle",
        color: "yellow",
        lineWidth: 10,
        startingPosition: [0,201],
        plotPoint2: [0,450],
        plotPoint3: [200,450]
    },
    {
        toolType: "pen tool",
        color: "brown",
        lineWidth: 10,
        startingPosition: [0,201],
        plotPoints: [
            
            {
                xCoordinate: 500,
                yCoordinate: 300
            },
            {
                xCoordinate: 500,
                yCoordinate: 600
            },
            {
                xCoordinate: 0,
                yCoordinate: 20
            }
        ],
    }

];
*/