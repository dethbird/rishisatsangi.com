import React from 'react'
import {
    SortableItems,
    SortableItem
} from 'react-sortable-component'
import { browserHistory, Link } from 'react-router'

import { CardClickable } from '../ui/card-clickable'
import { CardBlock } from '../ui/card-block'
import { Description } from '../ui/description'
import { ImagePanelRevision } from "../ui/image-panel-revision"
import {
    ProjectConceptArtBreadcrumb
} from './project-concept_art/project-concept_art-breadcrumb'
import { Spinner } from '../ui/spinner'


const ProjectConceptArtEdit = React.createClass({
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
            + '/concept_art/'
        )
    },
    handleSort(items) {

        var that = this

        let project = that.state.project
        project.concept_art = items
        that.setState({
            project: project
        })

        items = items.map(function(item, i){
            return (
                { 'id': item.id }
            );
        })

        $.post('/api/project_concept_art_order', {'items': items}, function(response){

            let project = that.state.project
            project.concept_art = response.items
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
            let concept_artNodes = this.state.project.concept_art.map(function(concept_art) {
                let props = {};
                if (concept_art.revisions.length) {
                    props.src = concept_art.revisions[0].content;
                }
                return (
                    <SortableItem
                        key={ concept_art.id }
                        className="card col-xs-4"
                    >
                        <div className="text-align-center">
                            <ImagePanelRevision { ...props } />
                        </div>
                    </SortableItem>
                );
            });

            return (
                <div>
                    <ProjectConceptArtBreadcrumb project={ this.state.project } />

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-secondary"
                                to={
                                    '/project/' + this.state.project.id + '/concept_art'
                                }>Cancel</Link>
                        </li>
                    </ul>
                    <br />

                    <SortableItems
                        items={ that.state.project.concept_art }
                        onSort={ that.handleSort }
                        name="sort-concept_art-component"
                    >
                        { concept_artNodes }
                    </SortableItems>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectConceptArtEdit = ProjectConceptArtEdit
