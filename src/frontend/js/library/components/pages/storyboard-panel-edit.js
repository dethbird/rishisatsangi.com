import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { SectionHeader } from "../ui/section-header"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { Fountain } from "../ui/fountain"
import { ImagePanelRevision } from "../ui/image-panel-revision"
import {
    StoryboardPanelBreadcrumb
} from "./storyboard-panel/storyboard-panel-breadcrumb"
import { Spinner } from "../ui/spinner"


const StoryboardPanelEdit = React.createClass({
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

                let changedFields = null
                let submitUrl = '/api/project_storyboard_panel/'
                    + this.props.params.panelId
                let submitMethod = 'PUT'

                if (!panel) {
                    panel = {
                        name: '',
                        revisions: []
                    };
                    submitUrl = '/api/project_storyboard_panel'
                    submitMethod = 'POST'
                    changedFields = {
                        storyboard_id: this.props.params.storyboardId
                    }
                }

                this.setState({
                    project: data,
                    storyboard: storyboard,
                    panel: panel,
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
        let panel = this.state.panel;
        let changedFields = this.state.changedFields || {};

        panel[event.target.id] = event.target.value
        changedFields[event.target.id] = event.target.value

        this.setState({
            panel: panel,
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
            data: that.state.changedFields,
            dataType: 'json',
            cache: false,
            method: this.state.submitMethod,
            url: this.state.submitUrl,
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
            let panelRevisionNodes = this.state.panel.revisions.map(function(revision) {
                let props = {};
                props.src = revision.content
                return (
                    <Card
                        className="col-xs-4"
                        key={ revision.id }
                    >
                        <ImagePanelRevision { ...props } ></ImagePanelRevision>
                    </Card>
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

                        <SectionHeader>name:</SectionHeader>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Name"
                                value={ this.state.panel.name }
                                onChange= { this.handleFieldChange }
                            />
                        </div>

                        <SectionHeader>script:</SectionHeader>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                id="script"
                                rows="3"
                                value={ this.state.panel.script || '' }
                                onChange= { this.handleFieldChange }
                            />
                            <br />
                            <Card>
                                <CardBlock>
                                    <Fountain source={ this.state.panel.script } />
                                </CardBlock>
                            </Card>
                        </div>

                        <SectionHeader>revisions:</SectionHeader>
                        <div className="form-group">
                            <div className="panelRevisionsContainer clearfix">
                                { panelRevisionNodes }
                            </div>
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

module.exports.StoryboardPanelEdit = StoryboardPanelEdit
