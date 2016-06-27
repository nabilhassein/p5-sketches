import React from 'react'
import { Link } from 'react-router'

export default class Sidebar extends React.Component {
  constructor() {
    super();
    this.id = "Sidebar";
  }

  render() {
    const linkStyle = {
      color: 'blue',
      textDecoration: 'underline',
    };

    return (<div id={this.id}>
      <ul>
        <li>
          <Link to={"matrix-green-rain"} style={linkStyle}>
          Matrix green rain
          </Link>
        </li>
        <li>
          <Link to={"boxing-timer"} style={linkStyle} >
          Boxing timer
          </Link>
        </li>
      </ul>
      </div>);
  }
}