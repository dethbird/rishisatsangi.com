import React from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';


const Portfolio = React.createClass({
    render() {
        var categoryNodes = portfolio.categories.map(function(category, i) {
            return (
                <div
                    key={ category.id }
                    className="col-xs-3 portfolio-category"
                >
                    <img src={ category.image_url } />
                    <h5>{ category.name }</h5>
                    { category.type }
                </div>
            );
        });
        return (
            <div>
                { categoryNodes }
            </div>
        );
    }
})


export default Portfolio;
