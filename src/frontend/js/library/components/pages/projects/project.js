import React from 'react'

import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { Description } from "../../ui/description"


const Project = React.createClass({
    propTypes: {
      project: React.PropTypes.object.isRequired,
      handleClick: React.PropTypes.func.isRequired
    },

    render: function() {
        return (
            <CardClickable
                className="project"
                onClick={ this.props.handleClick }
                key={ this.props.project.id }
            >
                <h3 className="card-header">{ this.props.project.name }</h3>
            </CardClickable>
        );
    }
})

module.exports.Project = Project
