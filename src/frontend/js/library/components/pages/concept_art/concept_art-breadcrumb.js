import React from 'react'
import { Link } from 'react-router'


const ConceptArtBreadcrumb = React.createClass({
    propTypes: {
        project: React.PropTypes.object.isRequired,
        concept_art: React.PropTypes.object.isRequired
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
                <li className="breadcrumb-item">
                    <Link
                        to={
                            '/project/' + this.props.project.id
                            + '/concept_art'
                        }
                    >
                        Concept Art
                    </Link>
                </li>
                <li className="breadcrumb-item">
                    { this.props.concept_art.name }
                </li>
            </ol>
        );
    }
})

module.exports.ConceptArtBreadcrumb = ConceptArtBreadcrumb
