import React from 'react'
import { browserHistory } from 'react-router'

import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"


const ProjectStoryboards = React.createClass({
    propTypes: {
      project: React.PropTypes.object.isRequired
    },
    handleClick(project_id) {
        browserHistory.push('/project/' + project_id + '/storyboards');
    },
    render: function() {
      return (
        <CardClickable onClick={ this.handleClick.bind(this, this.props.project.id)} >
            <div>
                <h3 className="card-header">Storyboards</h3>
                <CardBlock>
                    <div>
                        { this.props.project.storyboards.length } storyboard(s)
                    </div>
                </CardBlock>
            </div>
        </CardClickable>
      );
    }
})

module.exports.ProjectStoryboards = ProjectStoryboards
