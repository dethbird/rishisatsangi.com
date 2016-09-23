import React from 'react'
import { browserHistory } from 'react-router'
var DatePicker = require('react-datepicker');
var moment = require('moment');

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
                    'id': parseInt(this.props.params.storyboardId)
                });
                let panel = _.findWhere(storyboard.panels, {
                    'id': parseInt(this.props.params.panelId)
                });
                let comment = _.findWhere(panel.comments, {
                    'id': parseInt(this.props.params.commentId)
                });

                let changedFields = null
                let submitUrl = '/api/comment/' + this.props.params.commentId
                let submitMethod = 'PUT'


                if (!comment) {
                    comment = {
                        comment: ''
                    };
                    submitUrl = '/api/comment'
                    submitMethod = 'POST'

                    let user = data.users[0]

                    console.log(user);
                    console.log(moment().format('YYYY-MM-DD'));

                    changedFields = {
                        entity_id: this.props.params.panelId,
                        entity_table_name: 'project_storyboard_panels',
                        date_added: moment().format('YYYY-MM-DD'),
                        user_id: user.id,
                        'status': 'new'
                    }
                }

                this.setState({
                    project: data,
                    storyboard: storyboard,
                    panel: panel,
                    comment: comment,
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
    handleDateFieldChange(field, moment) {
        this.handleFieldChange({
            target: {
                id: field,
                value: moment.format("YYYY-MM-DD")
            }
        });
    },
    handleFieldChange(event) {
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
            url: that.state.submitUrl,
            data: that.state.changedFields,
            dataType: 'json',
            cache: false,
            method: that.state.submitMethod,
            success: function(data) {
                this.setState({
                    formState: 'success',
                    formMessage: 'Success.',
                    comment: data,
                    submitUrl: '/api/comment/' + data.id,
                    submitMethod:'PUT'
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
                            <DatePicker
                                selected={ moment(that.state.comment.date_added) }
                                onChange={ this.handleDateFieldChange.bind(this, 'date_added') }
                                dateFormat="YYYY-MM-DD"
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
