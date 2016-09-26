import React from 'react'
import { browserHistory } from 'react-router'

// import { Alert } from "../ui/alert"
// import { Card } from "../ui/card"
// import { SectionHeader } from "../ui/section-header"
// import { CardClickable } from "../ui/card-clickable"
// import { CardBlock } from "../ui/card-block"
// import { ContentEdit } from "../ui/content-edit"
// import { Description } from "../ui/description"
// import { Fountain } from "../ui/fountain"
// import { ImagePanelRevision } from "../ui/image-panel-revision"
// import {
//     ProjectBreadcrumb
// } from "./project/project-breadcrumb"
// import { Spinner } from "../ui/spinner"


const Login = React.createClass({

    handleFieldChange(event) {
    },
    handleClickSubmit(event) {
        event.preventDefault()
        var that = this
        console.log(event);
        // $.ajax({
        //     data: that.state.changedFields,
        //     dataType: 'json',
        //     cache: false,
        //     method: this.state.submitMethod,
        //     url: this.state.submitUrl,
        //     success: function(data) {
        //         this.setState({
        //             formState: 'success',
        //             formMessage: 'Success.',
        //             submitUrl:'/api/project/'
        //                 + data.id,
        //             submitMethod: 'PUT',
        //             project: data
        //         })
        //     }.bind(this),
        //     error: function(xhr, status, err) {
        //         this.setState({
        //             formState: 'danger',
        //             formMessage: 'Error: ' + xhr.responseText
        //         })
        //     }.bind(this)
        // });
    },
    render() {
        let that = this
        if (this.state){
            console.log(this.state)
            return (
                <div>
                    Login
                </div>
            );
        }
        return (
            <div>Loading</div>
        )
    }
})

module.exports.Login = Login
