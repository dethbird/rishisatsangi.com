(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LoginView = Backbone.View.extend({
    loginUrl: '/login',
    initialize: function(options) {
        var that = this;
        $(this.el).find('form').on('submit', function(e){
          e.preventDefault();
          that.login($('#username').val(), $('#password').val());
        });
        this.render();
    },
    login: function(username, password) {
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
        $.each($('#loginForm form').children(), function(i,e) {
          TweenLite.to($(e), 2, {
              rotation: -15 + Math.random() * 30,
              ease: Elastic.easeOut.config(1, 0.25)
          });
        });
        TweenLite.to($('#loginForm .form-signin'), 2, {
            backgroundColor: "#DE3A3A",
            ease: Elastic.easeOut.config(1, 0.25)
        });
      });
    }
});

module.exports = LoginView;

},{}],2:[function(require,module,exports){
var LoginView = require('../library/views/LoginView');

var loginView = new LoginView({
    el: '#loginForm'
});

console.log(loginView);

},{"../library/views/LoginView":1}]},{},[2]);
