import React from 'react'
import { render } from 'react-dom'
import { IndexRoute, Router, Route, browserHistory } from 'react-router'

import { App } from '../library/components/app'
import { Character } from '../library/components/pages/character'
import { ConceptArt } from '../library/components/pages/concept_art'
import { Project } from '../library/components/pages/project'
import { ProjectCharacters } from '../library/components/pages/project-characters'
import { ProjectConceptArt } from '../library/components/pages/project-concept_art'
import { ProjectLocations } from '../library/components/pages/project-locations'
import { ProjectReferenceImages } from '../library/components/pages/project-reference_images'
import { ProjectStoryboards } from '../library/components/pages/project-storyboards'
import { Projects } from '../library/components/pages/projects'
import { Storyboard } from '../library/components/pages/storyboard'
import { StoryboardPanel } from '../library/components/pages/storyboard-panel'
import { StoryboardPanelEdit } from '../library/components/pages/storyboard-panel-edit'
import { StoryboardPanelCommentEdit } from '../library/components/pages/storyboard-panel-comment-edit'

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
            <Route path="project/:projectId/concept_art" component={ProjectConceptArt}/>
            <Route path="project/:projectId/concept_art/:conceptArtId" component={ConceptArt}/>
            <Route path="project/:projectId/locations" component={ProjectLocations}/>
            <Route path="project/:projectId/reference_images" component={ProjectReferenceImages}/>
            <Route path="project/:projectId/storyboards" component={ProjectStoryboards}/>
            <Route path="project/:projectId/storyboard/:storyboardId" component={Storyboard}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/add" component={StoryboardPanelEdit}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/:panelId" component={StoryboardPanel}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/:panelId/edit" component={StoryboardPanelEdit}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/:panelId/comment/add" component={StoryboardPanelCommentEdit}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/:panelId/comment/:commentId/edit" component={StoryboardPanelCommentEdit}/>
            <Route path="*" component={Projects}/>
        </Route>
    </Router>
), document.getElementById('mount'))
