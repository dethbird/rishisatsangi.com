import React from 'react'
import ReactMarkdown from 'react-markdown'
import { browserHistory } from 'react-router'

import { Card } from "../ui/card"
import { SectionHeader } from "../ui/section-header"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { ImagePanelRevision } from "../ui/image-panel-revision"
import {
    StoryboardBreadcrumb
} from "./storyboard/storyboard-breadcrumb"
import { Spinner } from "../ui/spinner"


const Storyboard = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {
                let storyboard = _.findWhere(data.storyboards, {
                    'id': this.props.params.storyboardId
                });
                this.setState({
                    project: data,
                    storyboard: storyboard
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render() {

        if (this.state) {
            const { storyboard } = this.state

            var that = this;
            var storyboardPanelNodes = this.state.storyboard.panels.map(function(panel) {

                let props = {};
                if (panel.revisions.length > 0)
                    props.src = panel.revisions[0].content
                return (
                    <Card className="col-lg-4" key={ panel.id }>
                        <h4 className="card-header">{ panel.name }</h4>
                        <ImagePanelRevision { ...props } ></ImagePanelRevision>
                        <CardBlock>
                            <div>{ panel.comments.length } comment(s)</div>
                            <div>{ panel.revisions.length } revision(s)</div>
                        </CardBlock>
                    </Card>
                );
            });

            return (
                <div>
                    <StoryboardBreadcrumb
                        project={ this.state.project }
                        storyboard={ this.state.storyboard }
                    >
                    </StoryboardBreadcrumb>
                    <div className="StoryboardDetailsContainer">
                        <Card>
                            <h3 className="card-header">{ this.state.storyboard.name }</h3>
                            <CardBlock>
                                <div>farts</div>
                            </CardBlock>
                        </Card>
                    </div>
                    <SectionHeader>{ this.state.storyboard.panels.length } Panel(s)</SectionHeader>
                    <div className="StoryboardPanelsContainer">
                        { storyboardPanelNodes }
                    </div>
                </div>
            );

        }
        return (
            <Spinner />
        )
    }
})

module.exports.Storyboard = Storyboard
