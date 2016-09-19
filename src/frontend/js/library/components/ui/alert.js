import React from 'react'

import classNames from 'classnames';

const Alert = React.createClass({
    propTypes: {
        status: React.PropTypes.string,
        message: React.PropTypes.string,
        className: React.PropTypes.string
    },

    render: function() {
        if (this.props.status) {
            let className = classNames(['alert', 'alert-' + this.props.status, this.props.className, ])
            return (
                <div className={ className } role="alert">
                    { this.props.message }
                </div>
            );
        }
        return null
    }
})

module.exports.Alert = Alert
