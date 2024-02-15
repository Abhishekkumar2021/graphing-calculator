import './style.css'
import { simplify } from 'mathjs'
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
  for (let x = minX; x < maxX; x += 5) {
    const y = simplified.evaluate({ x: x / scale }) * scale;
    ctx.lineTo(x + origin.x, -y + origin.y);
  }
  ctx.stroke();
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
  }
});

window.addEventListener('resize', () => {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  drawGrid();
  drawAxes();
  drawGraph(curve);
});

axesColorInput.addEventListener('input', () => {
  axesColor = axesColorInput.value;
  clearCanvas()
  drawGrid();
  drawAxes();
  drawGraph(curve);
});

graphColorInput.addEventListener('input', () => {
  graphColor = graphColorInput.value;
  clearCanvas()
  drawGrid();
  drawAxes();
  drawGraph(curve);
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
  }
});

canvas.addEventListener('mouseleave', () => {
  mouseDown = false;
});

// double click to reset the graph
canvas.addEventListener('dblclick', () => {
  origin.x = width / 2;
  origin.y = height / 2;
  maxX = width/2;
  minX = -width/2;
  scale = 40;
  clearCanvas()
  drawGrid();
  drawAxes();
  drawGraph(curve);
});
