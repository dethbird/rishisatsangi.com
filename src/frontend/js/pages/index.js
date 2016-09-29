import React from 'react'
import { render } from 'react-dom'
import { IndexRoute, Router, Route, browserHistory } from 'react-router'

import { App } from '../components/app'
import { Project } from '../components/pages/project'
import { ProjectCharacters } from '../components/pages/project-characters'
import { ProjectConceptArt } from '../components/pages/project-concept_art'
import { ProjectStoryboard } from '../components/pages/project-storyboard'
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
            <Route path="project/:projectId/characters" component={ProjectCharacters}/>
            <Route path="project/:projectId/concept_art" component={ProjectConceptArt}/>
            <Route path="project/:projectId/storyboard/:storyboardId" component={ProjectStoryboard}/>
            <Route path="*" component={Projects}/>
        </Route>
    </Router>
), document.getElementById('mount'))
