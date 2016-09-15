import React from 'react'
import ReactMarkdown from 'react-markdown'
import { browserHistory } from 'react-router'

import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import {
    CharacterBreadcrumb
} from "./character/character-breadcrumb"
import { Spinner } from "../ui/spinner"


const Character = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {
                let character = _.findWhere(data.characters, {
                    'id': this.props.params.characterId
                });
                this.setState({
                    project: data,
                    character: character
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render() {

        if (this.state) {
            const { character } = this.state
            let src;

            if (character.revisions.length) {
                src = character.revisions[0].content;
            }

            var that = this;
            var characterRevisionNodes = this.state.character.revisions.map(function(revision) {
                return (
                    <Card
                        className="col-lg-4"
                        key={ revision.id }
                    >
                        <div className="text-align-center">
                            <img className="card-img-top" src={ revision.content } />
                        </div>
                    </Card>
                );
            });

            return (
                <div>
                    <CharacterBreadcrumb
                        project={ this.state.project }
                        character={ this.state.character }
                    >
                    </CharacterBreadcrumb>
                    <div className="CharacterDetailsContainer">
                        <Card>
                            <h3 className="card-header">{ this.state.character.name }</h3>
                            <CardBlock>
                                <div className="text-align-center">
                                    <img className="card-img-top" src={ src } />
                                </div>
                            </CardBlock>
                            <CardBlock>
                                <ReactMarkdown source={ this.state.character.description } />
                            </CardBlock>
                        </Card>
                    </div>
                    <div className="CharacterRevisionsContainer">
                        { characterRevisionNodes }
                    </div>
                </div>
            );

        }
        return (
            <Spinner />
        )
    }
})

module.exports.Character = Character
