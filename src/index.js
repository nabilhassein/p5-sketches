'use strict';

import p5 from 'p5'
import { createStore } from 'redux'


// functional programming helper
const unfold = (step, seed) => {
  var output  = [],
      element = seed,
      result;

  while ((result = step(element)) !== null) {
    output.unshift(result[0]);
    element = result[1];
  }

  return output;
}

// state management with redux
const initialState = {
  symbols: [],
},
      reducer = (state = initialState, action) => {
        switch(action.type) {
        case 'ADD_SYMBOL_STREAM':
          return {...state, symbols: [action.symbolStream, ...state.symbols] };
        default:
          return state;
        }
      },
      store = createStore(reducer);

// custom datatypes
class Symbol {
  static symbolSize = 24;

  constructor(x, y, r, g, b) {
    this.character = String.fromCharCode(
      0x30A0 + Math.random() * (0x30FF-0x30A0+1) // katakana
    );

    this.x = x;
    this.y = y;

    this.r = r;
    this.g = g;
    this.b = b;
  }
}

class SymbolStream {
  static colorFadeInterval = 8;

  constructor(xStart) {
    const yStart = Math.floor(Math.random() * 130),
          streamLength = Math.floor(5 + Math.random() * 100);

    const step = ([g, b, yStart, totalSymbols]) => totalSymbols < streamLength ?
          [
            new Symbol(xStart, yStart, 0, g, b),
            [g - SymbolStream.colorFadeInterval, b - SymbolStream.colorFadeInterval,
             yStart - Symbol.symbolSize, totalSymbols + 1]
          ]
          : null;

    const first = new Symbol(xStart, yStart, 255, 255, 255), //1st symbol in each stream is white
          rest = unfold(step, [200 /* green */, 60 /* blue */, yStart - Symbol.symbolSize, 0]);

    return [first, ...rest];
  }
}

// main p5 logic
const sketch = p => {
  p.setup = () => {
    p.createCanvas(screen.availWidth, screen.availHeight);
    p.background(0);

    const columns = new Array(Math.floor(p.width / Symbol.symbolSize)).fill(0).map((x, i) => i * Symbol.symbolSize);

    for (const xStart of columns) {
      store.dispatch({
        type: 'ADD_SYMBOL_STREAM',
        symbolStream: new SymbolStream(xStart),
      });
    }
  };

  p.draw = () => {
    store.getState().symbols.forEach( stream => {
      stream.forEach( symbol => {
        p.fill(symbol.r, symbol.g, symbol.b);
        p.textFont("Consolas");
        p.textSize(Symbol.symbolSize);
        p.text(symbol.character, symbol.x, symbol.y);
      });
    });
  };
}

new p5(sketch)
