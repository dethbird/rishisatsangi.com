import React from 'react'

const Spinner = React.createClass({
    render: function() {
        return (
            <div className="container">
                <div id="cssload-loader">
                    <ul>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                        <li></li>
                	</ul>
                </div>
            </div>
        );
    }
})

module.exports.Spinner = Spinner
