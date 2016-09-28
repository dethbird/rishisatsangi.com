import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { FountainBlock } from "../ui/fountain-block"
import { Image } from "../ui/image"
import { MarkdownBlock } from "../ui/markdown-block"
import { Panels } from "../pages/project-storyboard/panels"
import { PanelRevisions } from "../pages/project-storyboard/panel-revisions"
import { PanelComments } from "../pages/project-storyboard/panel-comments"
import { ProjectNav } from "../ui/project-nav"
import { SectionHeader } from "../ui/section-header"
import { Spinner } from "../ui/spinner"


const ProjectStoryboard = React.createClass({
    componentWillMount() {
      $.ajax({
          url: '/api/project/' + this.props.params.projectId,
          dataType: 'json',
          cache: false,
          success: function(data) {
              let storyboard = _.findWhere(data.storyboards, {
                  'id': parseInt(this.props.params.storyboardId)
              });
              this.setState({
                  project: data,
                  storyboard: storyboard
              });
          }.bind(this),
          error: function(xhr, status, err) {
              console.log(xhr)
          }.bind(this)
      });
    },
    render() {
        let that = this

        if (this.state){

            return (
                <div>
                    <SectionHeader>{ this.state.project.name }</SectionHeader>
                    <div><strong>Storyboard:</strong> { this.state.storyboard.name }</div>
                    <ProjectNav project={ this.state.project } />
                    <div>
                        <Panels panels={ this.state.storyboard.panels } />
                    </div>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectStoryboard = ProjectStoryboard
