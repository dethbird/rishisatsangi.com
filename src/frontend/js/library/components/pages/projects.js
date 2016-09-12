import React from 'react'
import { browserHistory, Link } from 'react-router'

import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { ProjectItem } from "../lists/project-item"

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
        var projectNodes;
        var that = this;
        if (this.state) {
            projectNodes = this.state.projects.map(function(project) {
                return (
                    <CardClickable
                        onClick={ that.handleClick.bind(that, project.id) }
                        key={ project.id }
                    >
                        <CardBlock>
                            <ProjectItem project={ project }></ProjectItem>
                        </CardBlock>
                    </CardClickable>
                );
            });
        }
        return (
            <div className="projectsList">
                { projectNodes }
            </div>
        )
    }
})

module.exports.Projects = Projects
