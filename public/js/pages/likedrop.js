(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var LikeDropDashboardView = Backbone.View.extend({
    initialize: function(options) {
        var that = this;

        $(that.el).ready(function(){
            that.render();
        });

        $(window).resize( $.debounce( 250, function(){
            that.render();
        }));
    },
    render: function() {
        var that = this;
        var $el = $(that.el);
        var $window = $(window);

        var firstCard = $el.find('.content-container').find('.card:first-child');
        var rowCount = Math.floor($window.width() / $(firstCard).outerWidth());
        $el.find('.content-container').children('.card-row-divider').remove();
        $el.find('.content-container').children('.card').each(function(i,e){
            if (((i + 1) % rowCount) == 0) {
                $('<div class="card-row-divider"></div>').insertAfter($(e));
            }
        });
    }
});

module.exports = LikeDropDashboardView;

},{}],2:[function(require,module,exports){
var LikeDropDashboardView = require('../library/views/LikeDropDashboardView');

var likeDropDashboardView = new LikeDropDashboardView({
    el: 'body'
});

},{"../library/views/LikeDropDashboardView":1}]},{},[2]);
