import React from 'react'
import { browserHistory } from 'react-router'

import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { SectionHeader } from "../../ui/section-header"


const ProjectCharacters = React.createClass({
    propTypes: {
      project: React.PropTypes.object.isRequired
    },
    handleClick(project_id) {
        browserHistory.push('/project/' + project_id + '/characters');
    },
    render: function() {
        return (
            <div>
                <SectionHeader>Characters</SectionHeader>
                <CardClickable onClick={ this.handleClick.bind(this, this.props.project.id)} >
                    <CardBlock>
                        { this.props.project.characters.length } character(s)
                    </CardBlock>
                </CardClickable>
            </div>
        );
    }
})

module.exports.ProjectCharacters = ProjectCharacters
