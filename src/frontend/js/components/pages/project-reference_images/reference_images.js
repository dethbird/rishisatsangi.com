import React from 'react'

import { Card } from "../../ui/card"
import { CardClickable } from "../../ui/card-clickable"
import { CardBlock } from "../../ui/card-block"
import { Image } from "../../ui/image"
import { MarkdownBlock } from "../../ui/markdown-block"
import { Spinner } from "../../ui/spinner"


const ReferenceImages = React.createClass({
    propTypes: {
        referenceImages: React.PropTypes.array.isRequired
    },
    render() {
        let that = this

        var reference_imageNodes = this.props.referenceImages.map(function(reference_image, i) {
            let props = {}
            if (reference_image.content) {
                props.src = reference_image.content
            }

            return (
                <Card
                    className="col-lg-6"
                    key={ reference_image.id }
                >
                    <h4 className="card-header">{ reference_image.name }</h4>
                    <Image { ...props } ></Image>
                    <CardBlock>
                        <MarkdownBlock source={ reference_image.description } />
                        <div className="pull-right"><span className="tag tag-default">{ i + 1 }</span></div>
                    </CardBlock>
                </Card>
            );
        });

        return (
            <div>
                { reference_imageNodes }
            </div>
        );
    }
})

module.exports.ReferenceImages = ReferenceImages
