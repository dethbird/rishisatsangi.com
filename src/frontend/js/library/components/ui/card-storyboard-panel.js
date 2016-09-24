import { Link } from 'react-router'
import classNames from 'classnames';
import React from 'react'
import TimeAgo from 'react-timeago'

import { Card } from '../ui/card'
import { CardBlock } from '../ui/card-block'
import { ImagePanelRevision } from '../ui/image-panel-revision'
import { Fountain } from '../ui/fountain'

const CardStoryboardPanel = React.createClass({

    propTypes: {
        projectId: React.PropTypes.string.isRequired,
        storyboardId: React.PropTypes.string.isRequired,
        panel: React.PropTypes.object.isRequired
    },

    render: function() {

        let props = {};
        if (this.props.panel.revisions.length > 0)
            props.src = this.props.panel.revisions[0].content

        return (
            <Card
                className='storyboard-panel'
            >
                <h3 className='card-header'>{ this.props.panel.name }</h3>
                <CardBlock>
                    <ImagePanelRevision { ...props } />
                </CardBlock>
                <CardBlock>
                    <Fountain source={ this.props.panel.script }></Fountain>
                </CardBlock>
            </Card>
        );
    }
})

module.exports.CardStoryboardPanel = CardStoryboardPanel
