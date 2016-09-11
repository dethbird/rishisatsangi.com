import React from 'react'
import { Link } from 'react-router'

const Projects = React.createClass({
    componentDidMount() {
        $.ajax({
            url: '/api/projects',
            dataType: 'json',
            cache: false,
            success: function(data) {
                this.setState({projects: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },
    render() {
        return (
            <div>
                All your projects
            </div>
        )
    }
})

module.exports.Projects = Projects
