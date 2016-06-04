'use strict';

import p5 from 'p5'
import { createStore } from 'redux'
import { unfold } from 'ramda'


// state management with redux
const initialState = {
  symbolStreams: [],
},
      reducer = (state = initialState, action) => {
        switch(action.type) {
        case 'ADD_SYMBOL_STREAM':
          return {...state, symbolStreams: [action.symbolStream, ...state.symbolStreams] };
        case 'SCROLL_SYMBOL_STREAMS':
          const updatedSymbolStreams = state.symbolStreams.map( symbolStream => {
            const updatedSymbols = symbolStream.symbols.map(symbol => {
              return {...symbol, y: symbol.y + symbolStream.scrollSpeed}
            });

            return {...symbolStream, symbols: updatedSymbols};
          });

          return {...state, symbolStreams: updatedSymbolStreams };
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
    this.scrollSpeed = Math.floor(5 + Math.random() * 5);

    const yStart = Math.floor(Math.random() * 130),
          streamLength = Math.floor(5 + Math.random() * 100);

    const step = ([g, b, yStart, totalSymbols]) => totalSymbols < streamLength ?
          [
            new Symbol(xStart, yStart, 0, g, b),
            [g - SymbolStream.colorFadeInterval, b - SymbolStream.colorFadeInterval,
             yStart - Symbol.symbolSize, totalSymbols + 1]
          ]
          : false;

    const first = new Symbol(xStart, yStart, 255, 255, 255), //1st symbol in each stream is white
          rest = unfold(step, [200 /* green */, 60 /* blue */, yStart - Symbol.symbolSize, 0]);

    this.symbols = [first, ...rest];
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
    p.background(0);

    const symbolStreams = store.getState().symbolStreams;

    for (const symbolStream of symbolStreams) {
      for (const symbol of symbolStream.symbols) {
        p.fill(symbol.r, symbol.g, symbol.b);
        p.textFont("Consolas");
        p.textSize(Symbol.symbolSize);
        p.text(symbol.character, symbol.x, symbol.y);
      };
    };

    store.dispatch({
      type: 'SCROLL_SYMBOL_STREAMS'
    });
  };
}

new p5(sketch)
