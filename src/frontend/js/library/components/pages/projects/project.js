import classNames from 'classnames';
import React from 'react'
import TimeAgo from 'react-timeago'

import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { Description } from "../../ui/description"


const Project = React.createClass({
    propTypes: {
      project: React.PropTypes.object.isRequired,
      handleClick: React.PropTypes.func.isRequired,
      className: React.PropTypes.string
    },

    render: function() {

        let className = classNames([this.props.className, 'project'])

        return (
            <CardClickable
                className={ className }
                onClick={ this.props.handleClick }
                key={ this.props.project.id }
            >
                <h3 className="card-header">{ this.props.project.name }</h3>
                <CardBlock>
                    <TimeAgo date={ this.props.project.date_updated } />
                </CardBlock>
            </CardClickable>
        );
    }
})

module.exports.Project = Project
