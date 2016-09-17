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
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">{ this.props.project.characters.length } Character(s)</li>
                    <li className="list-group-item">{ this.props.project.storyboards.length } Storyboard(s)</li>
                </ul>
                <div className="card-footer text-muted">
                    <TimeAgo date={ this.props.project.date_updated } />
                </div>
            </CardClickable>
        );
    }
})

module.exports.Project = Project
