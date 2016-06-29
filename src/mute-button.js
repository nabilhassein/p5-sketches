import React from 'react'
import Button from 'react-button'

export default class MuteButton extends React.Component {
  onClick = () => {
    this.props.onClick();
    this.setState({
      muted: !this.state.muted,
    });
  }

  constructor() {
    super();
    this.id = "mute-button";
    this.state = {};
    this.state.muted = false;
  }

  render() {
    return (<div id={this.id}>
            <Button
              onClick={this.onClick}
              style={{
                height: '100px',
                width: '100px',
              }}
             >
             { this.state.muted ? "UNMUTE" : "MUTE" }
             </Button>
            </div>);
  }
}
