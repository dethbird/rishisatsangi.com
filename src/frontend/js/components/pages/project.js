import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { ProjectNav } from "../ui/project-nav"
import { SectionHeader } from "../ui/section-header"
import { Spinner } from "../ui/spinner"


const Project = React.createClass({
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
              console.log(xhr);
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
            return (
                <div>
                    <SectionHeader>{ this.state.project.name }</SectionHeader>
                    <ProjectNav project={ this.state.project } />
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.Project = Project
