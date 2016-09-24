import React from 'react'
import { browserHistory } from 'react-router'

import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { SectionHeader } from "../../ui/section-header"


const ProjectReferenceImages = React.createClass({
    propTypes: {
        project: React.PropTypes.object.isRequired
    },
    handleClick(project_id) {
        browserHistory.push('/project/' + project_id + '/reference_images');
    },
    render: function() {
        return (
            <div>
                <SectionHeader>Reference Images</SectionHeader>
                <CardClickable onClick={ this.handleClick.bind(this, this.props.project.id)} >
                    <CardBlock>
                        { this.props.project.reference_images.length } character(s)
                    </CardBlock>
                </CardClickable>
            </div>
        );
    }
})

module.exports.ProjectReferenceImages = ProjectReferenceImages
