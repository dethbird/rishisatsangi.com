import React from 'react'

import classNames from 'classnames';

const CardClickable = React.createClass({
    propTypes: {
      children: React.PropTypes.element.isRequired,
      onClick: React.PropTypes.func.isRequired
    },

    render: function() {
        let className = classNames(['card', 'clickable'])
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
