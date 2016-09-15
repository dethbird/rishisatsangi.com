import React from 'react'
import { Link } from 'react-router'


const ProjectCharactersBreadcrumb = React.createClass({
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
                <li className="breadcrumb-item">Characters</li>
            </ol>
        );
    }
})

module.exports.ProjectCharactersBreadcrumb = ProjectCharactersBreadcrumb
