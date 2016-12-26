import React from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';


const Portfolio = React.createClass({
    render() {
        var categoryNodes = portfolio.categories.map(function(category, i) {
            return (
                <div
                    key={ category.id }
                    className="col-xs-3 text-align-center"
                >
                    <div className="portfolio-card">
                        <a title={ category.name } onTouchTap={() => browserHistory.push('/portfolio/' + category.id)}>
                            <img className={ category.orientation } src={ category.image_url } />
                        </a>
                        <h5>{ category.name }</h5>
                        <span className="subtitle">{ category.type }</span>
                    </div>
                </div>
            );
        });
        return (
            <div>
                <div className="portfolio-breadcrumb">
                    <a onTouchTap={() => browserHistory.push('/')}>Portfolio</a>
                    <span> / </span>
                </div>
                <div>
                    { categoryNodes }
                </div>
            </div>
        );
    }
})


export default Portfolio;
