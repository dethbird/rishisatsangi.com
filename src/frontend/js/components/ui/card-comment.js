import { Link } from 'react-router'
import classNames from 'classnames';
import React from 'react'
import TimeAgo from 'react-timeago'

import { Card } from "../ui/card"
import { CardBlock } from "../ui/card-block"
import { MarkdownBlock } from "../ui/markdown-block"

const CardComment = React.createClass({

    propTypes: {
        comment: React.PropTypes.object.isRequired
    },

    render: function() {
        let className = classNames(['comment', this.props.comment.status])
        return (
            <Card
                className={ className }
            >
                <CardBlock>
                    <MarkdownBlock source={ this.props.comment.comment } />
                    <div className="pull-right">
                        <strong>{ this.props.comment.user.username }</strong>
                        <TimeAgo
                            className="muted"
                            date={ this.props.comment.date_added }
                        />
                    </div>

                </CardBlock>
            </Card>
        );
    }
})

module.exports.CardComment = CardComment
