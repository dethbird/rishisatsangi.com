import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { SectionHeader } from "../ui/section-header"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { ContentEdit } from "../ui/content-edit"
import { Description } from "../ui/description"
import { ImagePanelRevision } from "../ui/image-panel-revision"
import {
    CharacterBreadcrumb
} from "./character/character-breadcrumb"
import { Spinner } from "../ui/spinner"


const CharacterRevisionEdit = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {

                let character = _.findWhere(data.characters, {
                    'id': parseInt(this.props.params.characterId)
                });

                let revision = _.findWhere(character.revisions, {
                    'id': parseInt(this.props.params.revisionId)
                });

                let changedFields = null
                let submitUrl = '/api/project_character_revision/'
                    + this.props.params.revisionId
                let submitMethod = 'PUT'

                if (!revision) {
                    revision = {
                        name: '',
                        content: '',
                        description: ''
                    };
                    submitUrl = '/api/project_character_revision'
                    submitMethod = 'POST'

                    changedFields = {
                        character_id: this.props.params.characterId
                    }
                }

                this.setState({
                    project: data,
                    character: character,
                    revision: revision,
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
    handleContentSelection(event) {
        event.preventDefault()
        this.handleFieldChange({
            target: {
                id: 'content',
                value: event.target.src
            }
        })
    },
    handleFieldChange(event) {
        let revision = this.state.revision;
        let changedFields = this.state.changedFields || {};

        revision[event.target.id] = event.target.value
        changedFields[event.target.id] = event.target.value

        this.setState({
            revision: revision,
            changedFields: changedFields
        })
    },
    handleClickCancel(event) {
        event.preventDefault()
        browserHistory.push(
            '/project/' + this.props.params.projectId
            + '/character/' + this.props.params.characterId
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
                    submitUrl:'/api/project_character_revision/'
                        + data.id,
                    submitMethod: 'PUT',
                    revision: data
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
    render() {
        let that = this
        if (this.state){
            return (
                <div>
                    <CharacterBreadcrumb { ...this.state }></CharacterBreadcrumb>
                    <Alert
                        status={ this.state.formState }
                        message={ this.state.formMessage }
                    />
                    <form>

                        <SectionHeader>content:</SectionHeader>
                        <div className="form-group">
                            <ContentEdit
                                type="text"
                                id="content"
                                placeholder="Image Url"
                                value={ this.state.revision.content }
                                handleFieldChange={ this.handleFieldChange }
                            />
                        </div>

                        <SectionHeader>description:</SectionHeader>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                id="description"
                                rows="3"
                                value={ this.state.revision.description || '' }
                                onChange= { this.handleFieldChange }
                            />
                            <br />
                            <Card>
                                <CardBlock>
                                    <Description source={ this.state.revision.description } />
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
                    </form>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.CharacterRevisionEdit = CharacterRevisionEdit
