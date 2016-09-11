import React from 'react'

const CardBlock = React.createClass({
    propTypes: {
      children: React.PropTypes.element.isRequired
    },

    render: function() {
      return (
        <div className="card-block">
            { this.props.children }
        </div>
      );
    }
})

module.exports.CardBlock = CardBlock
