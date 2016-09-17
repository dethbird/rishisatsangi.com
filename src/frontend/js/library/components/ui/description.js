import React from 'react'
import ReactMarkdown from 'react-markdown'

import classNames from 'classnames';

const Description = React.createClass({

    propTypes: {
        source: React.PropTypes.string,
        className: React.PropTypes.string
    },

    render: function() {
        let className = classNames([this.props.className, 'description'])

        return (
            <ReactMarkdown
                className={ className }
                source={ this.props.source || '' }
            >
            </ReactMarkdown>
        );
    }
})

module.exports.Description = Description
