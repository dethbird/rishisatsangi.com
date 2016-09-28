import classNames from 'classnames';
import React from 'react'

import { CardComment } from "../../ui/card-comment"

const PanelComments = React.createClass({

    propTypes: {
        comments: React.PropTypes.array.isRequired,
        commentClassName: React.PropTypes.string
    },

    render: function() {

        let panelComments = this.props.comments.map(function(comment) {
            return (
                <CardComment
                    comment={ comment }
                    key={ comment.id }
                >
                </CardComment>
            );
        });

        let className = classNames([this.props.className, 'panelComments clearix'])
        return (
            <div className={ className }>
                { panelComments }
            </div>
        );
    }
})

module.exports.PanelComments = PanelComments
