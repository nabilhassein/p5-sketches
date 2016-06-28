// based on https://github.com/pughpugh/react-countdown-clock
// manually converted from coffeescript
// because version installed from npm gave this error
// https://gist.github.com/jimfb/4faa6cbfb1ef476bd105

import React from 'react'

export default class CountdownClock extends React.Component {
  constructor() {
    super();
    this.seconds    = 0;
    this.radius     = null;
    this.fraction   = null;
    this.content    = null;
    this.canvas     = null;
    this.timeoutIds = [];
  }

  displayName() {
    return 'CountdownClock';
  }
  
  static propTypes = {
    seconds: React.PropTypes.number,
    size: React.PropTypes.number,
    color: React.PropTypes.string,
    alpha: React.PropTypes.number,
    onComplete: React.PropTypes.func,
  }

  static defaultProps = {
    size: 300,
    color: '#000',
    alpha: 1,
  }

  componentWillReceiveProps(newProps) {
    this.seconds = newProps.seconds;
    this.color = newProps.color;
    this.setupTimer();
  }

  componentDidMount() {
    this.seconds = this.props.seconds;
    this.setupTimer();
  }

  componentWillUnmount() {
    this.cancelTimer();
  }

  setupTimer() {
    this.setScale();
    this.setupCanvas();
    this.drawTimer();
    this.startTimer();
  }

  updateCanvas() {
    this.clearTimer();
    this.drawTimer();
  }

  setScale() {
    this.radius     = this.props.size / 2;
    this.fraction   = 2 / this.seconds;
    this.tickPeriod = this.seconds * 1.8;
  }

  setupCanvas() {
    this.canvas  = this.refs.canvas;
    this.context = this.canvas.getContext('2d');
    this.context.textAlign = 'center';
    this.context.textBaseline = 'middle';
    this.context.font = `bold ${this.radius/2}px Arial`
  }

  startTimer() {
    this.timeoutIds.push(setTimeout(() => this.tick(), 200));
  }

  cancelTimer() {
    for(const timeout of this.timeoutIds) {
      clearTimeout(timeout);
    }
  }

  tick() {
    const start = Date.now();
    this.timeoutIds.push(setTimeout(() => {
      const duration = (Date.now() - start) / 1000;
      this.seconds -= duration;

      if (this.seconds <= 0) {
        this.seconds = 0;
        this.handleComplete();
        this.clearTimer();
        this.cancelTimer();
      } else {
        this.updateCanvas();
      }

      this.tick();
    }), this.tickPeriod)
  }

  handleComplete() {
    if (this.props.onComplete) {
      this.props.onComplete();
    }
  }

  clearTimer() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBackground();
  }

  drawBackground() {
    this.context.beginPath();
    this.context.globalAlpha = this.props.alpha / 3;
    this.context.arc(this.radius, this.radius, this.radius,     0,           Math.PI * 2, false);
    this.context.arc(this.radius, this.radius, this.radius/1.8, Math.PI * 2, 0,           true);
    this.context.fill();
  }

  drawTimer() {
    const percent = this.fraction * this.seconds + 1.5;
    const decimals = (this.seconds <= 9.9) ? 1 : 0;
    this.context.globalAlpha = this.props.alpha;
    this.context.fillStyle = this.props.color;
    this.context.fillText(this.seconds.toFixed(decimals), this.radius, this.radius);
    this.context.beginPath();
    this.context.arc(this.radius, this.radius, this.radius,     Math.PI * 1.5,     Math.PI * percent, false);
    this.context.arc(this.radius, this.radius, this.radius/1.8, Math.PI * percent, Math.PI * 1.5,     true);
    this.context.fill();
  }

  render() {
    return (<canvas ref='canvas' className="countdown-clock" width={this.props.size} height={this.props.size}></canvas>);
  }
}