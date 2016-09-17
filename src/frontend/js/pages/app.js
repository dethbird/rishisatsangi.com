import React from 'react'
import { render } from 'react-dom'
import { IndexRoute, Router, Route, browserHistory } from 'react-router'

import { App } from '../library/components/app'
import { Character } from '../library/components/pages/character'
import { Project } from '../library/components/pages/project'
import { ProjectCharacters } from '../library/components/pages/project-characters'
import { ProjectStoryboards } from '../library/components/pages/project-storyboards'
import { Projects } from '../library/components/pages/projects'
import { Storyboard } from '../library/components/pages/storyboard'

const NoMatch = React.createClass({
  render() {
    return (
      <div>Whachhu talkin about</div>
    )
  }
})

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
            <Route path="project/:projectId/character/:characterId" component={Character}/>
            <Route path="project/:projectId/storyboards" component={ProjectStoryboards}/>
            <Route path="project/:projectId/storyboard/:storyboardId" component={Storyboard}/>
            <Route path="*" component={Projects}/>
        </Route>
    </Router>
), document.getElementById('mount'))
