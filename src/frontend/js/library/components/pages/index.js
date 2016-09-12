import React from 'react'
import { browserHistory } from 'react-router'

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
                        <p>Notebook</p>
                    </CardBlock>
                </CardClickable>
                <CardClickable
                    onClick = { this.handleClick.bind(this, '/scripts') }
                >
                    <CardBlock>
                        <p>Quick Scripts</p>
                    </CardBlock>
                </CardClickable>
                <CardClickable
                    onClick = { this.handleClick.bind(this, '/projects') }
                >
                    <CardBlock>
                        <p>Full Projects</p>
                    </CardBlock>
                </CardClickable>
            </div>
        )
    }
})

module.exports.Index = Index
