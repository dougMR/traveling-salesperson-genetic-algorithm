const canvas = document.querySelector("canvas#drawing-board");
const ctx = canvas.getContext("2d");
const canvas2 = document.querySelector("canvas#drawing-board-2");
const ctx2 = canvas2.getContext("2d");

const drawPath = (points, myctx = ctx) => {
    //  console.log('drawPath()',points);
    for (let p = 0; p < points.length - 1; p++) {
        drawPoint(points[p], myctx);
        drawLine(points[p], points[p + 1], myctx);
    }
    drawPoint(points[points.length-1], myctx);
};

const drawPoint = (point, myctx = ctx) => {
    myctx.beginPath();
    const x = point.x * canvasScale;
    const y = point.y * canvasScale;
    const r = 2 * canvasScale;
    myctx.arc(x, y, r, 0, 2 * Math.PI);
    myctx.stroke();
};

const drawLine = (p1, p2, myctx = ctx) => {
    myctx.beginPath();
    const x1 = p1.x * canvasScale;
    const y1 = p1.y * canvasScale;
    const x2 = p2.x * canvasScale;
    const y2 = p2.y * canvasScale;
    myctx.moveTo(x1, y1);
    myctx.lineTo(x2, y2);
    myctx.stroke();
};

const drawPointsNumbers = (points, myctx = ctx) => {
    for(let p = 0; p < points.length; p++){
        drawNumber(p, points[p], myctx);
    }
}
const drawNumber = (num, point, myctx = ctx) => {
    myctx.fillStyle = 'black';
    myctx.font = '16px sans-serif';
    const x = (point.x-5) * canvasScale;
    const y = (point.y-5)*canvasScale;
    myctx.fillText(num, x, y);
}

const setLineColor = (color, myctx = ctx) => {
    myctx.strokeStyle = color;
}

const setFillColor = (color, myctx = ctx) => {
    myctx.fillStyle = color;
}


const setLineWeight = (weight, myctx = ctx) => {
    // ctx.lineWidth = weight;
    myctx.lineWidth = weight;
}

const clearCanvas = (myctx = ctx) => {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    myctx.fillStyle = "#fafafa";
    myctx.fillRect(0, 0, canvas.width, canvas.height);
    // 2nd canvas
    // ctx2.fillStyle = "#fafafa";
    // ctx2.fillRect(0, 0, canvas.width, canvas.height);
}