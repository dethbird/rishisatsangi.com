import React from 'react'
import {
    SortableItems,
    SortableItem
} from 'react-sortable-component'
import { browserHistory, Link } from 'react-router'

import { Alert } from '../ui/alert'
import { CardClickable } from '../ui/card-clickable'
import { CardBlock } from '../ui/card-block'
import { Description } from '../ui/description'
import { ImagePanelRevision } from "../ui/image-panel-revision"
import {
    ProjectLocationsBreadcrumb
} from './project-locations/project-locations-breadcrumb'
import { Spinner } from '../ui/spinner'


const ProjectLocationsEdit = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    project: data
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleClickCancel(event) {
        event.preventDefault()
        browserHistory.push(
            '/project/' + this.props.params.projectId
            + '/locations/'
        )
    },
    handleSort(items) {

        var that = this

        let project = that.state.project
        project.locations = items
        that.setState({
            project: project
        })

        items = items.map(function(item, i){
            return (
                { 'id': item.id }
            );
        })

        $.post('/api/project_location_order', {'items': items}, function(response){

            let project = that.state.project
            project.locations = response.items
            that.setState({
                project: project,
                formState: 'success',
                formMessage: 'Order saved.'
            })
        });
    },
    render() {
        let that = this
        if (this.state){
            let locationNodes = this.state.project.locations.map(function(location) {
                let props = {}
                props.src = location.content
                return (
                    <SortableItem
                        key={ location.id }
                        className="card col-xs-4"
                    >
                        <CardBlock>
                            { location.name }
                        </CardBlock>
                        <ImagePanelRevision { ...props } />
                    </SortableItem>
                );
            });

            return (
                <div>
                    <ProjectLocationsBreadcrumb project={ this.state.project } />

                    <Alert
                        status={ this.state.formState }
                        message={ this.state.formMessage }
                    />

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-secondary"
                                to={
                                    '/project/' + this.state.project.id + '/locations'
                                }>Cancel</Link>
                        </li>
                    </ul>
                    <br />

                    <SortableItems
                        items={ that.state.project.locations }
                        onSort={ that.handleSort }
                        name="sort-locations-component"
                    >
                        { locationNodes }
                    </SortableItems>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectLocationsEdit = ProjectLocationsEdit
