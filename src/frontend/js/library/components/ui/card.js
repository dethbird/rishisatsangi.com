import React from 'react'

const Card = React.createClass({
    propTypes: {
      children: React.PropTypes.element.isRequired
    },

    render: function() {
      return (
        <div className="card">
            { this.props.children }
        </div>
      );
    }
})

module.exports.Card = Card
