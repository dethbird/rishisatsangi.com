import React from 'react'

import { Card } from "../../ui/card"
import { CardBlock } from "../../ui/card-block"
import { Description } from "../../ui/description"
import { ImagePanelRevision } from "../../ui/image-panel-revision"
import { SectionHeader } from "../../ui/section-header"


const ProjectDetails = React.createClass({
    propTypes: {
      project: React.PropTypes.object.isRequired
    },

    render: function() {
      return (
          <div>
              <SectionHeader>Details:</SectionHeader>
              <Card>
                  <CardBlock>
                      <h3 className="card-title">{ this.props.project.name }</h3>
                      <ImagePanelRevision { ...{src: this.props.project.content }} />
                      <Description source={ this.props.project.description }></Description>
                  </CardBlock>
              </Card>
          </div>
      );
    }
})

module.exports.ProjectDetails = ProjectDetails
