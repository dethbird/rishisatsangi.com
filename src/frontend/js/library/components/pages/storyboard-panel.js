import classNames from 'classnames'
import React from 'react'
import { browserHistory, Link } from 'react-router'

import { Card } from "../ui/card"
import { SectionHeader } from "../ui/section-header"
import { CardClickable } from "../ui/card-clickable"
import { CardComment } from "../ui/card-comment"
import { CardBlock } from "../ui/card-block"
import { CardStoryboardPanel } from "../ui/card-storyboard-panel"
import { Description } from "../ui/description"
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
        browserHistory.push(
            '/project/' + this.props.params.projectId
            + '/storyboard/' + this.props.params.storyboardId
            + '/panel/' + this.props.params.panelId
            + '/revision/' + revision_id
            + '/edit'
        )
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
                        <CardBlock>
                            <Description source={ revision.description } />
                        </CardBlock>
                    </CardClickable>
                );
            });

            let panelCommentNodes = this.state.panel.comments.map(function(comment) {
                return (
                    <CardComment
                        comment={ comment }
                        link= {
                            '/project/' + that.props.params.projectId
                            + '/storyboard/' + that.props.params.storyboardId
                            + '/panel/' + that.props.params.panelId
                            + '/comment/' + comment.id
                            + '/edit'
                        }
                        key={ comment.id }
                    >
                    </CardComment>
                );
            });

            return (
                <div>
                    <StoryboardPanelBreadcrumb { ...this.state }></StoryboardPanelBreadcrumb>
                    <div className="StoryboardPanelDetailsContainer">
                        <CardStoryboardPanel
                            projectId={ this.props.params.projectId }
                            storyboardId={ this.props.params.storyboardId }
                            panel={ this.state.panel }
                        ></CardStoryboardPanel>
                    </div>
                    <SectionHeader>{ this.state.panel.revisions.length } Revision(s)</SectionHeader>
                    <div className="clearfix PanelRevisionsContainer">
                        { panelRevisionNodes }
                        <Link
                            className="btn btn-success"
                            to={
                                '/project/' + that.props.params.projectId
                                + '/storyboard/' + that.props.params.storyboardId
                                + '/panel/' + that.props.params.panelId
                                + '/revision/add'
                            }
                        >Add</Link>
                    </div>
                    <SectionHeader>{ this.state.panel.comments.length } Comment(s)</SectionHeader>
                    <div className="clearfix PanelCommentsContainer">
                        { panelCommentNodes }
                        <Link
                            className="btn btn-success"
                            to={
                                '/project/' + that.props.params.projectId
                                + '/storyboard/' + that.props.params.storyboardId
                                + '/panel/' + that.props.params.panelId
                                + '/comment/add'
                            }
                        >Add</Link>
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
