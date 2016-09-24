import React from 'react'
import { browserHistory } from 'react-router'

import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { SectionHeader } from "../../ui/section-header"


const ProjectStoryboards = React.createClass({
    propTypes: {
      project: React.PropTypes.object.isRequired
    },
    handleClick(project_id) {
        browserHistory.push('/project/' + project_id + '/storyboards');
    },
    render: function() {
        return (

            <div>
                <SectionHeader>Storyboards</SectionHeader>
                <CardClickable onClick={ this.handleClick.bind(this, this.props.project.id)} >
                    <CardBlock>
                        { this.props.project.storyboards.length } storyboard(s)
                    </CardBlock>
                </CardClickable>
            </div>
        );
    }
})

module.exports.ProjectStoryboards = ProjectStoryboards
