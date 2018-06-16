import React, { Component } from 'react'

import Filter from 'bad-words'

const filter = new Filter({ placeHolder: '😄' })

const teams = [
  ['https://github.com/Teerapat12/Sansiri_Hackathon_Waifu'],
  ['https://github.com/UKRx/hackthon2'],
  ['https://github.com/nattaaek/goodspace'],
  ['https://github.com/blacksourcez/BigTU2'],
  ['https://github.com/phiyawat/good-space'],
  ['https://github.com/kennaruk/YsetterHackathon'],
  ['https://github.com/Kokoskun/YR2'],
  [
    'https://github.com/tidjungs/goodspace-frontend',
    'https://github.com/monthol8th/goodspace-backend'
  ],
  ['https://github.com/Mingmon/ysetter-hackathon-2']
]

function getData() {
  return (
    window.dataPromise ||
    (window.dataPromise = Promise.all(
      teams
        .reduce(
          (a, b, i) => [...a, ...b.map(url => ({ url, team: i + 1 }))],
          []
        )
        .map(({ url: ghUrl, team }) => {
          const url = `https://api.github.com/repos/${
            ghUrl.match(/[^\/]+\/[^\/]+$/)[0]
          }/commits${localStorage.APPEND_GH || ''}`
          return fetch(url)
            .then(response => response.json())
            .then(commits => {
              return commits.map(commit => ({ ...commit, team }))
            })
            .catch(e => [])
        })
    ))
  )
}

class App extends Component {
  state = {
    data: []
  }
  componentDidMount() {
    getData().then(data => {
      this.setState({ data })
    })
    this.t = setInterval(() => {
      delete window.dataPromise
      getData().then(data => {
        this.setState({ data })
      })
    }, 60000)
    if (module.hot) {
      module.hot.accept('./AppView', () => {
        this.forceUpdate()
      })
    }
  }
  componentWillUnmount() {
    clearInterval(this.t)
  }
  render() {
    const AppView = require('./AppView').default
    return AppView({ data: this.state.data })
  }
}

export default App
