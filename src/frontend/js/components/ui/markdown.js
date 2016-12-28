import React from 'react'
import ReactMarkdown from 'react-markdown'

import classNames from 'classnames';

const Markdown = React.createClass({

    propTypes: {
        source: React.PropTypes.string,
        className: React.PropTypes.string
    },

    render: function() {
        const { source, className } = this.props;

        if (source)
            return (
                <ReactMarkdown
                    className={ classNames([className, 'markdown']) }
                    source={ source || '' }
                >
                </ReactMarkdown>
            );
        return null;
    }
})

export default Markdown
