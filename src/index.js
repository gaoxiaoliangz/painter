import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import Test from './Test'
import PerfTest from './PerfTest'
import * as serviceWorker from './serviceWorker'

const use = 'PerfTest'

const components = {
  App,
  Test,
  PerfTest,
}

const Root = components[use]

ReactDOM.render(<Root />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
