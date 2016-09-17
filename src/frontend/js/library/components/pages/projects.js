import React from 'react'
import { browserHistory } from 'react-router'

import { Project } from "./projects/project"
import {
    ProjectsBreadcrumb
} from './projects/projects-breadcrumb'
import { Spinner } from "../ui/spinner"

const Projects = React.createClass({
    handleClick(project_id) {
        browserHistory.push('/project/' + project_id);
    },
    componentDidMount() {
        $.ajax({
            url: '/api/projects',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({projects: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render() {
        let that = this
        if (this.state) {
            let projectNodes = this.state.projects.map(function(project) {
                return (
                    <Project
                        handleClick={ that.handleClick.bind(that, project.id) }
                        project={ project }
                        key={ project.id }
                    >
                    </Project>
                );
            });

            return (
                <div>
                    <ProjectsBreadcrumb project={ this.state.project }>
                    </ProjectsBreadcrumb>
                    <div className="projectsList">
                        { projectNodes }
                    </div>
                </div>
            )
        }
        return (
            <Spinner />
        )
    }
})

module.exports.Projects = Projects
