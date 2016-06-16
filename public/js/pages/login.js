(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LoginFormView = Backbone.View.extend({
    loginUrl: '/api/login',
    initialize: function(options) {
        var that = this;
        $(this.el).on('submit', function(e){
            e.preventDefault();
            that.login($('#username').val(), $('#password').val());
        });
    },
    login: function(username, password) {
        var that = this;
        $.ajax({
            method: 'POST',
            url: this.loginUrl,
            data: {
                username: username,
                password: password
            }
        })
        .success(function(data){
            document.location = data.redirectTo;
        })
        .error(function(data){
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

module.exports = LoginFormView;

},{}],2:[function(require,module,exports){
var LoginFormView = require('../library/views/forms/LoginFormView');

var loginFormView = new LoginFormView({
    el: '#login_form'
});

},{"../library/views/forms/LoginFormView":1}]},{},[2]);
