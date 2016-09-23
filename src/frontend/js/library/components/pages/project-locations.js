import React from 'react'
import { browserHistory, Link } from 'react-router'

import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { Description } from "../ui/description"
import { ImagePanelRevision } from "../ui/image-panel-revision"
import {
    ProjectLocationsBreadcrumb
} from "./project-locations/project-locations-breadcrumb"
import { Spinner } from "../ui/spinner"


const ProjectLocations = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({project: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleClick(project_id, location_id) {
        browserHistory.push(
            '/project/' + project_id + '/location/' + location_id + '/edit');
    },
    render() {
        if (this.state) {
            var that = this;
            var locationNodes = this.state.project.locations.map(function(location) {
                return (
                    <CardClickable
                        className="col-lg-6"
                        key={ location.id }
                        onClick={
                            that.handleClick.bind(
                                that,
                                that.state.project.id,
                                location.id
                            )
                        }
                    >
                        <h3 className="card-header">{ location.name }</h3>
                        <ImagePanelRevision { ...{ src: location.content }} />
                        <CardBlock>
                            <Description source={ location.description }></Description>
                        </CardBlock>
                    </CardClickable>
                );
            });
            return (
                <div>
                    <ProjectLocationsBreadcrumb project={ this.state.project } />

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-info"
                                to={
                                    '/project/' + this.state.project.id + '/locations/edit'
                                }>Reorder</Link>
                        </li>
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-success"
                                to={
                                    '/project/' + this.state.project.id + '/location/add'
                                }>Add</Link>
                        </li>
                    </ul>
                    <br />

                    <div className="projectLocationsList">
                        { locationNodes }
                    </div>
                </div>
            )
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectLocations = ProjectLocations
