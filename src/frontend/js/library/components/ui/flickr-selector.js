import classNames from 'classnames';
import React from 'react'

import { Card } from "../ui/card"
import { CardBlock } from "../ui/card-block"
import { CardClickable } from "../ui/card-clickable"
import { ImagePanelRevision } from "../ui/image-panel-revision"

const FlickrSelector = React.createClass({
    propTypes: {
        onClick: React.PropTypes.func.isRequired
    },

    handleClickOpen: function() {
        event.preventDefault()
        var that = this
        $.ajax({
            dataType: 'json',
            cache: false,
            method: 'GET',
            url: '/api/external-content-source/flickr',
            success: function(data) {
                this.setState({
                    images: data
                })
            }.bind(this),
            error: function(xhr, status, err) {
                console.log(xhr)
            }.bind(this)
        });
    },
    handleClickSelect: function(event) {
        this.state = null;
        this.props.onClick(event)
    },
    render: function() {
        let that = this;
        if (this.state) {

            let flickrImageNodes = this.state.images.map(function(image) {
                return (
                    <Card
                        className="col-lg-4"
                        key={ image.id }
                    >
                        <CardBlock>
                            <img
                                src={ image.url_l }
                                onClick={ that.handleClickSelect }
                            />
                        </CardBlock>
                    </Card>
                );
            });

            return (
                <div>
                    { flickrImageNodes }
                </div>
            )
        }

        let className = classNames([this.props.className, 'flickr-selector'])
        return (
            <div className={ className }>
                <a
                    className="btn btn-secondary"
                    onClick={ this.handleClickOpen }
                >Select From Flickr</a>
            </div>
        )
    }
})

module.exports.FlickrSelector = FlickrSelector
