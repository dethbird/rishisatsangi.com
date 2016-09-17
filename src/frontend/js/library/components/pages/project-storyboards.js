import React from 'react'
import { browserHistory } from 'react-router'

import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import {
    ProjectStoryboardsBreadcrumb
} from "./project-storyboards/project-storyboards-breadcrumb"
import { Spinner } from "../ui/spinner"


const ProjectStoryboards = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({project: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleClick(project_id, storyboard_id) {
        browserHistory.push(
            '/project/' + project_id + '/storyboard/' + storyboard_id);
    },
    render() {
        if (this.state) {
            var that = this;
            var storyboardNodes = this.state.project.storyboards.map(function(storyboard) {
                return (
                    <CardClickable
                        key={ storyboard.id }
                        onClick={
                            that.handleClick.bind(
                                that,
                                that.state.project.id,
                                storyboard.id
                            )
                        }
                    >
                        <h3 className="card-header">{ storyboard.name }</h3>
                        <CardBlock>
                            <div>
                                <blockquote>{ storyboard.description }</blockquote>
                                <span>{ storyboard.panels.length } panel(s)</span>
                            </div>
                        </CardBlock>
                    </CardClickable>
                );
            });
            return (
                <div>
                    <ProjectStoryboardsBreadcrumb project={ this.state.project }>
                    </ProjectStoryboardsBreadcrumb>
                    <div className="projectStoryboardsList">
                        { storyboardNodes }
                    </div>
                </div>
            )
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectStoryboards = ProjectStoryboards
