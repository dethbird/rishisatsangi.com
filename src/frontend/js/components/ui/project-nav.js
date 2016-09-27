import classNames from 'classnames';
import React from 'react'

const ProjectNav = React.createClass({

    propTypes: {
        project: React.PropTypes.object.isRequired,
        className: React.PropTypes.string
    },

    render: function() {

        let storyboardNodes = this.props.project.storyboards.map(function(storyboard) {
            return (
                <a className="dropdown-item" key={ storyboard.id }>
                  { storyboard.name }
                </a>
            );
        });


        let className = classNames([this.props.className, 'nav nav-pills'])
        return (
            <ul className={ className }>
                <li className="nav-item">
                    <a
                      className="nav-link btn btn-secondary dropdown-toggle"
                      data-toggle="dropdown" role="button"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >Storyboards</a>
                  <div className="dropdown-menu">
                      { storyboardNodes }
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link btn btn-secondary" href="#">Characters</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link btn btn-secondary" href="#">Concept Art</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link btn btn-secondary" href="#">Reference Images</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link btn btn-secondary" href="#">Locations</a>
                </li>
            </ul>
        );
    }
})

module.exports.ProjectNav = ProjectNav
