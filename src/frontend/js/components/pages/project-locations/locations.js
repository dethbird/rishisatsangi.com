import React from 'react'

import { Card } from "../../ui/card"
import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { Image } from "../../ui/image"
import { MarkdownBlock } from "../../ui/markdown-block"
import { Spinner } from "../../ui/spinner"


const Locations = React.createClass({
    propTypes: {
        locations: React.PropTypes.array.isRequired
    },
    render() {
        let that = this

        var locationNodes = this.props.locations.map(function(location, i) {
            let props = {}
            if (location.content) {
                props.src = location.content
            }

            return (
                <Card
                    className="col-lg-6"
                    key={ location.id }
                >
                    <h4 className="card-header">{ location.name }</h4>
                    <Image { ...props } ></Image>
                    <CardBlock>
                        <MarkdownBlock source={ location.description } />
                        <div className="pull-right"><span className="tag tag-default">{ i + 1 }</span></div>
                    </CardBlock>
                </Card>
            );
        });

        return (
            <div>
                { locationNodes }
            </div>
        );
    }
})

module.exports.Locations = Locations
