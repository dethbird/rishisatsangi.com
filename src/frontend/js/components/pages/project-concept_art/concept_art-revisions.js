import classNames from 'classnames';
import React from 'react'

import { Card } from "../../ui/card"
import { CardBlock } from "../../ui/card-block"
import { CardClickable } from "../../ui/card-clickable"
import { Image } from "../../ui/image"

const ConceptArtRevisions = React.createClass({
    propTypes: {
        revisions: React.PropTypes.array.isRequired,
        revisionClassName: React.PropTypes.string,
        handleClickRevision: React.PropTypes.func,
        selectedRevision: React.PropTypes.object
    },

    handleOnClick: function(revision) {
        this.props.handleClickRevision(revision);
    },
    render: function() {
        var that = this
        let revisionNodes = that.props.revisions.map(function(revision) {

            let className = that.props.revisionClassName;
            if (that.props.selectedRevision) {
                if (revision.id == that.props.selectedRevision.id) {
                    className = classNames([className, 'active']);
                }
            }
            return (
                <CardClickable
                    className={ className }
                    key={ revision.id }
                    onClick={ that.handleOnClick.bind(that, revision) }
                >
                    <Image { ...{src: revision.content} } ></Image>
                </CardClickable>
            );
        });

        let className = classNames([this.props.className, 'panelRevisions clearfix'])
        return (
            <div className={ className }>
                { revisionNodes }
            </div>
        );
    }
})

module.exports.ConceptArtRevisions = ConceptArtRevisions
