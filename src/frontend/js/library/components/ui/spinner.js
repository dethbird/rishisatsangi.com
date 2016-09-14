import React from 'react'

const Spinner = React.createClass({

    render: function() {
      return (
          <div className="cssload-bell">
            <div className="cssload-circle">
              <div className="cssload-inner"></div>
            </div>
            <div className="cssload-circle">
        	  <div className="cssload-inner"></div>
            </div>
            <div className="cssload-circle">
        	  <div className="cssload-inner"></div>
            </div>
            <div className="cssload-circle">
        	  <div className="cssload-inner"></div>
            </div>
            <div className="cssload-circle">
        	  <div className="cssload-inner"></div>
            </div>
          </div>
      );
    }
})

module.exports.Spinner = Spinner
