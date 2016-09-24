import React from 'react'
import { browserHistory, Link } from 'react-router'

import { ProjectBreadcrumb } from "./project/project-breadcrumb"
import { ProjectCharacters } from "./project/project-characters"
import { ProjectConceptArts } from "./project/project-concept_arts"
import { ProjectDetails } from "./project/project-details"
import { ProjectLocations } from "./project/project-locations"
import { ProjectReferenceImages } from "./project/project-reference_images"
import { ProjectStoryboards } from "./project/project-storyboards"
import { SectionHeader } from "../ui/section-header"
import { Spinner } from "../ui/spinner"


const Project = React.createClass({
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
    render() {
        let that = this;
        if(this.state) {
            let project = this.state.project;
            return (
                <div className="projectPage">
                    <ProjectBreadcrumb project={ project } />

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-info"
                                to={
                                    '/project/' + that.props.params.projectId
                                    + '/edit'
                                }>Edit</Link>
                        </li>
                    </ul>
                    <br />

                    <ProjectDetails project={ project } />
                    <ProjectCharacters project={ project } />
                    <ProjectStoryboards project={ project } />
                    <ProjectConceptArts project={ project } />
                    <ProjectReferenceImages project={ project } />
                    <ProjectLocations project={ project } />
                </div>
            )
        }
        return (
            <Spinner />
        )
    }
})

module.exports.Project = Project
