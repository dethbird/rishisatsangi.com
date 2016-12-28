import React from 'react';
import { browserHistory } from 'react-router'
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {indigo700, indigo800, indigoA700 } from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Paper from 'material-ui/Paper';


injectTapEventPlugin();

const palette = {
    baseColor: '#2F2137',
    baseButtonColor: '#F2F2F2',
    primaryColor: '#0449A3',
    secondaryColor: '#A3038C'
}

const muiTheme = getMuiTheme({
    fontFamily: 'Hind Vadodara',
    appBar: {
        color: palette.baseColor
    },
    floatingActionButton: {
        color: palette.baseButtonColor,
        primaryColor: palette.primaryColor,
        secondaryColor: palette.secondaryColor
    },
    flatButton: {
        color: palette.baseButtonColor,
        primaryColor: palette.primaryColor,
        secondaryColor: palette.secondaryColor
    },
    floatingActionButton: {
        color: palette.primaryColor,
        secondaryColor: palette.secondaryColor
    },
    raisedButton: {
        color: palette.baseButtonColor,
        primaryColor: palette.primaryColor,
        secondaryColor: palette.secondaryColor
    },
    ripple: {
        color: 'rgba(0,0,0,0.25)'
    }
});

const App = React.createClass({

    render: function() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div className="container-fluid">
                    {this.props.children}
                </div>
            </MuiThemeProvider>
        );
    }
})

export default App;
