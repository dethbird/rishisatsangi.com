import React from 'react'

const ProjectsBreadcrumb = React.createClass({

    render: function() {
        return (
            <ol className="breadcrumb">
                <li className="breadcrumb-item">Projects</li>
            </ol>
        );
    }
})

module.exports.ProjectsBreadcrumb = ProjectsBreadcrumb
