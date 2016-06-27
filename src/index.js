import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'
import { createHashHistory, useBasename } from 'history'

import Sidebar from './sidebar'
import MatrixGreenRain from './matrix-green-rain'
import BoxingTimer from './boxing-timer'


const basename = '/p5-sketches',
      myHistory = useBasename(createHashHistory)({basename: basename});

ReactDOM.render(
  (
  <Router history={myHistory}>
    <Route path='/' component={Sidebar}/>
    <Route path={basename} component={Sidebar}/>
    <Route path='matrix-green-rain' component={MatrixGreenRain}/>
    <Route path='boxing-timer' component={BoxingTimer}/>
  </Router>
  ),
  document.getElementById("root"))
