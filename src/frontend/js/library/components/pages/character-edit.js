import React from 'react'
import {
    SortableItems,
    SortableItem
} from 'react-sortable-component'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { SectionHeader } from "../ui/section-header"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { Description } from "../ui/description"
import { Fountain } from "../ui/fountain"
import { ImagePanelRevision } from "../ui/image-panel-revision"
import {
    CharacterBreadcrumb
} from "./character/character-breadcrumb"
import { Spinner } from "../ui/spinner"


const CharacterEdit = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {

                let character = _.findWhere(data.characters, {
                    'id': parseInt(this.props.params.characterId)
                });

                let changedFields = null
                let submitUrl = '/api/project_character/'
                    + this.props.params.characterId
                let submitMethod = 'PUT'

                if (!character) {
                    character = {
                        name: '',
                        revisions: []
                    };
                    submitUrl = '/api/project_character'
                    submitMethod = 'POST'

                    changedFields = {
                        project_id: this.props.params.projectId
                    }
                }

                this.setState({
                    project: data,
                    character: character,
                    formState: null,
                    formMessage: null,
                    submitUrl: submitUrl,
                    submitMethod: submitMethod,
                    changedFields: changedFields
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleFieldChange(event) {
        let character = this.state.character;
        let changedFields = this.state.changedFields || {};

        character[event.target.id] = event.target.value
        changedFields[event.target.id] = event.target.value

        this.setState({
            character: character,
            changedFields: changedFields
        })
    },
    handleClickCancel(event) {
        event.preventDefault()
        browserHistory.push(
            '/project/' + this.props.params.projectId
            + '/characters'
        )
    },
    handleClickSubmit(event) {
        event.preventDefault()
        var that = this
        $.ajax({
            data: that.state.changedFields,
            dataType: 'json',
            cache: false,
            method: this.state.submitMethod,
            url: this.state.submitUrl,
            success: function(data) {
                this.setState({
                    formState: 'success',
                    formMessage: 'Success.',
                    submitUrl:'/api/project_character/'
                        + data.id,
                    submitMethod: 'PUT',
                    character: data
                })
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    formState: 'danger',
                    formMessage: 'Error: ' + xhr.responseText
                })
            }.bind(this)
        });
    },
    handleSort(items) {

        var that = this

        let character = this.state.character
        character.revisions = items
        this.setState({
            character: character
        });

        items = items.map(function(item, i){
            return (
                { 'id': item.id }
            );
        })

        $.post('/api/project_character_revision_order', {'items': items}, function(response){

            let character = that.state.character
            character.revisions = response.items
            that.setState({
                character: character,
                formState: 'success',
                formMessage: 'Order saved.'
            })
        });
    },
    render() {
        let that = this
        if (this.state){
            let characterRevisionNodes = this.state.character.revisions.map(function(revision, i) {
                let props = {};
                props.src = revision.content
                return (
                    <SortableItem
                        key={ revision.id }
                        className="card col-xs-4"
                    >
                        <ImagePanelRevision { ...props } ></ImagePanelRevision>
                    </SortableItem>
                );
            });

            return (
                <div>
                    <CharacterBreadcrumb { ...this.state }></CharacterBreadcrumb>
                    <Alert
                        status={ this.state.formState }
                        message={ this.state.formMessage }
                    />
                    <form>

                        <SectionHeader>name:</SectionHeader>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                placeholder="Name"
                                value={ this.state.character.name }
                                onChange= { this.handleFieldChange }
                            />
                        </div>

                        <SectionHeader>description:</SectionHeader>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                id="description"
                                rows="3"
                                value={ this.state.character.description || '' }
                                onChange= { this.handleFieldChange }
                            />
                            <br />
                            <Card>
                                <CardBlock>
                                    <Description source={ this.state.character.description } />
                                </CardBlock>
                            </Card>
                        </div>

                        <div className="form-group text-align-center">
                            <button
                                className="btn btn-secondary"
                                onClick={ that.handleClickCancel }
                            >Cancel</button>
                            <button
                                className="btn btn-success"
                                onClick={ that.handleClickSubmit }
                                disabled={ !that.state.changedFields }
                            >Save</button>
                        </div>

                        <SectionHeader>revisions:</SectionHeader>
                        <div className="form-group">
                            <div className="characterRevisionsContainer clearfix">
                                <SortableItems
                                    items={ that.state.character.revisions }
                                    onSort={ that.handleSort }
                                    name="sort-revisions-component"
                                >
                                    { characterRevisionNodes }
                                </SortableItems>
                            </div>
                        </div>

                    </form>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.CharacterEdit = CharacterEdit
