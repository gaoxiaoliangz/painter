import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import Test from './Test'
import * as serviceWorker from './serviceWorker'

const isTest = false

ReactDOM.render(isTest ? <Test /> : <App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
