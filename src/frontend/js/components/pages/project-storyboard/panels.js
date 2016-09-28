import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../../ui/alert"
import { Card } from "../../ui/card"
import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { FountainBlock } from "../../ui/fountain-block"
import { Image } from "../../ui/image"
import { MarkdownBlock } from "../../ui/markdown-block"
import { PanelRevisions } from "../../pages/project-storyboard/panel-revisions"
import { PanelComments } from "../../pages/project-storyboard/panel-comments"
import { Spinner } from "../../ui/spinner"


const Panels = React.createClass({
    getInitialState() {
        return ({
            panelMainSrc: []
        });
    },
    propTypes: {
        panels: React.PropTypes.array.isRequired
    },
    handleClickRevision(src) {
        console.log(src)
    },
    render() {
        let that = this

        if (this.state){

            var storyboardPanelNodes = this.props.panels.map(function(panel, i) {
                let props = {};
                if (panel.revisions.length > 0)
                    props.src = panel.revisions[0].content

                return (
                    <Card
                        className="col-lg-6"
                        key={ panel.id }
                    >
                        <h4 className="card-header">{ panel.name }</h4>
                        <Image { ...props } ></Image>
                        <CardBlock>
                            <MarkdownBlock source={ panel.description } />
                            <div className="card-section-header">{ panel.revisions.length } revision(s)</div>
                            <PanelRevisions
                                revisions={ panel.revisions }
                                panelClassName="col-xs-4"
                                handleClickRevision={ that.handleClickRevision }
                            />
                            {(() => {
                                if (panel.script) {
                                    return (
                                        <div className="card-section-header">script:</div>
                                    )
                                }
                            })()}
                            <FountainBlock source={ panel.script } />
                            {(() => {
                                if (panel.comments.length) {
                                    return (
                                        <div className="card-section-header">{ panel.comments.length } comment(s)</div>
                                    )
                                }
                            })()}
                            <PanelComments comments={ panel.comments }/>
                            <div className="pull-right"><span className="tag tag-default">{ i + 1 }</span></div>
                        </CardBlock>
                    </Card>
                );
            });

            return (
                <div>
                    { storyboardPanelNodes }
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.Panels = Panels
