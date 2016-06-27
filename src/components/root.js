var React = require('react')
var Router = require('react-router')
var RouteHandler = Router.RouteHandler
var Sidebar = require('./sidebar')

var Root = React.createClass({
  propTypes: {
    title: React.PropTypes.string
  },

  render: function () {
    var initialProps = {
      __html: safeStringify(this.props)
    }

    return (
      <html>
        <head>
          <meta charSet="UTF-8" />
          <title>{this.props.title}</title>
        </head>
        <body className='p2'>
          <Sidebar {...this.props} />
          <RouteHandler {...this.props} />
          <script
            id='initial-props'
            type='application/json'
            dangerouslySetInnerHTML={initialProps} />
          <script src='/bundle.js' />
        </body>
      </html>
    )
  }
})

function safeStringify (obj) {
  return JSON.stringify(obj).replace(/<\/script/g, '<\\/script').replace(/<!--/g, '<\\!--')
}

module.exports = Root
