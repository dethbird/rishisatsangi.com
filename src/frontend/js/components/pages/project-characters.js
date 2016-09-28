import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { FountainBlock } from "../ui/fountain-block"
import { Image } from "../ui/image"
import { MarkdownBlock } from "../ui/markdown-block"
import { Characters } from "../pages/project-characters/characters"
import { ProjectNav } from "../ui/project-nav"
import { SectionHeader } from "../ui/section-header"
import { Spinner } from "../ui/spinner"


const ProjectCharacters = React.createClass({
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
                    <div><strong>Characters:</strong></div>
                    <ProjectNav project={ this.state.project } />
                    <div>
                        <Characters characters={ this.state.project.characters } />
                    </div>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectCharacters = ProjectCharacters
