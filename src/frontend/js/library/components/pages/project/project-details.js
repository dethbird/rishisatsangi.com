import React from 'react'

import { Card } from "../../ui/card"
import { CardBlock } from "../../ui/card-block"


const ProjectDetails = React.createClass({
    propTypes: {
      project: React.PropTypes.object.isRequired
    },

    render: function() {
      return (
        <Card>
            <div>
                <h3 className="card-header">Details</h3>
                <CardBlock>
                    <div>
                        <h5>{ this.props.project.name }</h5>
                        <blockquote>{ this.props.project.description }</blockquote>
                    </div>
                </CardBlock>
            </div>
        </Card>
      );
    }
})

module.exports.ProjectDetails = ProjectDetails
