import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { SectionHeader } from "../ui/section-header"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { Description } from "../ui/description"
import { ImagePanelRevision } from "../ui/image-panel-revision"
import {
    StoryboardPanelBreadcrumb
} from "./storyboard-panel/storyboard-panel-breadcrumb"
import { Spinner } from "../ui/spinner"


const StoryboardPanelCommentEdit = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {

                let storyboard = _.findWhere(data.storyboards, {
                    'id': this.props.params.storyboardId
                });
                let panel = _.findWhere(storyboard.panels, {
                    'id': this.props.params.panelId
                });
                let comment = _.findWhere(panel.comments, {
                    'id': this.props.params.commentId
                });

                this.setState({
                    project: data,
                    storyboard: storyboard,
                    panel: panel,
                    comment: comment,
                    formState: null,
                    formMessage: null
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleFieldChange(event, field) {
        let comment = this.state.comment;
        let changedFields = this.state.changedFields || {};

        comment[event.target.id] = event.target.value
        changedFields[event.target.id] = event.target.value

        this.setState({
            comment: comment,
            changedFields: changedFields
        })
    },
    handleClickCancel(event) {
        event.preventDefault()
        browserHistory.push(
            '/project/' + this.props.params.projectId
            + '/storyboard/' + this.props.params.storyboardId
            + '/panel/' + this.props.params.panelId
        )
    },
    handleClickSubmit(event) {
        event.preventDefault()
        var that = this
        $.ajax({
            url: '/api/project_storyboard_panel_comment/' + this.props.params.commentId,
            dataType: 'json',
            cache: false,
            data: that.state.changedFields,
            method: "PUT",
            success: function(data) {
                this.setState({
                    formState: 'success',
                    formMessage: 'Success.'
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
            console.log(this.state)

            let userOptionsNodes = this.state.project.users.map(function(user) {
                return (
                    <option value={ user.id } key={ user.id }>{ user.username }</option>
                );
            });

            return (
                <div>
                    <StoryboardPanelBreadcrumb { ...this.state }></StoryboardPanelBreadcrumb>
                    <Alert
                        status={ this.state.formState }
                        message={ this.state.formMessage }
                    />
                    <form>
                        <SectionHeader>user:</SectionHeader>
                        <select
                            id="user_id"
                            className="form-control"
                            value={ this.state.comment.user_id }
                            onChange={ that.handleFieldChange }
                        >
                            { userOptionsNodes }
                        </select>

                        <SectionHeader>comment:</SectionHeader>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                id="comment"
                                rows="3"
                                value={ this.state.comment.comment || '' }
                                onChange= { this.handleFieldChange }
                            />
                            <br />
                            <Card>
                                <CardBlock>
                                    <Description source={ this.state.comment.comment } />
                                </CardBlock>
                            </Card>
                        </div>

                        <SectionHeader>date:</SectionHeader>
                        <div className="form-group">
                            <input
                                type="text"
                                value={ that.state.comment.date_added }
                                onChange={ that.handleFieldChange }
                                id="date_added"
                                className="form-control"
                            />
                        </div>

                        <SectionHeader>status:</SectionHeader>
                        <select
                            id="status"
                            className="form-control"
                            value={ this.state.comment.status }
                            onChange={ that.handleFieldChange }
                        >
                            <option value="new">New</option>
                            <option value="resolved">Resolved</option>
                        </select>

                        <br />
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

module.exports.StoryboardPanelCommentEdit = StoryboardPanelCommentEdit
