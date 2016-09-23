import React from 'react'

import { Card } from "../../ui/card"
import { CardBlock } from "../../ui/card-block"
import { Description } from "../../ui/description"


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
                        <h3>{ this.props.project.name }</h3>
                        <Description source={ this.props.project.description }></Description>
                    </div>
                </CardBlock>
            </div>
        </Card>
      );
    }
})

module.exports.ProjectDetails = ProjectDetails
