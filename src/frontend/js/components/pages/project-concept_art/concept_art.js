import React from 'react'
import { browserHistory } from 'react-router'

import { Card } from "../../ui/card"
import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { FountainBlock } from "../../ui/fountain-block"
import { Image } from "../../ui/image"
import { MarkdownBlock } from "../../ui/markdown-block"
import { ConceptArtRevisions } from "../../pages/project-concept_art/concept_art-revisions"
import { Spinner } from "../../ui/spinner"


const ConceptArt = React.createClass({
    getInitialState() {
        return ({
            selectedRevision: []
        });
    },
    propTypes: {
        conceptArt: React.PropTypes.array.isRequired
    },
    handleClickRevision(revision) {
        let selectedRevision = this.state.selectedRevision
        selectedRevision[revision.concept_art_id] = revision
        this.setState({
            selectedRevision: selectedRevision
        })
    },
    render() {
        let that = this
        let selectedRevision = this.state.selectedRevision

        if (this.state){

            var concept_artNodes = this.props.conceptArt.map(function(concept_art, i) {
                let props = {}
                if (selectedRevision[concept_art.id]){
                    let revision = selectedRevision[concept_art.id]
                    props.src = revision.content
                } else if (concept_art.revisions.length > 0) {
                    props.src = concept_art.revisions[0].content
                }

                return (
                    <Card
                        className="col-lg-6"
                        key={ concept_art.id }
                    >
                        <h4 className="card-header">{ concept_art.name }</h4>
                        <Image { ...props } ></Image>
                        <CardBlock>
                            <div className="card-section-header">{ concept_art.revisions.length } revision(s)</div>
                            <ConceptArtRevisions
                                selectedRevision={ selectedRevision[concept_art.id] ? selectedRevision[concept_art.id] : null}
                                revisions={ concept_art.revisions }
                                revisionClassName="col-xs-4"
                                handleClickRevision={ that.handleClickRevision }
                            />
                            {(() => {
                                if (concept_art.description) {
                                    return (
                                        <div className="card-section-header">description:</div>
                                    )
                                }
                            })()}
                            <MarkdownBlock source={ concept_art.description } />
                            <div className="pull-right"><span className="tag tag-default">{ i + 1 }</span></div>
                        </CardBlock>
                    </Card>
                );
            });

            return (
                <div>
                    { concept_artNodes }
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ConceptArt = ConceptArt
