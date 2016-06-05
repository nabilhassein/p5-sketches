'use strict';

import p5 from 'p5'
import { createStore } from 'redux'
import { unfold } from 'ramda'
import { List, Map } from 'immutable'

// state management
const initialState = Map({
  symbolStreams: List([]),
  height: 0,
}),
      reducer = (state = initialState, action) => {
        switch(action.type) {
        case 'SET_GLOBAL_HEIGHT':
          return state.set('height', action.height);

        case 'ADD_SYMBOL_STREAM':
          return state.update('symbolStreams', streams => streams.push(action.symbolStream));

        case 'SCROLL_SYMBOL_STREAMS':
          // setAll/updateAll functions would be nice for nested Map/List combinations...
          const updatedSymbolStreams = state.get('symbolStreams').map(symbolStream => {
            return symbolStream.set('symbols', symbolStream.get('symbols').map(symbol => {
              return symbol.update('y', y => y > state.get('height') ? symbolStream.get('yStart') : y + symbolStream.get('scrollSpeed')
              )
            }));
          });

          return state.set('symbolStreams', updatedSymbolStreams);

        default:
          return state;
        }
      },
      store = createStore(reducer);

// custom classes, actually implemented as Immutable.js Maps
class Symbol {
  static symbolSize = 24;

  constructor(x, y, r, g, b) {
    return Map({
      character: String.fromCharCode(
        0x30A0 + Math.random() * (0x30FF-0x30A0+1) // katakana
      ),
      x,
      y,
      r,
      b,
      g,
    });
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

    return Map({
      symbols: List([first, ...rest]),
      scrollSpeed: Math.floor(5 + 5*Math.random()),
      yStart,
    });
  }
}

// main p5 logic
const sketch = p => {
  p.setup = () => {
    const height = screen.availHeight,
          width = screen.availWidth;

    p.createCanvas(width, height);
    p.background(0);

    const columns = new Array(Math.floor(width / Symbol.symbolSize)).fill(0).map((x, i) => i * Symbol.symbolSize);

    store.dispatch({
      type: 'SET_GLOBAL_HEIGHT',
      height
    });

    for (const xStart of columns) {
      store.dispatch({
        type: 'ADD_SYMBOL_STREAM',
        symbolStream: new SymbolStream(xStart),
      });
    }
  };

  p.draw = () => {
    p.background(0);

    store.getState().get('symbolStreams').forEach(symbolStream => {
      symbolStream.get('symbols').forEach( symbol => {
        p.fill(symbol.get('r'), symbol.get('g'), symbol.get('b'));
        p.textFont("Consolas");
        p.textSize(Symbol.symbolSize);
        p.text(symbol.get('character'), symbol.get('x'), symbol.get('y'));
      });
    });

    store.dispatch({
      type: 'SCROLL_SYMBOL_STREAMS',
    });
  };
}

new p5(sketch)
