import React from 'react'
import { browserHistory } from 'react-router'

import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"


const ProjectCharacters = React.createClass({
    propTypes: {
      project: React.PropTypes.object.isRequired
    },
    handleClick(project_id) {
        browserHistory.push('/project/' + project_id + '/characters');
    },
    render: function() {
      return (
        <CardClickable onClick={ this.handleClick.bind(this, this.props.project.id)} >
            <div>
                <h3 className="card-header">Characters</h3>
                <CardBlock>
                    <div>
                        { this.props.project.characters.length } character(s)
                    </div>
                </CardBlock>
            </div>
        </CardClickable>
      );
    }
})

module.exports.ProjectCharacters = ProjectCharacters
