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