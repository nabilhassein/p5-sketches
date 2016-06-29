import React from 'react'
import Button from 'react-button'
import annyang from 'annyang'

export default class MuteButton extends React.Component {
  onClick = () => {
    this.props.onClick();
    this.setState({
      muted: !this.state.muted,
    });
  }

  constructor(props) {
    super();
    this.id = "mute-button";
    this.state = {};
    this.state.muted = false;

    const commands = {
      'mute': () => this.onClick(),
      'unmute': () => this.onClick(),
    };

    props.annyang.addCommands(commands);
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
