import React from 'react'
import { browserHistory } from 'react-router'

import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { SectionHeader } from "../../ui/section-header"


const ProjectConceptArts = React.createClass({
    propTypes: {
        project: React.PropTypes.object.isRequired
    },
    handleClick(project_id) {
        browserHistory.push('/project/' + project_id + '/concept_art');
    },
    render: function() {
        return (
            <div>
                <SectionHeader>Concept Art</SectionHeader>
                <CardClickable onClick={ this.handleClick.bind(this, this.props.project.id)} >
                    <CardBlock>
                        { this.props.project.concept_art.length } concept art(s)
                    </CardBlock>
                </CardClickable>
            </div>
        );
    }
})

module.exports.ProjectConceptArts = ProjectConceptArts
