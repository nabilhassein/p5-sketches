import React from 'react'
import ReactDOM from 'react-dom'
import { Route, DefaultRoute } from 'react-router'

import Root from './root'
import Home from './home'

import MatrixGreenRain from '../sketches/matrix-green-rain'
import BoxingTimer from '../sketches/boxing-timer'


const Routes = (
  <Route path='/' handler={Root}>
    <DefaultRoute handler={Home}/>
    <Route path='/matrix-green-rain' component={MatrixGreenRain}/>
    <Route path='/boxing-timer' component={BoxingTimer}/>
  </Route>
)

export default Routes
