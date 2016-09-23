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
    ProjectReferenceImagesBreadcrumb
} from './project-reference_images/project-reference_images-breadcrumb'
import { Spinner } from '../ui/spinner'


const ProjectReferenceImagesEdit = React.createClass({
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
            + '/reference_images/'
        )
    },
    handleSort(items) {

        var that = this

        let project = that.state.project
        project.reference_images = items
        that.setState({
            project: project
        })

        items = items.map(function(item, i){
            return (
                { 'id': item.id }
            );
        })

        $.post('/api/project_reference_image_order', {'items': items}, function(response){

            let project = that.state.project
            project.reference_images = response.items
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
            let reference_imageNodes = this.state.project.reference_images.map(function(reference_image) {
                let props = {}
                props.src = reference_image.content
                return (
                    <SortableItem
                        key={ reference_image.id }
                        className="card col-xs-4"
                    >
                        <ImagePanelRevision { ...props } />
                    </SortableItem>
                );
            });

            return (
                <div>
                    <ProjectReferenceImagesBreadcrumb project={ this.state.project } />

                    <Alert
                        status={ this.state.formState }
                        message={ this.state.formMessage }
                    />

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-secondary"
                                to={
                                    '/project/' + this.state.project.id + '/reference_images'
                                }>Cancel</Link>
                        </li>
                    </ul>
                    <br />

                    <SortableItems
                        items={ that.state.project.reference_images }
                        onSort={ that.handleSort }
                        name="sort-reference_images-component"
                    >
                        { reference_imageNodes }
                    </SortableItems>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectReferenceImagesEdit = ProjectReferenceImagesEdit
