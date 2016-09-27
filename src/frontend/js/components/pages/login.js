import React from 'react'
import { browserHistory } from 'react-router'

import { Alert } from "../ui/alert"
import { Card } from "../ui/card"
import { CardBlock } from "../ui/card-block"
import { SectionHeader } from "../ui/section-header"
import { Spinner } from "../ui/spinner"


const Login = React.createClass({
    getInitialState() {
        return ({
            model: {},
            formState: null,
            formMessage: null,
            changedFields: {}
        });
    },
    handleFieldChange(event) {
        let model = this.state.model;
        let changedFields = this.state.changedFields;

        model[event.target.id] = event.target.value
        changedFields[event.target.id] = event.target.value

        this.setState({
            model: model,
            changedFields: changedFields
        })
    },
    handleClickSubmit(event) {
        event.preventDefault()
        var that = this
        $.ajax({
            data: that.state.changedFields,
            dataType: 'json',
            cache: false,
            method: 'POST',
            url: '/api/login',
            beforeSend: function() {
                this.setState({
                    formState: 'info',
                    formMessage: 'Working.',
                })
            }.bind(this),
            success: function(data) {
                this.setState({
                    formState: 'success',
                    formMessage: 'Success.',
                    model: data
                })
                document.location = data.redirectTo
            }.bind(this),
            error: function(xhr, status, err) {
                this.setState({
                    formState: 'danger',
                    formMessage: 'Error: ' + xhr.responseText
                })
            }.bind(this)
        });
    },
    render() {
        let that = this
        if (this.state){
            return (
                <div>
                    <Alert
                        status={ this.state.formState }
                        message={ this.state.formMessage }
                    />
                    <form>

                        <SectionHeader>username:</SectionHeader>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                id="username"
                                placeholder="Username"
                                value={ this.state.model.username }
                                onChange= { this.handleFieldChange }
                            />
                        </div>

                        <SectionHeader>password:</SectionHeader>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                rows="3"
                                value={ this.state.model.password || '' }
                                onChange= { this.handleFieldChange }
                            />
                        </div>

                        <div className="form-group text-align-center">
                            <button
                                className="btn btn-success"
                                onClick={ that.handleClickSubmit }
                                disabled={ !that.state.changedFields }
                            >Login</button>
                        </div>


                    </form>
                </div>
            );
        }
        return (
            <Spinner />
        )
    }
})

module.exports.Login = Login
