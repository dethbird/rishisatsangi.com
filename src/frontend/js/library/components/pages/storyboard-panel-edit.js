import React from 'react'
import { browserHistory } from 'react-router'

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

                this.setState({
                    project: data,
                    storyboard: storyboard,
                    panel: panel
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleFieldChange(event) {
        let panel = this.state.panel;
        let panelChangedFields = this.state.panelChangedFields || {};

        panel[event.target.id] = event.target.value
        panelChangedFields[event.target.id] = event.target.value

        this.setState({
            panel: panel,
            panelChangedFields: panelChangedFields
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
            url: '/api/project_storyboard_panel/' + this.props.params.panelId,
            dataType: 'json',
            cache: false,
            data: that.state.panelChangedFields,
            method: "PUT",
            success: function(data) {
                console.log(data)
                // let storyboard = _.findWhere(data.storyboards, {
                //     'id': this.props.params.storyboardId
                // });
                // let panel = _.findWhere(storyboard.panels, {
                //     'id': this.props.params.panelId
                // });
                //
                // this.setState({
                //     project: data,
                //     storyboard: storyboard,
                //     panel: panel
                // });
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(xhr)
                console.log(status)
                console.log(err)
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
                                disabled={ !that.state.panelChangedFields }
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
