import React from 'react'
import { browserHistory } from 'react-router'

import { Card } from "../../ui/card"
import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { FountainBlock } from "../../ui/fountain-block"
import { Image } from "../../ui/image"
import { MarkdownBlock } from "../../ui/markdown-block"
import { CharacterRevisions } from "../../pages/project-characters/character-revisions"
import { Spinner } from "../../ui/spinner"


const Characters = React.createClass({
    getInitialState() {
        return ({
            selectedRevision: []
        });
    },
    propTypes: {
        characters: React.PropTypes.array.isRequired
    },
    handleClickRevision(revision) {
        let selectedRevision = this.state.selectedRevision
        selectedRevision[revision.character_id] = revision
        this.setState({
            selectedRevision: selectedRevision
        })
    },
    render() {
        let that = this
        let selectedRevision = this.state.selectedRevision

        if (this.state){

            var characterNodes = this.props.characters.map(function(character, i) {
                let props = {}
                if (selectedRevision[character.id]){
                    let revision = selectedRevision[character.id]
                    props.src = revision.content
                } else if (character.revisions.length > 0) {
                    props.src = character.revisions[0].content
                }

                return (
                    <Card
                        className="col-lg-6"
                        key={ character.id }
                    >
                        <h4 className="card-header">{ character.name }</h4>
                        <Image { ...props } ></Image>
                        <CardBlock>
                            <div className="card-section-header">{ character.revisions.length } revision(s)</div>
                            <CharacterRevisions
                                selectedRevision={ selectedRevision[character.id] ? selectedRevision[character.id] : null}
                                revisions={ character.revisions }
                                revisionClassName="col-xs-4"
                                handleClickRevision={ that.handleClickRevision }
                            />
                            {(() => {
                                if (character.description) {
                                    return (
                                        <div className="card-section-header">description:</div>
                                    )
                                }
                            })()}
                            <MarkdownBlock source={ character.description } />
                            <div className="pull-right"><span className="tag tag-default">{ i + 1 }</span></div>
                        </CardBlock>
                    </Card>
                );
            });

            return (
                <div>
                    { characterNodes }
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.Characters = Characters
