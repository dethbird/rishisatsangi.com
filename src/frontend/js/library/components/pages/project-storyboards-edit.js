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
import { ImagePanelRevision } from '../ui/image-panel-revision'
import {
    ProjectStoryboardsBreadcrumb
} from './project-storyboards/project-storyboards-breadcrumb'
import { Spinner } from '../ui/spinner'


const ProjectStoryboardsEdit = React.createClass({
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
            + '/storyboards/'
        )
    },
    handleSort(items) {

        var that = this

        let project = that.state.project
        project.storyboards = items
        that.setState({
            project: project
        })

        items = items.map(function(item, i){
            return (
                { 'id': item.id }
            );
        })

        $.post('/api/project_storyboard_order', {'items': items}, function(response){

            let project = that.state.project
            project.storyboards = response.items
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
            let storyboardNodes = this.state.project.storyboards.map(function(storyboard) {
                let src;
                if (storyboard.panels.length) {
                    src = storyboard.panels[0].content;
                }
                return (
                    <SortableItem
                        key={ storyboard.id }
                        className="card col-xs-4"
                    >
                        <h3 className="card-title">{ storyboard.name }</h3>
                        <ImagePanelRevision {... {src: src }} />
                    </SortableItem>
                );
            });

            return (
                <div>
                    <ProjectStoryboardsBreadcrumb project={ this.state.project } />

                    <Alert
                        status={ this.state.formState }
                        message={ this.state.formMessage }
                    />

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-secondary"
                                to={
                                    '/project/' + this.state.project.id + '/storyboards'
                                }>Cancel</Link>
                        </li>
                    </ul>
                    <br />

                    <SortableItems
                        items={ that.state.project.storyboards }
                        onSort={ that.handleSort }
                        name="sort-storyboards-component"
                    >
                        { storyboardNodes }
                    </SortableItems>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectStoryboardsEdit = ProjectStoryboardsEdit
