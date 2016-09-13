import React from 'react'

import { ProjectCharacters } from "./project/project-characters"
import { ProjectConceptArts } from "./project/project-concept_arts"
import { ProjectDetails } from "./project/project-details"
import { ProjectLocations } from "./project/project-locations"
import { ProjectReferenceImages } from "./project/project-reference_images"
import { ProjectStoryboards } from "./project/project-storyboards"


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
        if(this.state) {
            let project = this.state.project;
            return (
                <div className="projectPage">
                    <ProjectDetails project={ project }></ProjectDetails>
                    <ProjectCharacters project={ project }></ProjectCharacters>
                    <ProjectStoryboards project={ project }></ProjectStoryboards>
                    <ProjectConceptArts project={ project }></ProjectConceptArts>
                    <ProjectReferenceImages project={ project }></ProjectReferenceImages>
                    <ProjectLocations project={ project }></ProjectLocations>
                </div>
            )
        }
        return null;
    }
})

module.exports.Project = Project
