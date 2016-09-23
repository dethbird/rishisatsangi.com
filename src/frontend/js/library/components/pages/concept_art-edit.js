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
    ConceptArtBreadcrumb
} from "./concept_art/concept_art-breadcrumb"
import { Spinner } from "../ui/spinner"


const ConceptArtEdit = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {

                let concept_art = _.findWhere(data.concept_art, {
                    'id': parseInt(this.props.params.conceptArtId)
                });

                let changedFields = null
                let submitUrl = '/api/project_concept_art/'
                    + this.props.params.conceptArtId
                let submitMethod = 'PUT'

                if (!concept_art) {
                    concept_art = {
                        name: '',
                        revisions: []
                    };
                    submitUrl = '/api/project_concept_art'
                    submitMethod = 'POST'

                    changedFields = {
                        project_id: this.props.params.projectId
                    }
                }

                this.setState({
                    project: data,
                    concept_art: concept_art,
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
        let concept_art = this.state.concept_art;
        let changedFields = this.state.changedFields || {};

        concept_art[event.target.id] = event.target.value
        changedFields[event.target.id] = event.target.value

        this.setState({
            concept_art: concept_art,
            changedFields: changedFields
        })
    },
    handleClickCancel(event) {
        event.preventDefault()
        browserHistory.push(
            '/project/' + this.props.params.projectId
            + '/concept_art'
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
                    submitUrl:'/api/project_concept_art/'
                        + data.id,
                    submitMethod: 'PUT',
                    concept_art: data
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

        let concept_art = this.state.concept_art
        concept_art.revisions = items
        this.setState({
            concept_art: concept_art
        });

        items = items.map(function(item, i){
            return (
                { 'id': item.id }
            );
        })

        $.post('/api/project_concept_art_revision_order', {'items': items}, function(response){

            let concept_art = that.state.concept_art
            concept_art.revisions = response.items
            that.setState({
                concept_art: concept_art,
                formState: 'success',
                formMessage: 'Order saved.'
            })
        });
    },
    render() {
        let that = this
        if (this.state){
            let concept_artRevisionNodes = this.state.concept_art.revisions.map(function(revision, i) {

                let props = {};
                props.src = revision.content

                return (
                    <SortableItem
                        key={ revision.id }
                        className="card col-xs-4"
                    >
                        <ImagePanelRevision { ...props } />
                    </SortableItem>
                );
            });

            return (
                <div>
                    <ConceptArtBreadcrumb { ...this.state }></ConceptArtBreadcrumb>
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
                                value={ this.state.concept_art.name }
                                onChange= { this.handleFieldChange }
                            />
                        </div>

                        <SectionHeader>description:</SectionHeader>
                        <div className="form-group">
                            <textarea
                                className="form-control"
                                id="description"
                                rows="3"
                                value={ this.state.concept_art.description || '' }
                                onChange= { this.handleFieldChange }
                            />
                            <br />
                            <Card>
                                <CardBlock>
                                    <Description source={ this.state.concept_art.description } />
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
                            <div className="concept_artRevisionsContainer clearfix">
                                <SortableItems
                                    items={ that.state.concept_art.revisions }
                                    onSort={ that.handleSort }
                                    name="sort-revisions-component"
                                >
                                    { concept_artRevisionNodes }
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

module.exports.ConceptArtEdit = ConceptArtEdit
