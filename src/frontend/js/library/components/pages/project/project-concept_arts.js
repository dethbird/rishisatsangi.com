import React from 'react'
import { browserHistory } from 'react-router'

import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"


const ProjectConceptArts = React.createClass({
    propTypes: {
      project: React.PropTypes.object.isRequired
    },
    handleClick(project_id) {
        browserHistory.push('/project/' + project_id + '/concept_arts');
    },
    render: function() {
      return (
        <CardClickable onClick={ this.handleClick.bind(this, this.props.project.id)} >
            <div>
                <h3 className="card-header">Concept Art</h3>
                <CardBlock>
                    <div>
                        { this.props.project.concept_art.length } concept(s)
                    </div>
                </CardBlock>
            </div>
        </CardClickable>
      );
    }
})

module.exports.ProjectConceptArts = ProjectConceptArts
