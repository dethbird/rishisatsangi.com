import React from 'react'
import { browserHistory } from 'react-router'

import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import {
    ConceptArtBreadcrumb
} from "./concept_art/concept_art-breadcrumb"
import { Description } from "../ui/description"
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
                    'id': this.props.params.conceptArtId
                });
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
            const { concept_art } = this.state
            let src;

            if (concept_art.revisions.length) {
                src = concept_art.revisions[0].content;
            }

            var that = this;
            var conceptArtRevisionNodes = this.state.concept_art.revisions.map(function(revision) {
                return (
                    <Card
                        className="col-lg-4"
                        key={ revision.id }
                    >
                        <CardBlock className="text-align-center">
                            <img className="card-img-top" src={ revision.content } />
                        </CardBlock>
                    </Card>
                );
            });

            return (
                <div>
                    <ConceptArtBreadcrumb
                        project={ this.state.project }
                        concept_art={ this.state.concept_art }
                    >
                    </ConceptArtBreadcrumb>
                    <div className="ConceptArtDetailsContainer">
                        <Card>
                            <h3 className="card-header">{ this.state.concept_art.name }</h3>
                            <CardBlock>
                                <div className="text-align-center">
                                    <img className="card-img-top" src={ src } />
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
