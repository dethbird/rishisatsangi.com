import React from 'react'
import { browserHistory, Link } from 'react-router'

import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { Description } from "../ui/description"
import {
    ProjectReferenceImagesBreadcrumb
} from "./project-reference_images/project-reference_images-breadcrumb"
import { Spinner } from "../ui/spinner"


const ProjectReferenceImages = React.createClass({
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
    handleClick(project_id, reference_image_id) {
        browserHistory.push(
            '/project/' + project_id + '/reference_image/' + reference_image_id + '/edit');
    },
    render() {
        if (this.state) {
            var that = this;
            var referenceImageNodes = this.state.project.reference_images.map(function(reference_image) {

                return (
                    <CardClickable
                        className="col-lg-6"
                        key={ reference_image.id }
                        onClick={
                            that.handleClick.bind(
                                that,
                                that.state.project.id,
                                reference_image.id
                            )
                        }
                    >
                        <h3 className="card-header">{ reference_image.name }</h3>
                        <div className="text-align-center">
                            <img className="card-img-top" src={ reference_image.content } />
                        </div>
                        <CardBlock>
                            <Description source={ reference_image.description }></Description>
                        </CardBlock>
                    </CardClickable>
                );
            });
            return (
                <div>
                    <ProjectReferenceImagesBreadcrumb project={ this.state.project } />

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-info"
                                to={
                                    '/project/' + this.state.project.id + '/reference_images/edit'
                                }>Reorder</Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-success"
                                to={
                                    '/project/' + this.state.project.id + '/reference_image/add'
                                }>Add</Link>
                        </li>
                    </ul>
                    <br />

                    <div className="projectReferenceImagesList">
                        { referenceImageNodes }
                    </div>
                </div>
            )
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectReferenceImages = ProjectReferenceImages
