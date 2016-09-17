import React from 'react'

import classNames from 'classnames';

const CardBlock = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.array,
            React.PropTypes.string
        ]).isRequired,
        className: React.PropTypes.string
    },

    render: function() {
        let className = classNames([this.props.className, 'card-block'])
        return (
            <div className={ className }>
                { this.props.children }
            </div>
        );
    }
})

module.exports.CardBlock = CardBlock
