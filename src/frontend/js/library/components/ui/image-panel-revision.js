import React from 'react'

import classNames from 'classnames';

const ImagePanelRevision = React.createClass({

    propTypes: {
        src: React.PropTypes.string,
        className: React.PropTypes.string
    },

    render: function() {
        let className = classNames([this.props.className, 'image-panel-revision'])
        let src = this.props.src
        if (!src) {
            src = 'https://c1.staticflickr.com/9/8185/29446313350_0a95598297_b.jpg'
        }
        return (
            <img
                className={ className }
                src={ src }
            />
        );
    }
})

module.exports.ImagePanelRevision = ImagePanelRevision
