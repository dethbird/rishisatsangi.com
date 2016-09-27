import React from 'react'
import { Link } from 'react-router'

const App = React.createClass({
    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.array
        ]).isRequired
    },

    render: function() {
      return (
        <div>
          {this.props.children}
        </div>
      );
    }
})

module.exports.App = App
