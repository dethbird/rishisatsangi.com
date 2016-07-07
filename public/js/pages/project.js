(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ProjectFormView = Backbone.View.extend({
    projectUrl: '/api/project',
    events: {
        'click .submit-button': 'submit'
    },
    submit: function(e) {
        var that = this;
        $el = $(this.el);
        data = _.object(_.map($el.serializeArray(), _.values));

        $.ajax({
            method: data['id'] == '' ? 'POST' : 'PUT',
            url: this.projectUrl,
            data: data
        })
        .success(function(data){
            console.log(data);
        })
        .error(function(data){
            console.log(data);
            var $el = $(that.el);
            $.each($el.children(), function(i,e) {
                TweenLite.to($(e), 2, {
                    rotation: -15 + Math.random() * 30,
                    ease: Elastic.easeOut.config(1, 0.25)
                });
            });
            TweenLite.to($el, 2, {
                backgroundColor: "#500b0b",
                ease: Elastic.easeOut.config(1, 0.25)
            });
        });
    }
});

module.exports = ProjectFormView;

},{}],2:[function(require,module,exports){
var ProjectFormView = require('../library/views/forms/ProjectFormView');

var projectFormView = new ProjectFormView({
    el: '#project-form'
});

console.log(projectFormView);

},{"../library/views/forms/ProjectFormView":1}]},{},[2]);
