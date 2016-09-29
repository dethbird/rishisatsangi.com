import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { FountainBlock } from "../ui/fountain-block"
import { Image } from "../ui/image"
import { MarkdownBlock } from "../ui/markdown-block"
import { ReferenceImages } from "../pages/project-reference_images/reference_images"
import { ProjectNav } from "../ui/project-nav"
import { SectionHeader } from "../ui/section-header"
import { Spinner } from "../ui/spinner"


const ProjectReferenceImages = React.createClass({
    componentWillMount() {
      $.ajax({
          url: '/api/project/' + this.props.params.projectId,
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  project: data
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
                    <div><strong>Reference Images:</strong></div>
                    <ProjectNav project={ this.state.project } />
                    <div>
                        <ReferenceImages referenceImages={ this.state.project.reference_images } />
                    </div>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectReferenceImages = ProjectReferenceImages
