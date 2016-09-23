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
import {
    ProjectCharactersBreadcrumb
} from './project-characters/project-characters-breadcrumb'
import { Spinner } from '../ui/spinner'


const ProjectCharactersEdit = React.createClass({
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
            + '/characters/'
        )
    },
    handleSort(items) {

        var that = this

        let project = that.state.project
        project.characters = items
        that.setState({
            project: project
        })

        items = items.map(function(item, i){
            return (
                { 'id': item.id }
            );
        })

        $.post('/api/project_character_order', {'items': items}, function(response){

            let project = that.state.project
            project.characters = response.items
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
            let characterNodes = this.state.project.characters.map(function(character) {
                let src;
                if (character.revisions.length) {
                    src = character.revisions[0].content;
                }
                return (
                    <SortableItem
                        key={ character.id }
                        className="card col-xs-4"
                    >
                        <div className="text-align-center">
                            <img className="card-img-top" src={ src } />
                        </div>
                    </SortableItem>
                );
            });

            return (
                <div>
                    <ProjectCharactersBreadcrumb project={ this.state.project } />

                    <Alert
                        status={ this.state.formState }
                        message={ this.state.formMessage }
                    />

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-secondary"
                                to={
                                    '/project/' + this.state.project.id + '/characters'
                                }>Cancel</Link>
                        </li>
                    </ul>
                    <br />

                    <SortableItems
                        items={ that.state.project.characters }
                        onSort={ that.handleSort }
                        name="sort-characters-component"
                    >
                        { characterNodes }
                    </SortableItems>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectCharactersEdit = ProjectCharactersEdit
