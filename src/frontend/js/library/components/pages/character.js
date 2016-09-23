import React from 'react'
import { browserHistory, Link } from 'react-router'

import { Card } from "../ui/card"
import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import {
    CharacterBreadcrumb
} from "./character/character-breadcrumb"
import { Description } from "../ui/description"
import { SectionHeader } from "../ui/section-header"
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
                        <CardBlock className="text-align-center">
                            <img className="card-img-top" src={ revision.content } />
                        </CardBlock>
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
                                <Description source={ this.state.character.description }></Description>
                            </CardBlock>
                            <div className='card-footer text-muted clearfix'>
                                <Link to={
                                    '/project/' + this.props.params.projectId
                                    + '/character/' + this.props.params.characterId
                                    + '/edit'
                                }>Edit</Link>
                            </div>
                        </Card>
                    </div>
                    <SectionHeader>{ this.state.character.revisions.length } Revision(s)</SectionHeader>
                    <div className="CharacterRevisionsContainer">
                        { characterRevisionNodes }
                        <Link
                            className="btn btn-success"
                            to={
                                '/project/' + that.props.params.projectId
                                + '/character/' + that.props.params.characterId
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

module.exports.Character = Character
