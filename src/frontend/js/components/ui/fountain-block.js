import classNames from 'classnames';
import fountainJs from 'fountain-js'
import React from 'react'


const FountainBlock = React.createClass({

    propTypes: {
        source: React.PropTypes.string,
        className: React.PropTypes.string
    },

    render: function() {
        let className = classNames([this.props.className, 'fountain'])

        let script = { __html: '<div></div>' }
        if (this.props.source) {
            script = {
                __html: fountainJs.parse(
                    this.props.source).script_html
            }
        }

        return (
            <div
                className={ className }
                dangerouslySetInnerHTML={ script }
            >
            </div>
        );
    }
})

module.exports.FountainBlock = FountainBlock
