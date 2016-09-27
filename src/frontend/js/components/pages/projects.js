import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { SectionHeader } from "../ui/section-header"
import { Spinner } from "../ui/spinner"


const Projects = React.createClass({
    componentWillMount() {
      $.ajax({
          url: '/api/projects',
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  projects: data
              });
          }.bind(this),
          error: function(xhr, status, err) {
              console.log(xhr);
          }.bind(this)
      });
    },
    handleClickProject(project_id) {
        event.preventDefault()
        console.log(project_id)
    },
    render() {
        let that = this
        if (this.state){
            let projectNodes = this.state.projects.map(function(project) {
                return (
                    <CardClickable
                        key={ project.id }
                        onClick={ that.handleClickProject.bind(that, project.id) }
                    >
                        <CardBlock>
                            { project.name }
                        </CardBlock>
                    </CardClickable>
                );
            });
            return (
                <div>
                    <SectionHeader>Projects:</SectionHeader>
                    <div>{ projectNodes }</div>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.Projects = Projects
