import classNames from 'classnames';
import React from 'react'

import { Card } from "../../ui/card"
import { CardBlock } from "../../ui/card-block"
import { CardClickable } from "../../ui/card-clickable"
import { Image } from "../../ui/image"

const PanelRevisions = React.createClass({

    propTypes: {
        revisions: React.PropTypes.array.isRequired,
        panelClassName: React.PropTypes.string,
        handleClickRevision: React.PropTypes.func
    },

    handleOnClick: function(src) {
        this.props.handleClickRevision(src);
    },
    render: function() {
        var that = this
        let panelRevisions = that.props.revisions.map(function(revision) {
            return (
                <CardClickable
                    className={ that.props.panelClassName }
                    key={ revision.id }
                    onClick={ that.handleOnClick.bind(that, revision.content) }
                >
                    <Image { ...{src: revision.content} } ></Image>
                </CardClickable>
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
