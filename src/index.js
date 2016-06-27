//import React from 'react'
//import { Router, HistoryLocation } from 'react-router'
//import routes from './routes'

// export default function render(locals, callback) {
//   callback(null, `<!DOCTYPE html>
//     <html>
//       <body>
//         Hello world
//       </body>
//     </html>
//   `)
// }


var React = require('react')
var Router = require('react-router')
var Routes = require('./components/routes')

if (typeof document !== 'undefined') {
  var initialProps = JSON.parse(document.getElementById('initial-props').innerHTML)
  Router.run(Routes, Router.HistoryLocation, function (Handler) {
    React.render(React.createElement(Handler, initialProps), document)
  })
}

module.exports = function render(locals, callback) {
  Router.run(Routes, locals.path, function (Handler) {
    var html = React.renderToString(React.createElement(Handler, locals))
    callback(null, '<!DOCTYPE html>' + html)
  })
}