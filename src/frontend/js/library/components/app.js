import React from 'react'
import { Link } from 'react-router'

const App = React.createClass({
    propTypes: {
      children: React.PropTypes.element.isRequired
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
