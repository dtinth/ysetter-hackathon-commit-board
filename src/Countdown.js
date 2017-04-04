import React from 'react';

class Countdown extends React.Component {
  state = {
    now: Date.now(),
  };
  componentDidMount() {
    this.t = setInterval(
      () => {
        this.setState({now: Date.now()});
      },
      1000,
    );
  }
  componentWillUnmount() {
    clearInterval(this.t);
  }
  render() {
    const timeLeft = Math.floor(((1491098400000 + 3600e3 * 3) - this.state.now) / 1e3);
    const hoursLeft = ~~(timeLeft / 3600);
    const minutesLeft = ('0' + ~~(timeLeft % 3600 / 60)).substr(-2);
    const secondsLeft = ('0' + ~~(timeLeft % 60)).substr(-2);
    return (
      <div
        style={{
          fontFamily: 'menlo',
          fontSize: 90,
          color: timeLeft < 3600 ? '#FF5F57' : '#aaa',
          textAlign: 'center',
          borderBottom: '2px solid #444',
        }}
      >
        {hoursLeft}:{minutesLeft}:{secondsLeft}
      </div>
    );
  }
}

export default Countdown;
