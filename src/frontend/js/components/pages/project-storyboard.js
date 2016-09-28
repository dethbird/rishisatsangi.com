import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { FountainBlock } from "../ui/fountain-block"
import { Image } from "../ui/image"
import { MarkdownBlock } from "../ui/markdown-block"
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
    handleClickProject(project_id) {
        event.preventDefault()
        browserHistory.push('/project/' + project_id)
    },
    render() {
        let that = this

        if (this.state){

            var storyboardPanelNodes = this.state.storyboard.panels.map(function(panel, i) {
                let props = {};
                if (panel.revisions.length > 0)
                    props.src = panel.revisions[0].content
                return (
                    <Card
                        className="col-lg-6"
                        key={ panel.id }
                    >
                        <h4 className="card-header">{ panel.name }</h4>
                        <Image { ...props } ></Image>
                        <CardBlock>
                            <MarkdownBlock source={ panel.description } />
                            <div className="card-section-header">{ panel.revisions.length } revision(s)</div>
                            <PanelRevisions revisions={ panel.revisions } panelClassName="col-xs-4"/>
                            {(() => {
                                if (panel.script) {
                                    return (
                                        <div className="card-section-header">script:</div>
                                    )
                                }
                            })()}
                            <FountainBlock source={ panel.script } />
                            {(() => {
                                if (panel.comments.length) {
                                    return (
                                        <div className="card-section-header">{ panel.comments.length } comment(s)</div>
                                    )
                                }
                            })()}
                            <PanelComments comments={ panel.comments }/>
                            <div className="pull-right"><span className="tag tag-default">{ i + 1 }</span></div>
                        </CardBlock>
                    </Card>
                );
            });

            return (
                <div>
                    <SectionHeader>{ this.state.project.name }</SectionHeader>
                    <div><strong>Storyboard:</strong> { this.state.storyboard.name }</div>
                    <ProjectNav project={ this.state.project } />
                    <div>
                        { storyboardPanelNodes }
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
