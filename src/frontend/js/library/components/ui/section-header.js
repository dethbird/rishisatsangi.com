import React from 'react'

import classNames from 'classnames';

const SectionHeader = React.createClass({

    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.array
        ]).isRequired,
        className: React.PropTypes.string
    },

    render: function() {
        let className = classNames([this.props.className, 'section-header'])
        return (
            <h2 className={ className }>
                { this.props.children }
            </h2>
        );
    }
})

module.exports.SectionHeader = SectionHeader
