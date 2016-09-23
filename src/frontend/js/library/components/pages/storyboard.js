import React from 'react'
import ReactMarkdown from 'react-markdown'
import { browserHistory, Link } from 'react-router'

import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { Description } from "../ui/description"
import { Fountain } from "../ui/fountain"
import { ImagePanelRevision } from "../ui/image-panel-revision"
import { SectionHeader } from "../ui/section-header"
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
                    'id': parseInt(this.props.params.storyboardId)
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
    handleClick(panel_id) {
        browserHistory.push(
            '/project/' + this.props.params.projectId
            + '/storyboard/' + this.props.params.storyboardId
            + '/panel/' + panel_id
        )
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
                    <CardClickable
                        className="col-lg-4"
                        key={ panel.id }
                        onClick={ that.handleClick.bind(that, panel.id) }
                    >
                        <h4 className="card-header">{ panel.name }</h4>
                        <ImagePanelRevision { ...props } ></ImagePanelRevision>
                        <CardBlock>
                            <div>{ panel.comments.length } comment(s)</div>
                            <div>{ panel.revisions.length } revision(s)</div>
                        </CardBlock>
                    </CardClickable>
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
                                <Description source ={ this.state.storyboard.description } />
                            </CardBlock>
                            <div className='card-footer text-muted clearfix'>
                                <Link to={
                                    '/project/' + this.props.params.projectId
                                    + '/storyboard/' + this.props.params.storyboardId
                                    + '/edit'
                                }>Edit</Link>
                            </div>
                        </Card>
                    </div>

                    <SectionHeader>Script</SectionHeader>
                    <div className="StoryboardPanelsContainer">
                        <Card>
                            <CardBlock>
                                <Fountain source={ this.state.storyboard.script } />
                            </CardBlock>
                        </Card>
                    </div>

                    <SectionHeader>{ this.state.storyboard.panels.length } Panel(s)</SectionHeader>
                    <div className="StoryboardPanelsContainer">
                        { storyboardPanelNodes }
                        <Link
                            className="btn btn-success"
                            to={
                                '/project/' + that.props.params.projectId
                                + '/storyboard/' + that.props.params.storyboardId
                                + '/panel/add'
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

module.exports.Storyboard = Storyboard
