import React, {Component} from 'react';

import Filter from 'bad-words';
import {emojify} from 'react-emojione';
import logo from './logo.svg';

const filter = new Filter({placeHolder: '😄'});

function getData() {
  return window.dataPromise ||
    (window.dataPromise = Promise.all(
      [
        'https://github.com/b5710547221/reporter',
        'https://github.com/phoomparin/nongtuu',
        'https://github.com/biogamebig/little-child',
        'https://github.com/chinatip/saleng-online',
      ].map((x, i) => {
        return fetch(
          `https://api.github.com/repos/${x.match(/[^\/]+\/[^\/]+$/)[0]}/commits`,
        )
          .then(response => response.json())
          .then(commits => commits.map(commit => ({...commit, team: i + 1})));
      }),
    ));
}

class App extends Component {
  state = {
    data: [],
  };
  componentDidMount() {
    getData().then(data => {
      this.setState({data});
    });
    this.t = setInterval(
      () => {
        delete window.dataPromise;
        getData().then(data => {
          this.setState({data});
        });
      },
      60000,
    );
    if (module.hot) {
      module.hot.accept('./AppView', () => {
        this.forceUpdate();
      });
    }
  }
  componentWillUnmount() {
    clearInterval(this.t);
  }
  render() {
    const AppView = require('./AppView').default;
    return AppView({ data: this.state.data });
  }
}

export default App;
