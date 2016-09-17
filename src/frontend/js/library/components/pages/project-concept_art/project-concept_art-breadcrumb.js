import React from 'react'
import { Link } from 'react-router'


const ProjectConceptArtBreadcrumb = React.createClass({
    propTypes: {
        project: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            <ol className="breadcrumb">
                <li className="breadcrumb-item"><Link to="/">Projects</Link></li>
                <li className="breadcrumb-item">
                    <Link to={ '/project/' + this.props.project.id }>
                        { this.props.project.name }
                    </Link>
                </li>
                <li className="breadcrumb-item">Concept Art</li>
            </ol>
        );
    }
})

module.exports.ProjectConceptArtBreadcrumb = ProjectConceptArtBreadcrumb
