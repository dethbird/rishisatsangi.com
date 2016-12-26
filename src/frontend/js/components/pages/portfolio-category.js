import React from 'react';
import classNames from 'classnames';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';


const PortfolioCategory = React.createClass({
    render() {
        const { categoryId } = this.props.params;
        const items = _.where(portfolio.items, {
            'category_id': categoryId
        });
        const category = _.findWhere(portfolio.categories, {
            'id': categoryId
        });

        const itemNodes = items.map(function(item, i){
            return (
                <div
                    key={ i }
                    className="col-xs-3"
                >
                    <div className="portfolio-card">
                        <a title={ item.title } onTouchTap={() => browserHistory.push('/portfolio/' + item.category_id)}>
                            <img className={ item.orientation } src={ item.thumbnail } />
                        </a>
                        <h5>{ item.title }</h5>
                    </div>
                </div>
            )
        });

        return (
            <div>
                <div className="portfolio-breadcrumb">
                    <a onTouchTap={() => browserHistory.push('/')}>Portfolio</a>
                    <span> / </span>
                    <a onTouchTap={() => browserHistory.push('/portfolio/' + categoryId)}>{ category.name }</a>
                </div>
                <div>
                    { itemNodes }
                </div>
            </div>
        );
    }
})


export default PortfolioCategory;
