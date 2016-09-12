import React from 'react'
import { browserHistory, Link } from 'react-router'

import { CardClickable } from "../ui/card-clickable"
import { CardBlock } from "../ui/card-block"


const Index = React.createClass({
    handleClick(path) {
        browserHistory.push(path);
    },
    render() {
        return (
            <div>
                <CardClickable
                    onClick = { this.handleClick.bind(this, '/notes') }
                >
                    <CardBlock>
                        <p>Notes</p>
                    </CardBlock>
                </CardClickable>
                <CardClickable
                    onClick = { this.handleClick.bind(this, '/concepts') }
                >
                    <CardBlock>
                        <p>Concepts</p>
                    </CardBlock>
                </CardClickable>
                <CardClickable
                    onClick = { this.handleClick.bind(this, '/projects') }
                >
                    <CardBlock>
                        <p>Projects</p>
                    </CardBlock>
                </CardClickable>
            </div>
        )
    }
})

module.exports.Index = Index
