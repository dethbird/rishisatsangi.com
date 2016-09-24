import { Link } from 'react-router'
import classNames from 'classnames';
import React from 'react'
import TimeAgo from 'react-timeago'

import { Card } from "../ui/card"
import { CardBlock } from "../ui/card-block"

const CardComment = React.createClass({

    propTypes: {
        comment: React.PropTypes.object.isRequired,
        link: React.PropTypes.string.isRequired
    },

    render: function() {
        console.log(this.props.comment);
        let className = classNames(['comment', this.props.comment.status])
        return (
            <Card
                className={ className }
            >
                <CardBlock>
                    <strong>{ this.props.comment.user.username }:</strong><br />
                    <blockquote>{ this.props.comment.comment }</blockquote>
                </CardBlock>
                <div className="card-footer text-muted clearfix">
                    <Link to={ this.props.link }>
                        <TimeAgo date={ this.props.comment.date_added } />
                    </Link>
                </div>
            </Card>
        );
    }
})

module.exports.CardComment = CardComment
