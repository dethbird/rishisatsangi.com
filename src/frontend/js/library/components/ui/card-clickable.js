import React from 'react'

import classNames from 'classnames';

const CardClickable = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.array
        ]).isRequired,
        onClick: React.PropTypes.func.isRequired,
        className: React.PropTypes.string
    },

    render: function() {

        let className = classNames([this.props.className, 'card', 'clickable'])

        return (
            <div
                className={ className }
                onClick={ this.props.onClick }
            >
                { this.props.children }
            </div>
        );
    }
})

module.exports.CardClickable = CardClickable
