import React from 'react'
import { browserHistory } from 'react-router'

import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import {
    ProjectConceptArtBreadcrumb
} from "./project-concept_art/project-concept_art-breadcrumb"
import { Spinner } from "../ui/spinner"


const ProjectConceptArt = React.createClass({
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
    handleClick(project_id, concept_art_id) {
        browserHistory.push(
            '/project/' + project_id + '/concept_art/' + concept_art_id);
    },
    render() {
        if (this.state) {
            var that = this;
            var conceptArtNodes = this.state.project.concept_art.map(function(concept_art) {
                console.log(concept_art);
                let src;
                if (concept_art.revisions.length) {
                    src = concept_art.revisions[0].content;
                }
                return (
                    <CardClickable
                        className="col-lg-6"
                        key={ concept_art.id }
                        onClick={
                            that.handleClick.bind(
                                that,
                                that.state.project.id,
                                concept_art.id
                            )
                        }
                    >
                        <h3 className="card-header">{ concept_art.name }</h3>
                        <div className="text-align-center">
                            <img className="card-img-top" src={ src } />
                        </div>
                        <CardBlock>
                            <div>
                                <blockquote>{ concept_art.description }</blockquote>
                                <span>{ concept_art.revisions.length } revision(s)</span>
                            </div>
                        </CardBlock>
                    </CardClickable>
                );
            });
            return (
                <div>
                    <ProjectConceptArtBreadcrumb project={ this.state.project }>
                    </ProjectConceptArtBreadcrumb>
                    <div className="projectConceptArtList">
                        { conceptArtNodes }
                    </div>
                </div>
            )
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectConceptArt = ProjectConceptArt
