import React from 'react'

import classNames from 'classnames';

const ImagePanelRevision = React.createClass({

    propTypes: {
        src:React.PropTypes.string,
        className: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            src: 'https://c1.staticflickr.com/9/8185/29446313350_0a95598297_b.jpg'
        };
    },

    render: function() {
        let className = classNames([this.props.className, 'image-panel-revision'])
        return (
            <img
                className={ className }
                src={ this.props.src }
            />
        );
    }
})

module.exports.ImagePanelRevision = ImagePanelRevision
