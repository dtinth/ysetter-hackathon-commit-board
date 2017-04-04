import React from 'react';

function getMicrophoneSubscriber() {
  return window.microphone ||
    (window.microphone = (() => {
      const context = window.audioContext ||
        (window.audioContext = new AudioContext());
      const mic = {ondata: () => {}};
      const analyser = context.createAnalyser();
      analyser.fftSize = 1024;
      const array = new Uint8Array(analyser.frequencyBinCount);
      function request() {
        return new Promise(function(resolve, reject) {
          navigator.getUserMedia = navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia;
          navigator.getUserMedia({audio: true}, resolve, reject);
        });
      }
      mic.activate = () => {
        request().then(microphone => {
          const streamSource = context.createMediaStreamSource(microphone);
          streamSource.connect(analyser);
          requestAnimationFrame(frame);
          function frame() {
            analyser.getByteFrequencyData(array);
            mic.ondata(array);
            requestAnimationFrame(frame);
          }
        });
      };
      return mic;
    })());
}

export default class Visualizer extends React.Component {
  onClick = e => {
    getMicrophoneSubscriber().activate();
  };
  componentDidMount() {
    const div = this.div;
    const children = [];
    for (let i = 0; i < 24; i++) {
      const bar = document.createElement('div');
      const left = i * 10;
      bar.setAttribute(
        'style',
        'position:absolute;bottom:0;width:10px;left:' +
          left +
          'px;background:#FF5F57;height:0px;',
      );
      children.push(bar);
      div.appendChild(bar);
    }
    function frame(array) {
      for (let i = 0; i < children.length; i++) {
        children[i].style.height = ((array[i] / 256) ** 2) * 128 + 'px';
      }
    }
    getMicrophoneSubscriber().ondata = frame;
  }
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: 240,
          height: 200,
        }}
        onClick={this.onClick}
        ref={el => this.div = el}
      />
    );
  }
}
