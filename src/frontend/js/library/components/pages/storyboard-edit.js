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
import { CardBlock } from "../ui/card-block"
import { Description } from "../ui/description"
import { Fountain } from "../ui/fountain"
import { ImagePanelRevision } from "../ui/image-panel-revision"
import {
    StoryboardBreadcrumb
} from "./storyboard/storyboard-breadcrumb"
import { Spinner } from "../ui/spinner"


const StoryboardEdit = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {

                let storyboard = _.findWhere(data.storyboards, {
                    'id': this.props.params.storyboardId
                });

                let changedFields = null
                let submitUrl = '/api/project_storyboard/'
                    + this.props.params.storyboardId
                let submitMethod = 'PUT'

                if (!storyboard) {
                    storyboard = {
                        name: '',
                        panels: []
                    };
                    submitUrl = '/api/project_storyboard'
                    submitMethod = 'POST'

                    changedFields = {
                        project_id: this.props.params.projectId
                    }
                }

                this.setState({
                    project: data,
                    storyboard: storyboard,
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
        let storyboard = this.state.storyboard;
        let changedFields = this.state.changedFields || {};

        storyboard[event.target.id] = event.target.value
        changedFields[event.target.id] = event.target.value

        this.setState({
            storyboard: storyboard,
            changedFields: changedFields
        })
    },
    handleClickCancel(event) {
        event.preventDefault()
        browserHistory.push(
            '/project/' + this.props.params.projectId
            + '/storyboards'
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
                    submitUrl:'/api/project_storyboard/'
                        + data.id,
                    submitMethod: 'PUT',
                    storyboard: data
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

        let storyboard = this.state.storyboard
        storyboard.panels = items
        this.setState({
            storyboard: storyboard
        });

        items = items.map(function(item, i){
            return (
                { 'id': item.id }
            );
        })

        $.post('/api/project_storyboard_panel_order', {'items': items}, function(response){

            let storyboard = that.state.storyboard
            storyboard.panels = response.items
            that.setState({
                storyboard: storyboard,
                formState: 'success',
                formMessage: 'Order saved.'
            })
        });
    },
    render() {
        let that = this
        if (this.state){
            let panelNodes = this.state.storyboard.panels.map(function(panel, i) {
                let props = {};
                if (panel.revisions.length)
                    props.src = panel.revisions[0].content

                return (
                    <SortableItem
                        key={ panel.id }
                        className="card col-xs-4"
                    >
                        <ImagePanelRevision { ...props } ></ImagePanelRevision>
                    </SortableItem>
                );
            });

            return (
                <div>
                    <StoryboardBreadcrumb { ...this.state }></StoryboardBreadcrumb>
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
                                value={ this.state.storyboard.name }
                                onChange= { this.handleFieldChange }
                            />
                        </div>

                        <SectionHeader>description:</SectionHeader>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                id="description"
                                rows="3"
                                value={ this.state.storyboard.description || '' }
                                onChange= { this.handleFieldChange }
                            />
                            <br />
                            <Card>
                                <CardBlock>
                                    <Description source={ this.state.storyboard.description } />
                                </CardBlock>
                            </Card>
                        </div>

                        <SectionHeader>script:</SectionHeader>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                id="script"
                                rows="3"
                                value={ this.state.storyboard.script || '' }
                                onChange= { this.handleFieldChange }
                            />
                            <br />
                            <Card>
                                <CardBlock>
                                    <Fountain source={ this.state.storyboard.script } />
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

                        <SectionHeader>reorder panels:</SectionHeader>
                        <div className="form-group">
                            <div className="panelRevisionsContainer clearfix">
                                <SortableItems
                                    items={ that.state.storyboard.panels }
                                    onSort={ that.handleSort }
                                    name="sort-revisions-component"
                                >
                                    { panelNodes }
                                </SortableItems>
                            </div>
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

module.exports.StoryboardEdit = StoryboardEdit
