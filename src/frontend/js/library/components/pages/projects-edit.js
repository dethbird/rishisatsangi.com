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
    ProjectsBreadcrumb
} from './projects/projects-breadcrumb'
import { Spinner } from '../ui/spinner'


const ProjectsEdit = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/projects',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({
                    projects: data
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
            '/projects/'
        )
    },
    handleSort(items) {

        var that = this

        that.setState({
            projects: items
        })

        items = items.map(function(item, i){
            return (
                { 'id': item.id }
            );
        })

        $.post('/api/projects_order', {'items': items}, function(response){
            that.setState({
                projects: response.items,
                formState: 'success',
                formMessage: 'Order saved.'
            })
        });
    },
    render() {
        let that = this
        if (this.state){
            let projectNodes = this.state.projects.map(function(project) {
                return (
                    <SortableItem
                        key={ project.id }
                        className="card col-xs-4"
                    >
                        <CardBlock>
                            { project.name }
                        </CardBlock>
                        <CardBlock>
                            <ImagePanelRevision { ...{src: project.content } } />
                        </CardBlock>
                    </SortableItem>
                );
            });

            return (
                <div>
                    <ProjectsBreadcrumb />

                    <Alert
                        status={ this.state.formState }
                        message={ this.state.formMessage }
                    />

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-secondary"
                                to={
                                    '/projects'
                                }>Cancel</Link>
                        </li>
                    </ul>
                    <br />

                    <SortableItems
                        items={ that.state.projects }
                        onSort={ that.handleSort }
                        name="sort-projects-component"
                    >
                        { projectNodes }
                    </SortableItems>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectsEdit = ProjectsEdit
