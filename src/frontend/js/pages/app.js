import React from 'react'
import { render } from 'react-dom'
import { IndexRoute, Router, Route, browserHistory } from 'react-router'

import { App } from '../library/components/app'
import { Character } from '../library/components/pages/character'
import { CharacterEdit } from '../library/components/pages/character-edit'
import { CharacterRevisionEdit } from '../library/components/pages/character-revision-edit'
import { ConceptArt } from '../library/components/pages/concept_art'
import { ConceptArtEdit } from '../library/components/pages/concept_art-edit'
import { ConceptArtRevisionEdit } from '../library/components/pages/concept_art-revision-edit'
import { LocationEdit } from '../library/components/pages/location-edit'
import { Project } from '../library/components/pages/project'
import { ProjectCharacters } from '../library/components/pages/project-characters'
import { ProjectCharactersEdit } from '../library/components/pages/project-characters-edit'
import { ProjectConceptArt } from '../library/components/pages/project-concept_art'
import { ProjectConceptArtEdit } from '../library/components/pages/project-concept_art-edit'
import { ProjectLocations } from '../library/components/pages/project-locations'
import { ProjectLocationsEdit } from '../library/components/pages/project-locations-edit'
import { ProjectReferenceImages } from '../library/components/pages/project-reference_images'
import { ProjectReferenceImagesEdit } from '../library/components/pages/project-reference_images-edit'
import { ProjectStoryboards } from '../library/components/pages/project-storyboards'
import { Projects } from '../library/components/pages/projects'
import { ProjectsEdit } from '../library/components/pages/projects-edit'
import { ReferenceImageEdit } from '../library/components/pages/reference_image-edit'
import { Storyboard } from '../library/components/pages/storyboard'
import { StoryboardEdit } from '../library/components/pages/storyboard-edit'
import { StoryboardPanel } from '../library/components/pages/storyboard-panel'
import { StoryboardPanelEdit } from '../library/components/pages/storyboard-panel-edit'
import { StoryboardPanelCommentEdit } from '../library/components/pages/storyboard-panel-comment-edit'
import { StoryboardPanelRevisionEdit } from '../library/components/pages/storyboard-panel-revision-edit'

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
            <Route path="projects/edit" component={ProjectsEdit}/>
            <Route path="project/:projectId" component={Project}/>
            <Route path="project/:projectId/characters" component={ProjectCharacters}/>
            <Route path="project/:projectId/characters/edit" component={ProjectCharactersEdit}/>
            <Route path="project/:projectId/character/add" component={CharacterEdit}/>
            <Route path="project/:projectId/character/:characterId" component={Character}/>
            <Route path="project/:projectId/character/:characterId/edit" component={CharacterEdit}/>
            <Route path="project/:projectId/character/:characterId/revision/add" component={CharacterRevisionEdit}/>
            <Route path="project/:projectId/character/:characterId/revision/:revisionId/edit" component={CharacterRevisionEdit}/>
            <Route path="project/:projectId/concept_art" component={ProjectConceptArt}/>
            <Route path="project/:projectId/concept_art/edit" component={ProjectConceptArtEdit}/>
            <Route path="project/:projectId/concept_art/add" component={ConceptArtEdit}/>
            <Route path="project/:projectId/concept_art/:conceptArtId" component={ConceptArt}/>
            <Route path="project/:projectId/concept_art/:conceptArtId/edit" component={ConceptArtEdit}/>
            <Route path="project/:projectId/concept_art/:conceptArtId/revision/add" component={ConceptArtRevisionEdit}/>
            <Route path="project/:projectId/concept_art/:conceptArtId/revision/:revisionId/edit" component={ConceptArtRevisionEdit}/>
            <Route path="project/:projectId/locations" component={ProjectLocations}/>
            <Route path="project/:projectId/locations/edit" component={ProjectLocationsEdit}/>
            <Route path="project/:projectId/location/add" component={LocationEdit}/>
            <Route path="project/:projectId/location/:locationId/edit" component={LocationEdit}/>
            <Route path="project/:projectId/reference_images" component={ProjectReferenceImages}/>
            <Route path="project/:projectId/reference_images/edit" component={ProjectReferenceImagesEdit}/>
            <Route path="project/:projectId/reference_image/add" component={ReferenceImageEdit}/>
            <Route path="project/:projectId/reference_image/:referenceImageId/edit" component={ReferenceImageEdit}/>
            <Route path="project/:projectId/storyboards" component={ProjectStoryboards}/>
            <Route path="project/:projectId/storyboard/add" component={StoryboardEdit}/>
            <Route path="project/:projectId/storyboard/:storyboardId" component={Storyboard}/>
            <Route path="project/:projectId/storyboard/:storyboardId/edit" component={StoryboardEdit}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/add" component={StoryboardPanelEdit}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/:panelId" component={StoryboardPanel}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/:panelId/edit" component={StoryboardPanelEdit}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/:panelId/comment/add" component={StoryboardPanelCommentEdit}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/:panelId/comment/:commentId/edit" component={StoryboardPanelCommentEdit}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/:panelId/revision/add" component={StoryboardPanelRevisionEdit}/>
            <Route path="project/:projectId/storyboard/:storyboardId/panel/:panelId/revision/:revisionId/edit" component={StoryboardPanelRevisionEdit}/>
            <Route path="*" component={Projects}/>
        </Route>
    </Router>
), document.getElementById('mount'))
