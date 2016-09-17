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


const StoryboardPanel = React.createClass({
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
    handleClickRevision(revision_id) {
        console.log(revision_id)
    },
    render() {
        let that = this
        if (this.state){

            let panelRevisionNodes = this.state.panel.revisions.map(function(revision) {
                let props = {};
                    props.src = revision.content
                return (
                    <CardClickable
                        className="col-lg-4"
                        key={ revision.id }
                        onClick={ that.handleClickRevision.bind(that, revision.id) }
                    >
                        <ImagePanelRevision { ...props } ></ImagePanelRevision>
                    </CardClickable>
                );
            });

            let panelCommentNodes = this.state.panel.comments.map(function(comment) {
                return (
                    <Card
                        key={ comment.id }
                    >
                        <CardBlock
                            className={ comment.status }
                        >
                            {comment.comment}
                        </CardBlock>
                        <div className="card-footer text-muted">
                            by { comment.username } on { comment.date_added }
                        </div>
                    </Card>
                );
            });

            let props = {};
            if (this.state.panel.revisions.length > 0)
                props.src = this.state.panel.revisions[0].content

            return (
                <div>
                    <StoryboardPanelBreadcrumb { ...this.state }></StoryboardPanelBreadcrumb>
                    <div className="StoryboardPanelDetailsContainer">
                        <Card>
                            <h3 className="card-header">{ this.state.panel.name }</h3>
                            <ImagePanelRevision { ...props } ></ImagePanelRevision>
                            <CardBlock>
                                <Fountain source={ this.state.panel.script }></Fountain>
                            </CardBlock>
                        </Card>
                    </div>
                    <SectionHeader>{ this.state.panel.revisions.length } Revisions(s)</SectionHeader>
                    <div className="clearfix PanelRevisionsContainer">
                        { panelRevisionNodes }
                    </div>
                    <SectionHeader>{ this.state.panel.comments.length } Comments(s)</SectionHeader>
                    <div className="clearfix PanelCommentsContainer">
                        { panelCommentNodes }
                    </div>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.StoryboardPanel = StoryboardPanel
