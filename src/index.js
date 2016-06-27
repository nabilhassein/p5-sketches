import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

import Sidebar from './sidebar'
import MatrixGreenRain from './matrix-green-rain'
import BoxingTimer from './boxing-timer'


ReactDOM.render(
  (
  <Router history={hashHistory}>
    <Route path='/' component={Sidebar}/>
    <Route path='matrix-green-rain' component={MatrixGreenRain}/>
    <Route path='boxing-timer' component={BoxingTimer}/>
  </Router>
  ),
  document.getElementById("root"))
