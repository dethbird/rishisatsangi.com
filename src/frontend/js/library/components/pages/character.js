import React from 'react'
// import { browserHistory } from 'react-router'
//
// import { CardClickable } from "../ui/card-clickable"
// import { CardBlock } from "../ui/card-block"


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
            return (
                <div className="CharacterContainer">
                    { this.state.character.name }
                </div>
            );

        }
        return null;
    }
})

module.exports.Character = Character
