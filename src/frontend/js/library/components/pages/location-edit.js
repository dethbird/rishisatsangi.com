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
    ProjectLocationsBreadcrumb
} from "./project-locations/project-locations-breadcrumb"
import { Spinner } from "../ui/spinner"


const LocationEdit = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {

                let location = _.findWhere(data.locations, {
                    'id': parseInt(this.props.params.locationId)
                });

                let changedFields = null
                let submitUrl = '/api/project_location/'
                    + this.props.params.locationId
                let submitMethod = 'PUT'

                if (!location) {
                    location = {
                        name: ''
                    };
                    submitUrl = '/api/project_location'
                    submitMethod = 'POST'

                    changedFields = {
                        project_id: this.props.params.projectId
                    }
                }

                this.setState({
                    project: data,
                    location: location,
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
        let location = this.state.location;
        let changedFields = this.state.changedFields || {};

        location[event.target.id] = event.target.value
        changedFields[event.target.id] = event.target.value

        this.setState({
            location: location,
            changedFields: changedFields
        })
    },
    handleClickCancel(event) {
        event.preventDefault()
        browserHistory.push(
            '/project/' + this.props.params.projectId
            + '/locations'
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
                    submitUrl:'/api/project_location/'
                        + data.id,
                    submitMethod: 'PUT',
                    location: data
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
                    <ProjectLocationsBreadcrumb { ...this.state } />

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
                                value={ this.state.location.content || '' }
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
                                value={ this.state.location.name }
                                onChange= { this.handleFieldChange }
                            />
                        </div>

                        <SectionHeader>description:</SectionHeader>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                id="description"
                                rows="3"
                                value={ this.state.location.description || '' }
                                onChange= { this.handleFieldChange }
                            />
                            <br />
                            <Card>
                                <CardBlock>
                                    <Description source={ this.state.location.description } />
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

module.exports.LocationEdit = LocationEdit
