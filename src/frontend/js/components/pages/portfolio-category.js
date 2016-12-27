import React from 'react';
import Modal from 'react-modal';
import classNames from 'classnames';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';

import Markdown from '../ui/markdown';


const PortfolioCategory = React.createClass({
    getInitialState() {
        return {
            modalIsOpen: false
        };
    },
    openModal() {
        this.setState({modalIsOpen: true});
    },
    closeModal() {
        this.setState({modalIsOpen: false});
    },
    render() {
        const { modalIsOpen } = this.state;
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
                        <a title={ item.title } onTouchTap={() => browserHistory.push(
                                `/portfolio/${item.category_id}/item/${item.id}`
                        )}>
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
                    <span className="subtitle"> ({category.type}) </span>
                    <a className="btn btn-secondary btn-xs" onTouchTap={ this.openModal }>Info</a>

                    <Modal
                        ref="infoModal"
                        isOpen={ modalIsOpen }
                        contentLabel="infoModal"
                        style={{
                            overlay: {
                                backgroundColor : 'rgba(0, 0, 0, 0.75)'
                            },
                            content: {
                                background : '#000'
                            }
                        }}
                    >
                        <a onTouchTap={ this.closeModal } className="btn btn-danger pull-right">X</a>
                        <br />

                        <div className="text-align-center">
                            <img className="image-modal" src={ category.image_url } />
                            <br />
                            <h1>{ category.name }</h1>
                            <span className="subtitle">{ category.type }</span>
                            <br />
                            <br />
                            <Markdown source={ category.description }/>
                        </div>
                    </Modal>
                </div>
                <div>
                    { itemNodes }
                </div>
            </div>
        );
    }
})


export default PortfolioCategory;
