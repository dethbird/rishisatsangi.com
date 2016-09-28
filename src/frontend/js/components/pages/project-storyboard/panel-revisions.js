import classNames from 'classnames';
import React from 'react'

import { Card } from "../../ui/card"
import { CardBlock } from "../../ui/card-block"
import { Image } from "../../ui/image"

const PanelRevisions = React.createClass({

    propTypes: {
        revisions: React.PropTypes.array.isRequired,
        panelClassName: React.PropTypes.string
    },

    render: function() {
        var that = this
        let panelRevisions = that.props.revisions.map(function(revision) {
            return (
                <Card className={ that.props.panelClassName } key={ revision.id }>
                    <Image { ...{src: revision.content} } ></Image>
                </Card>
            );
        });

        let className = classNames([this.props.className, 'panelRevisions clearfix'])
        return (
            <div className={ className }>
                { panelRevisions }
            </div>
        );
    }
})

module.exports.PanelRevisions = PanelRevisions
