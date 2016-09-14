import React from 'react'

const Card = React.createClass({

    propTypes: {
      children: React.PropTypes.oneOfType([
          React.PropTypes.element,
          React.PropTypes.array
      ]).isRequired
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
