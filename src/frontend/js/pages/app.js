import React from 'react'
import { render } from 'react-dom'
import { IndexRoute, Router, Route, browserHistory } from 'react-router'

import { App } from '../library/components/app'
import { Index } from '../library/components/pages/index'
import { Projects } from '../library/components/pages/projects'

const Project = React.createClass({
  render() {
    return (
      <div>Project</div>
    )
  }
})
const NoMatch = React.createClass({
  render() {
    return (
      <div>Whachhu talkin about</div>
    )
  }
})



render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Index}/>
            <Route path="projects" component={Projects}/>
            <Route path="project" component={Projects}>
                <Route path=":projectId" component={Project}/>
            </Route>
            <Route path="*" component={NoMatch}/>
        </Route>
    </Router>
), document.getElementById('mount'))
