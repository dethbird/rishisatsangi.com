import React from 'react';
import Modal from 'react-modal';
import classNames from 'classnames';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';

import Markdown from '../ui/markdown';


const PortfolioCategoryItem = React.createClass({
    getInitialState() {
        return {
            modalIsOpen: false
        };
    },
    prevButton(item_id) {
        const { categoryId } = this.props.params;
        if(item_id !== undefined) {
            return (
                <a className="btn btn-primary btn-xs"  onTouchTap={() => browserHistory.push(
                        `/portfolio/${categoryId}/item/${item_id}`
                )}><i className="fa fa-caret-left" aria-hidden="true"></i> Prev</a>
            )
        }
        return null;
    },
    nextButton(item_id) {
        const { categoryId } = this.props.params;
        if(item_id !== undefined) {
            return (
                <a className="btn btn-primary btn-xs"  onTouchTap={() => browserHistory.push(
                        `/portfolio/${categoryId}/item/${item_id}`
                )}>Next <i className="fa fa-caret-right" aria-hidden="true"></i></a>
            )
        }
        return null;
    },
    openModal() {
        this.setState({modalIsOpen: true});
    },
    closeModal() {
        this.setState({modalIsOpen: false});
    },
    renderContent(item) {
        if (item.type === 'embed') {
            return (
                <div
                    dangerouslySetInnerHTML={ {__html: item.content} }
                />
            )
        }
        return (
            <img className="image-display" src={ item.content } />
        )
    },
    render() {
        const { modalIsOpen } = this.state;
        const { categoryId, itemId } = this.props.params;
        const item = _.findWhere(portfolio.items, {
            'id': itemId
        });
        const category = _.findWhere(portfolio.categories, {
            'id': categoryId
        });
        const categoryItems = _.where(portfolio.items, {
            'category_id': categoryId
        });

        // find prev and next
        let i;
        for (i=0; i < categoryItems.length; i++) {
            if (itemId === categoryItems[i].id) {
                break;
            }
        }
        let prevItemId;
        if (i-1 >= 0) {
            prevItemId =  categoryItems[i - 1].id
        }
        let nextItemId;
        if (i+1 < categoryItems.length) {
            nextItemId =  categoryItems[i + 1].id
        }

        return (
            <div className="text-align-center">
                <div className="portfolio-breadcrumb">
                    <div className="pull-left">
                        <a onTouchTap={() => browserHistory.push('/')}>Portfolio</a>
                        <span> / </span>
                        <a onTouchTap={() => browserHistory.push('/portfolio/' + item.category_id)}>{ category.name }</a>
                        <span> / </span>
                        <span>{ item.title }</span>
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
                                <img className="image-modal" src={ item.thumbnail } />
                                <br />
                                <h1>{ item.title }</h1>
                                <span className="subtitle">{ item.medium }</span>
                                <br />
                                <br />
                                <Markdown source={ item.description }/>
                            </div>
                        </Modal>
                    </div>

                    <div className="pull-right">
                        { this.prevButton(prevItemId) }
                        { this.nextButton(nextItemId) }
                    </div>
                    <div className="clearfix" />
                </div>
                <div className='portfolio-item-content'>
                    { this.renderContent(item) }
                </div>
            </div>
        );
    }
})


export default PortfolioCategoryItem;
