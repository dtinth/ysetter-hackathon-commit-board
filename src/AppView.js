import React, { Component } from 'react'

import Filter from 'bad-words'
import { emojify } from 'react-emojione'
import logo from './logo.svg'

const filter = new Filter({ placeHolder: '😄' })

export default function({ data }) {
  const Visualizer = require('./Visualizer').default
  const Countdown = require('./Countdown').default
  const commits = []
    .concat(...data)
    .map(x => {
      let time = +new Date(x.commit.committer.date)
      if (time > Date.now() + 3600e3) {
        time -= 3600e3 * 7
      }
      return { ...x, time }
    })
    .sort((a, b) => {
      if (a.time < b.time) return 1
      return -1
    })
  return (
    <div
      style={{
        position: 'absolute',
        display: 'flex',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      }}
    >
      <Visualizer />
      <div
        style={{
          background: '#642223',
          width: 240,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <img src={require('./title.jpg')} width={240} height={240} />
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div
            style={{
              textAlign: 'center',
              color: '#FF5F57',
              fontStyle: 'italic',
              fontFamily: 'Coda, sans-serif',
              fontSize: 50,
              opacity: 0.4
            }}
          >
            {/* please<br />write<br />README<br />.md */}
          </div>
        </div>
        <div style={{ height: 128 }} />
      </div>
      <div
        style={{
          background: 'black',
          flex: '1',
          overflow: 'hidden'
        }}
      >
        <Countdown />
        {commits.map(x => {
          const color = `hsl(${(x.team / 10) * 360},35%,60%)`
          return (
            <div
              onClick={() => {
                console.log(x)
              }}
              style={{
                display: 'flex',
                font: '28px Athiti, sans-serif',
                alignItems: 'center',
                lineHeight: '36px',
                borderBottom: '1px solid #333'
              }}
              key={x.sha}
            >
              <span
                style={{
                  display: 'inline-block',
                  background: color,
                  color: 'black',
                  verticalAlign: 'center',
                  alignSelf: 'stretch',
                  width: '1em',
                  textAlign: 'center',
                  padding: 8
                }}
              >
                {`${x.team}`}
              </span>
              <div style={{ marginLeft: 12, flex: 1, padding: 8 }}>
                {emojify(filter.clean(x.commit.message), {
                  styles: {
                    backgroundImage: `url(${require('./emojione.sprites.png')})`
                  }
                })}
                <div
                  style={{
                    color: '#888',
                    fontSize: '0.67em',
                    fontFamily: 'Coda',
                    lineHeight: 1.3
                  }}
                >
                  {(x.author && x.author.login) ||
                    (x.commit && x.commit.author && x.commit.author.name)}{' '}
                  committed <DateView date={x.time} /> ago
                </div>
              </div>
              <div>
                <span
                  style={{
                    color: '#888',
                    fontSize: '0.66em',
                    background: '#333',
                    borderRadius: 3,
                    padding: '3px 5px',
                    fontFamily: 'menlo'
                  }}
                >
                  {x.sha.substr(0, 7)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

class DateView extends React.Component {
  state = {
    now: Date.now()
  }
  componentDidMount() {
    this.t = setInterval(() => {
      this.setState({ now: Date.now() })
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.t)
  }
  render() {
    const elapsed = Date.now() - new Date(this.props.date).getTime()
    const text = (() => {
      if (elapsed < 60000) {
        return '1m'
      } else if (elapsed < 3600e3) {
        return Math.ceil(elapsed / 60000) + 'm'
      } else {
        return (elapsed / 3600e3).toFixed(1) + 'h'
      }
    })()
    return <span>{text}</span>
  }
}
