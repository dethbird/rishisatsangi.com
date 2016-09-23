import React from 'react'
import { browserHistory, Link } from 'react-router'

import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import {
    ConceptArtBreadcrumb
} from "./concept_art/concept_art-breadcrumb"
import { Description } from "../ui/description"
import { ImagePanelRevision } from "../ui/image-panel-revision"
import { SectionHeader } from "../ui/section-header"
import { Spinner } from "../ui/spinner"


const ConceptArt = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {

                let concept_art = _.findWhere(data.concept_art, {
                    'id': parseInt(this.props.params.conceptArtId)
                });

                if (!concept_art) {
                    concept_art = {
                        'revisions': []
                    }
                }

                this.setState({
                    project: data,
                    concept_art: concept_art
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render() {

        if (this.state) {
            var that = this;

            var conceptArtRevisionNodes = that.state.concept_art.revisions.map(function(revision) {
                return (
                    <Card
                        className="col-lg-4"
                        key={ revision.id }
                    >
                        <CardBlock className="text-align-center">
                            <ImagePanelRevision { ...{src: revision.content} } />
                        </CardBlock>
                    </Card>
                );
            });


            let props = {};
            if (that.state.concept_art.revisions.length) {
                props.src = that.state.concept_art.revisions[0].content;
            }

            return (
                <div>
                    <ConceptArtBreadcrumb
                        project={ this.state.project }
                        concept_art={ this.state.concept_art }
                    />

                    <ul className="nav nav-pills">
                        <li className="nav-item">
                            <Link
                                className="nav-link btn btn-info"
                                to={
                                    '/project/' + this.props.params.projectId
                                    + '/concept_art/' + this.props.params.conceptArtId
                                    + '/edit'
                                }>Edit</Link>
                        </li>
                    </ul>
                    <br />

                    <div className="ConceptArtDetailsContainer">
                        <Card>
                            <h3 className="card-header">{ this.state.concept_art.name }</h3>
                            <CardBlock>
                                <div className="text-align-center">
                                    <ImagePanelRevision { ...props } />
                                </div>
                            </CardBlock>
                            <CardBlock>
                                <Description source={ this.state.concept_art.description }></Description>
                            </CardBlock>
                        </Card>
                    </div>

                    <SectionHeader>{ this.state.concept_art.revisions.length } Revision(s)</SectionHeader>
                    <div className="ConceptArtRevisionsContainer">
                        { conceptArtRevisionNodes }
                        <Link
                            className="btn btn-success"
                            to={
                                '/project/' + that.props.params.projectId
                                + '/concept_art/' + that.props.params.conceptArtId
                                + '/revision/add'
                            }
                        >Add</Link>
                    </div>
                </div>
            );

        }
        return (
            <Spinner />
        )
    }
})

module.exports.ConceptArt = ConceptArt
