import React from 'react'
import { Link } from 'react-router'


const ProjectBreadcrumb = React.createClass({
    propTypes: {
        project: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Projects</Link></li>
                <li className="breadcrumb-item">{ this.props.project.name }</li>
            </ol>
        );
    }
})

module.exports.ProjectBreadcrumb = ProjectBreadcrumb
