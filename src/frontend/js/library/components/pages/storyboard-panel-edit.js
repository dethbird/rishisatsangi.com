import React from 'react'

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
        panel[event.target.id] = event.target.value
        this.setState({
            panel: panel
        })
    },
    render() {
        let that = this
        if (this.state){

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
                        <div className="panelRevisionsContainer">
                            { panelRevisionNodes }
                        </div>
                        <div className="form-group text-align-right clearfix">
                            <button className="btn btn-secondary">Cancel</button>
                            <button className="btn btn-success">Save</button>
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
