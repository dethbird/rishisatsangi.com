import React from 'react'
import { browserHistory } from 'react-router'

import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"
import { Spinner } from "../ui/spinner"


const ProjectCharacters = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/project/' + this.props.params.projectId,
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({project: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    handleClick(project_id, character_id) {
        browserHistory.push(
            '/project/' + project_id + '/character/' + character_id);
    },
    render() {
        if (this.state) {
            var that = this;
            var characterNodes = this.state.project.characters.map(function(character) {
                let src;
                if (character.revisions.length) {
                    src = character.revisions[0].content;
                }
                return (
                    <CardClickable
                        className="col-lg-6"
                        key={ character.id }
                        onClick={
                            that.handleClick.bind(
                                that,
                                that.state.project.id,
                                character.id
                            )
                        }
                    >
                        <div>
                            <h3 className="card-header">{ character.name }</h3>
                            <img className="card-img-top" src={ src } />
                            <CardBlock>
                                <div>
                                    <blockquote>{ character.description }</blockquote>
                                    <span>{ character.revisions.length } revision(s)</span>
                                </div>
                            </CardBlock>
                        </div>
                    </CardClickable>
                );
            });
            return (
                <div className="projectCharactersList">
                    { characterNodes }
                </div>
            )
        }
        return (
            <Spinner />
        )
    }
})

module.exports.ProjectCharacters = ProjectCharacters
