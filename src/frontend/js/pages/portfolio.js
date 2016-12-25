import React from 'react'
import { render } from 'react-dom'
import { IndexRoute, Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'

import App from '../components/app'
import Portfolio from '../components/pages/portfolio'
import store from '../store/store';

const NoMatch = React.createClass({
  render() {
    return (
      <div>Whachhu talkin about</div>
    )
  }
})

// if (lastRequestUri) {
//     browserHistory.push(lastRequestUri);
// }

render((
    <Provider store={ store }>
        <Router history={browserHistory}>
            <Route path="/" component={ App}>
                <IndexRoute component={ Portfolio } />
                <Route path="*" component={ Portfolio } />
            </Route>
        </Router>
    </Provider>
), document.getElementById('portfolio'))
