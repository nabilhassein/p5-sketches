'use strict';

import p5 from 'p5'
import { unfold } from 'ramda'


// custom classes actually implement as plain old JS objects
class Symbol {
  static symbolSize = 24;

  constructor(x, y, r, g, b) {
    return {
      character: String.fromCharCode(
        0x30A0 + Math.random() * (0x30FF-0x30A0+1) // katakana
      ),
      x,
      y,
      r,
      b,
      g,
    };
  }
}

class SymbolStream {
  static colorFadeInterval = 8;

  constructor(xStart) {
    const yStart = Math.floor(Math.random() * 130),
          streamLength = Math.floor(5 + Math.random() * 100);

    const step = ([g, b, yStart, totalSymbols]) => totalSymbols >= streamLength ? false :
          [
            new Symbol(xStart, yStart, 0, g, b),
            [g - SymbolStream.colorFadeInterval, b - SymbolStream.colorFadeInterval,
             yStart - Symbol.symbolSize, totalSymbols + 1]
          ];

    const first = new Symbol(xStart, yStart, 255, 255, 255), //1st symbol in each stream is white
          rest = unfold(step, [200 /* green */, 60 /* blue */, yStart - Symbol.symbolSize, 0]);

    return {
      symbols: [first, ...rest],
      scrollSpeed: Math.floor(5 + 5*Math.random()),
      yStart,
    };
  }
}

// stateful p5 logic
const sketch = p => {
  p.setup = () => {
    p.height = screen.availHeight;

    const width = screen.availWidth;

    p.createCanvas(width, p.height);
    p.background(0);

    const columns = new Array(Math.floor(width / Symbol.symbolSize)).fill(0).map((x, i) => i * Symbol.symbolSize);

    p.symbolStreams = columns.map(xStart => new SymbolStream(xStart));
  };

  p.draw = () => {
    p.background(0);

    for (const symbolStream of p.symbolStreams) {
      for (const symbol of symbolStream.symbols) {
        p.fill(symbol.r, symbol.g, symbol.b);
        p.textFont("Consolas");
        p.textSize(Symbol.symbolSize);
        p.text(symbol.character, symbol.x, symbol.y);

        symbol.y = symbol.y > p.height ? symbolStream.yStart : symbol.y + symbolStream.scrollSpeed;
      }
    }
  };
}

new p5(sketch)
