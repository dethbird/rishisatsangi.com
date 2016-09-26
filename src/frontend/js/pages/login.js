import React from 'react'
import { render } from 'react-dom'
import { IndexRoute, Router, Route, browserHistory } from 'react-router'

import { Login } from '../components/pages/login'


const NoMatch = React.createClass({
  render() {
    return (
      <div>Whachhu talkin about</div>
    )
  }
})

render((
    <Router history={browserHistory}>
        <Route path="/" component={Login}>
            <IndexRoute component={Login}/>
            <Route path="login" component={Login}/>
            <Route path="*" component={Login}/>
        </Route>
    </Router>
), document.getElementById('mount'))
