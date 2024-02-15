import './style.css'
import { simplify } from 'mathjs'
import { newtonRhapson } from './roots';

// ! is a non-null assertion operator i.e. it tells the compiler that the value is not null
const canvas = document.querySelector('canvas')! as HTMLCanvasElement;
const input = document.querySelector('input')! as HTMLInputElement;
const button = document.querySelector('a')! as HTMLAnchorElement;
const axesColorInput = document.querySelector('#axes')! as HTMLInputElement;
const graphColorInput = document.querySelector('#graph')! as HTMLInputElement;


const ctx = canvas.getContext('2d')!;
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const clearCanvas = () => {
  ctx.clearRect(0, 0, width, height);
}

let curve = '';
let axesColor = '#123456';
let graphColor = 'red';

let scale = 40;
const origin = {
  x: width / 2,
  y: height / 2
};

const drawGrid = () => {
  // start from origin and draw horizontal lines
  for(let x = origin.x; x < width; x += scale) {
    ctx.beginPath();
    ctx.strokeStyle = '#919191';
    ctx.lineWidth = 1;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for(let x = origin.x; x > 0; x -= scale) {
    ctx.beginPath();
    ctx.strokeStyle = '#919191';
    ctx.lineWidth = 1;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // start from origin and draw vertical lines
  for(let y = origin.y; y < height; y += scale) {
    ctx.beginPath();
    ctx.strokeStyle = '#919191';
    ctx.lineWidth = 1;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  for(let y = origin.y; y > 0; y -= scale) {
    ctx.beginPath();
    ctx.strokeStyle = '#919191';
    ctx.lineWidth = 1;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

}

const drawAxes = () => {
  ctx.beginPath();
  ctx.strokeStyle = axesColor;
  ctx.lineWidth = 3;
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x, height);
  ctx.moveTo(0, origin.y);
  ctx.lineTo(width, origin.y);
  ctx.stroke();
}

let maxX = width/2;
let minX = -width/2;

const drawGraph = (fn: string) => {
  const simplified = simplify(fn);
  ctx.beginPath();
  ctx.strokeStyle = graphColor;
  ctx.lineWidth = 3;
  const boundary = {
    xMin: -5*scale,
    xMax: width + 5*scale,
    yMin: -5*scale,
    yMax: height + 5*scale
  }
  for (let x = minX; x <= maxX; x += 4) {
    let y = (simplified.evaluate({ x: x / scale }) * scale);
    if(isNaN(y)) {
      continue;
    }
    // If value is going out of the canvas, then skip it
    const xPos = x + origin.x;
    const yPos = -y + origin.y;
    if(xPos < boundary.xMin || xPos > boundary.xMax || yPos < boundary.yMin || yPos > boundary.yMax) {
      continue;
    }
    ctx.lineTo(xPos, yPos);
  }
  ctx.stroke();
}

// Finding root of the equation
const drawRoot = (x: number) => {
  if(isNaN(x)) {
    return;
  }
  ctx.beginPath();
  const xPos = x*scale + origin.x;
  // draw circle
  ctx.arc(xPos, origin.y, 10, 0, Math.PI * 2, true);
  ctx.fillStyle = graphColor;
  // show values of x
  ctx.font = '20px Arial';
  ctx.fillStyle = axesColor;
  ctx.fillText(`x = ${x}`, xPos + 10, origin.y + 30);
  ctx.fill();
  ctx.closePath();
}

drawGrid();
drawAxes();

button.addEventListener('click', () => {
  clearCanvas()
  drawGrid();
  drawAxes();
  curve = input.value;
  if(curve) {
    drawGraph(curve);
    drawRoot(newtonRhapson(curve, width/2));
  }
});

let ctrlDown = false;
document.addEventListener('keydown', (e) => {
  if (e.key === 'Control') {
    ctrlDown = true;
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'Control') {
    ctrlDown = false;
  }
});

// zoom in and out feature
canvas.addEventListener('wheel', (e) => {
  if (ctrlDown) {
    e.preventDefault();
    if (e.deltaY < 0) {
      scale *= 1.1;
    } else {
      scale /= 1.1;
    }
    clearCanvas()
    drawGrid();
    drawAxes();
    drawGraph(curve);
    drawRoot(newtonRhapson(curve, width/2));
  }
});

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  drawGrid();
  drawAxes();
  drawGraph(curve);
    drawRoot(newtonRhapson(curve, width/2));
});

axesColorInput.addEventListener('input', () => {
  axesColor = axesColorInput.value;
  clearCanvas()
  drawGrid();
  drawAxes();
  drawGraph(curve);
    drawRoot(newtonRhapson(curve, width/2));
});

graphColorInput.addEventListener('input', () => {
  graphColor = graphColorInput.value;
  clearCanvas()
  drawGrid();
  drawAxes();
  drawGraph(curve);
    drawRoot(newtonRhapson(curve, width/2));
});

// Drag left and right to move the graph
let mouseDown = false;
let lastX = 0;
let lastY = 0;

canvas.addEventListener('mousedown', (e) => {
  mouseDown = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

canvas.addEventListener('mouseup', () => {
  mouseDown = false;
});

canvas.addEventListener('mousemove', (e) => {
  if (mouseDown) {
    const xDiff = lastX - e.clientX;
    const yDiff = lastY - e.clientY;
    origin.x -= xDiff;
    origin.y -= yDiff;
    maxX += xDiff;
    minX += xDiff;
    lastX = e.clientX;
    lastY = e.clientY;
    clearCanvas()
    drawGrid();
    drawAxes();
    drawGraph(curve);
    drawRoot(newtonRhapson(curve, width/2));
  }
});

canvas.addEventListener('mouseleave', () => {
  mouseDown = false;
});

// double click to reset the graph
canvas.addEventListener('dblclick', () => {
  if (origin.x !== width / 2 || origin.y !== height / 2) {
    origin.x = width / 2;
    origin.y = height / 2;
    maxX = width/2;
    minX = -width/2;
    scale = 40;
    clearCanvas()
    drawGrid();
    drawAxes();
    drawGraph(curve);
    drawRoot(newtonRhapson(curve, width/2));
  }
});




