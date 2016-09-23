import React from 'react'
import { browserHistory, Link } from 'react-router'

import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { Description } from "../ui/description"
import { ImagePanelRevision } from "../ui/image-panel-revision"
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
                        <ImagePanelRevision { ...{ src: src }} />
                        <CardBlock>
                            <div>
                                <Description source={ concept_art.description }></Description>
                                <span>{ concept_art.revisions.length } revision(s)</span>
                            </div>
                        </CardBlock>
                    </CardClickable>
                );
            });
            return (
                <div>
                    <ProjectConceptArtBreadcrumb project={ this.state.project } />


                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-info"
                                to={
                                    '/project/' + this.state.project.id + '/concept_art/edit'
                                }>Reorder</Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-success"
                                to={
                                    '/project/' + this.state.project.id + '/concept_art/add'
                                }>Add</Link>
                        </li>
                    </ul>
                    <br />


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
