import React from 'react'
import Sound from 'react-sound'
import CountdownClock from './countdown-clock'

// GLOBAL STATE
let active = 0;

const states = [
  { color: "green" , seconds: 150, offset: 30 },
  { color: "yellow", seconds: 30, offset: 0 },
  { color: "red"   , seconds: 60, offset: 0 },
];


export default class BoxingTimer extends React.Component {
  clockDone = () => {
    active = (active + 1) % 3;
    this.setState(states[active]);
  }

  constructor() {
    super();
    this.id = "boxing-timer";
    this.state = states[0];
  }

  render() {
    const size = 0.8 * Math.min(screen.availWidth, screen.availHeight);
    return (<div id={this.id}>
            <CountdownClock size={size} seconds={this.state.seconds} color={this.state.color} offset={this.state.offset} onComplete={this.clockDone} />
            <Sound
               url="media/boxing-bell.mp3"
               playStatus={Sound.status.PLAYING}
            />
            </div>);
  }
}
