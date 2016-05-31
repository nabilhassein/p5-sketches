'use strict';

import p5 from 'p5'

const sketch = p => {
  const x = 100;
  const y = 100;

  p.setup = () => {
    p.createCanvas(window.innerWidth, window.innerHeight);
  };

  p.draw = () => {
    if (p.mouseIsPressed) {
      p.fill(0);
    } else {
      p.fill(255);
    }
    p.ellipse(p.mouseX, p.mouseY, 80, 80);
  };
};

new p5(sketch);
