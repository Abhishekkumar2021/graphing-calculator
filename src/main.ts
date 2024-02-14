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

let curve = '';
let axesColor = 'white';
let graphColor = 'yellow';

let scale = 40;
const origin = {
  x: width / 2,
  y: height / 2
}

const drawGrid = () => {
  // start from origin and draw horizontal lines
  for(let x = origin.x; x < width; x += scale) {
    ctx.beginPath();
    ctx.strokeStyle = '#3c3c3c';
    ctx.lineWidth = 1;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for(let x = origin.x; x > 0; x -= scale) {
    ctx.beginPath();
    ctx.strokeStyle = '#3c3c3c';
    ctx.lineWidth = 1;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // start from origin and draw vertical lines
  for(let y = origin.y; y < height; y += scale) {
    ctx.beginPath();
    ctx.strokeStyle = '#3c3c3c';
    ctx.lineWidth = 1;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  for(let y = origin.y; y > 0; y -= scale) {
    ctx.beginPath();
    ctx.strokeStyle = '#3c3c3c';
    ctx.lineWidth = 1;
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

}

const drawAxes = () => {
  ctx.beginPath();
  ctx.strokeStyle = axesColor;
  ctx.lineWidth = 2;
  ctx.moveTo(origin.x, 0);
  ctx.lineTo(origin.x, height);
  ctx.moveTo(0, origin.y);
  ctx.lineTo(width, origin.y);
  ctx.stroke();
}

const drawGraph = (fn: string) => {
  const simplified = simplify(fn);
  ctx.beginPath();
  ctx.strokeStyle = graphColor;
  ctx.lineWidth = 2;
  for (let x = -width; x < width; x += 0.1) {
    const y = simplified.evaluate({ x: x / scale }) * scale;
    ctx.lineTo(x + origin.x, -y + origin.y);
  }
  ctx.stroke();
}

drawGrid();
drawAxes();

button.addEventListener('click', () => {
  ctx.clearRect(0, 0, width, height);
  drawGrid();
  drawAxes();
  curve = input.value;
  if(curve) {
    drawGraph(curve);
  }
});

// zoom in and out feature
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  if (e.deltaY < 0) {
    scale *= 1.1;
  } else {
    scale /= 1.1;
  }
  ctx.clearRect(0, 0, width, height);
  drawGrid();
  drawAxes();
  drawGraph(curve);
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
  ctx.clearRect(0, 0, width, height);
  drawGrid();
  drawAxes();
  drawGraph(curve);
});

graphColorInput.addEventListener('input', () => {
  graphColor = graphColorInput.value;
  ctx.clearRect(0, 0, width, height);
  drawGrid();
  drawAxes();
  drawGraph(curve);
});