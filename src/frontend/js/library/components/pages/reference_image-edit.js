import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { SectionHeader } from "../ui/section-header"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { ContentEdit } from "../ui/content-edit"
import { Description } from "../ui/description"
import { Fountain } from "../ui/fountain"
import { ImagePanelRevision } from "../ui/image-panel-revision"
import {
    ProjectReferenceImagesBreadcrumb
} from "./project-reference_images/project-reference_images-breadcrumb"
import { Spinner } from "../ui/spinner"


const ReferenceImageEdit = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {

                let reference_image = _.findWhere(data.reference_images, {
                    'id': parseInt(this.props.params.referenceImageId)
                });

                let changedFields = null
                let submitUrl = '/api/project_reference_image/'
                    + this.props.params.referenceImageId
                let submitMethod = 'PUT'

                if (!reference_image) {
                    reference_image = {
                        name: ''
                    };
                    submitUrl = '/api/project_reference_image'
                    submitMethod = 'POST'

                    changedFields = {
                        project_id: this.props.params.projectId
                    }
                }

                this.setState({
                    project: data,
                    reference_image: reference_image,
                    formState: null,
                    formMessage: null,
                    submitUrl: submitUrl,
                    submitMethod: submitMethod,
                    changedFields: changedFields
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleFieldChange(event) {
        let reference_image = this.state.reference_image;
        let changedFields = this.state.changedFields || {};

        reference_image[event.target.id] = event.target.value
        changedFields[event.target.id] = event.target.value

        this.setState({
            reference_image: reference_image,
            changedFields: changedFields
        })
    },
    handleClickCancel(event) {
        event.preventDefault()
        browserHistory.push(
            '/project/' + this.props.params.projectId
            + '/reference_images'
        )
    },
    handleClickSubmit(event) {
        event.preventDefault()
        var that = this
        $.ajax({
            data: that.state.changedFields,
            dataType: 'json',
            cache: false,
            method: this.state.submitMethod,
            url: this.state.submitUrl,
            success: function(data) {
                this.setState({
                    formState: 'success',
                    formMessage: 'Success.',
                    submitUrl:'/api/project_reference_image/'
                        + data.id,
                    submitMethod: 'PUT',
                    reference_image: data
                })
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    formState: 'danger',
                    formMessage: 'Error: ' + xhr.responseText
                })
            }.bind(this)
        });
    },
    render() {
        let that = this
        if (this.state){

            return (
                <div>
                    <ProjectReferenceImagesBreadcrumb { ...this.state } />

                    <Alert
                        status={ this.state.formState }
                        message={ this.state.formMessage }
                    />
                    <form>

                        <SectionHeader>content:</SectionHeader>
                        <div className="form-group">
                            <ContentEdit
                                type="text"
                                id="content"
                                placeholder="Image Url"
                                value={ this.state.reference_image.content }
                                handleFieldChange={ this.handleFieldChange }
                            />
                        </div>

                        <SectionHeader>name:</SectionHeader>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Name"
                                value={ this.state.reference_image.name }
                                onChange= { this.handleFieldChange }
                            />
                        </div>

                        <SectionHeader>description:</SectionHeader>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                id="description"
                                rows="3"
                                value={ this.state.reference_image.description || '' }
                                onChange= { this.handleFieldChange }
                            />
                            <br />
                            <Card>
                                <CardBlock>
                                    <Description source={ this.state.reference_image.description } />
                                </CardBlock>
                            </Card>
                        </div>

                        <div className="form-group text-align-center">
                            <button
                                className="btn btn-secondary"
                                onClick={ that.handleClickCancel }
                            >Cancel</button>
                            <button
                                className="btn btn-success"
                                onClick={ that.handleClickSubmit }
                                disabled={ !that.state.changedFields }
                            >Save</button>
                        </div>

                    </form>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ReferenceImageEdit = ReferenceImageEdit
