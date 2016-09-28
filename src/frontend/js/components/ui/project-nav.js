import classNames from 'classnames';
import React from 'react'
import { Link } from 'react-router'

const ProjectNav = React.createClass({

    propTypes: {
        project: React.PropTypes.object.isRequired,
        className: React.PropTypes.string
    },

    render: function() {

        let that = this;

        let storyboardNodes = this.props.project.storyboards.map(function(storyboard) {
            return (
                <Link
                  className="dropdown-item"
                  key={ storyboard.id }
                  to={
                    '/project/' + that.props.project.id
                    + '/storyboard/' + storyboard.id
                  }
                >
                  { storyboard.name }
                </Link>
            );
        });

        let className = classNames([this.props.className, 'nav nav-pills'])
        return (
            <div className="btn-group">
            <Link
                className="btn btn-secondary"
                to={
                    '/project/' + this.props.project.id
                    + '/projects'
                }
                >Projects</Link>
                <Link
                    className="btn btn-secondary dropdown-toggle"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false">
                Storyboards
                </Link>
                <Link
                    className="btn btn-secondary"
                    to={
                        '/project/' + this.props.project.id
                        + '/characters'
                    }
                >Characters</Link>
                <Link
                    className="btn btn-secondary"
                    to={
                        '/project/' + this.props.project.id
                        + '/concept_art'
                    }
                >Concept Art</Link>
                <Link
                    className="btn btn-secondary"
                    to={
                        '/project/' + this.props.project.id
                        + '/reference_images'
                    }
                >Reference Images</Link>
                <Link
                    className="btn btn-secondary"
                    to={
                        '/project/' + this.props.project.id
                        + '/locations'
                    }
                >Locations</Link>
                <div className="dropdown-menu">
                    { storyboardNodes }
                </div>
            </div>
        );
    }
})

module.exports.ProjectNav = ProjectNav
