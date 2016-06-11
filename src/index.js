import p5 from 'p5'
import { last, range, unfold } from 'ramda'


const MAX_ITERATIONS = 16;

// set colors in this function
const generatePalette = () => {
  const palette1 = range(0, 16).map(i => "rgb(" + (i*8) + "," + (i*8) + "," + (128+i*4) + ")");

  // const palette2 = range(16, 64).map(i => "rgb(" + (128+i-16) + "," + (128+i-16) + "," + (192+i-16) + ")");


  // // 319 is TOTALLY a magic number in this context
  // const palette3 = range(64, MAX_ITERATIONS).map(i => "rgb(" + ((319-i)%256) + "," + ((128+(319-i)/2)%256) + "," + ((319-i)%256) + ")");

  const palette2 = [],
        palette3 = [];

  return [...palette1, ...palette2, ...palette3, "rgb(0,0,0)"];
}

const palette = generatePalette();

// (x1, y1) and (x2, y2) define that part of the complex plane that is visible
var x1 = -2.5;
var x2 = 1;
var y1 = -1;
var y2 = 1;

// width and height of visible complex plane
var cwidth = x2-x1;
var cheight = y2-y1;

const sketch = p => {
  p.setup = () => {
    p.createCanvas(500, 300);
    renderFractal();
  }

  p.mousePressed = () => {
    const mouseXCoord = (p.mouseX * 1.0 / p.width) * cwidth + x1;
    const mouseYCoord = (p.mouseY * 1.0 / p.height) * cheight + y1;

    x1 = mouseXCoord - cwidth / 8.0;
    x2 = mouseXCoord + cwidth / 8.0;
    y1 = mouseYCoord - cheight / 8.0;
    y2 = mouseYCoord + cheight / 8.0;

    cwidth /= 4.0;
    cheight /= 4.0;

    renderFractal();
  }

  const renderFractal = () => {
    for (const x of range(0, p.width)) {
      for (const y of range(0, p.height)) {
        const escapeTime = calculateEscapeTime(x, y);

        p.stroke(palette[escapeTime]);

        p.point(x,y);
      }
    }
  }

  const calculateEscapeTime = (x, y) => {
    const cReal = mapXToReal(x),
          cImg = mapYToComplex(y);

    const step = ([zReal, zImg, iteration]) => {
      if (iteration >= MAX_ITERATIONS || zReal * zReal + zImg*zImg >= 4) {
        return false;
      } else {
        const nextZReal = zReal*zReal - zImg*zImg + cReal,
              nextZImg  =  2*zReal*zImg + cImg;

        return (Math.abs(zReal - nextZReal) < Number.EPSILON) && (Math.abs(zImg - nextZImg) < Number.EPSILON) ?
          [MAX_ITERATIONS, [nextZReal, nextZImg, MAX_ITERATIONS]] :
          [iteration + 1, [nextZReal, nextZImg, iteration + 1]]
      }
    }

    return last(unfold(step, [0.0, 0.0, 0]));
  }

  // map our bitmap x coordinate to a real axis coordinate
  const mapXToReal = xcoord => cwidth * xcoord / p.width + x1;

  // map our bitmap y coordinate to an imaginary axis coordinate
  const mapYToComplex = ycoord => y1 + cheight * ycoord / p.height;
}


new p5(sketch)
