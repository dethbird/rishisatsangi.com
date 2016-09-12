import React from 'react'


const ProjectItem = React.createClass({
    propTypes: {
      project: React.PropTypes.object.isRequired
    },

    render: function() {
      return (
        <div className="project-item">
            { this.props.project.name }
        </div>
      );
    }
})

module.exports.ProjectItem = ProjectItem
