import React from 'react'
import {
    SortableItems,
    SortableItem
} from 'react-sortable-component'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { SectionHeader } from "../ui/section-header"
import { CardClickable } from "../ui/card-clickable"
// import { CardSortable } from "../ui/card-sortable"
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
                    formMessage: 'Success.',
                    submitUrl:'/api/project_storyboard_panel/'
                        + data.id,
                    submitMethod: 'PUT',
                    panel: data
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
    handleSort(items) {

        var that = this

        let panel = this.state.panel
        panel.revisions = items
        this.setState({
            panel: panel
        });

        $.post('/api/project_storyboard_panel_revision_order', {'items': items}, function(response){

            let panel = that.state.panel
            panel.revisions = response.items
            that.setState({
                panel: panel,
                formState: 'success',
                formMessage: 'Order saved.'
            })
        });
    },
    render() {
        let that = this
        if (this.state){
            let panelRevisionNodes = this.state.panel.revisions.map(function(revision, i) {
                let props = {};
                props.src = revision.content
                return (
                    <SortableItem
                        key={ revision.id }
                        className="card col-xs-4"
                    >
                        <ImagePanelRevision { ...props } ></ImagePanelRevision>
                    </SortableItem>
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
                                <SortableItems
                                    items={ that.state.panel.revisions }
                                    onSort={ that.handleSort }
                                    name="sort-revisions-component"
                                >
                                    { panelRevisionNodes }
                                </SortableItems>
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
