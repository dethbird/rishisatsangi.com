import React from 'react'
import { render } from 'react-dom'
import { IndexRoute, Router, Route, browserHistory } from 'react-router'

import { App } from '../components/app'
import { Project } from '../components/pages/project'
import { Projects } from '../components/pages/projects'

if (lastRequestUri) {
    browserHistory.push(lastRequestUri);
}

render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Projects}/>
            <Route path="projects" component={Projects}/>
            <Route path="project/:projectId" component={Project}/>
            <Route path="*" component={Projects}/>
        </Route>
    </Router>
), document.getElementById('mount'))
