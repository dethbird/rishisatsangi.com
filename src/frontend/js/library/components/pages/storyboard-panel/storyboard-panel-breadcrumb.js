import React from 'react'
import { Link } from 'react-router'


const StoryboardPanelBreadcrumb = React.createClass({

    propTypes: {
        project: React.PropTypes.object.isRequired,
        storyboard: React.PropTypes.object.isRequired,
        panel: React.PropTypes.object
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
                            + '/storyboards'
                        }
                    >
                        Storyboards
                    </Link>
                </li>
                <li className="breadcrumb-item">
                    <Link
                        to={
                            '/project/' + this.props.project.id
                            + '/storyboard/' + this.props.storyboard.id
                        }
                    >
                        { this.props.storyboard.name }
                    </Link>
                </li>
                <li className="breadcrumb-item">
                    Panels
                </li>
                <li className="breadcrumb-item">
                    { this.props.panel ? this.props.panel.name : 'Add' }
                </li>
            </ol>
        );
    }
})

module.exports.StoryboardPanelBreadcrumb = StoryboardPanelBreadcrumb
