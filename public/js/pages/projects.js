(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DragToOrderView = require('./ui/DragToOrderView');
var ProjectsView = Backbone.View.extend({
    initialize: function(options) {
        var that = this;
        var $el = $(this.el);
        $('.sortable-storyboards').each(function(i,e){
            dragToOrderView = new DragToOrderView({
                el: e,
                endPoint: '/api/project_storyboard_order',
                parentId: 'project_id'
            });
        });

        $('.sortable-panels').each(function(i,e){
            dragToOrderView = new DragToOrderView({
                el: e,
                endPoint: '/api/project_storyboard_panel_order',
                parentId: 'storyboard_id'
            });
        });
    }
});

module.exports = ProjectsView;

},{"./ui/DragToOrderView":2}],2:[function(require,module,exports){
var DragToOrderView = Backbone.View.extend({
    endPoint: null,
    parentId: null,
    initialize: function(options) {
        var that = this;
        that.endPoint = options.endPoint;
        that.parentId = options.parentId;

        $(that.el).sortable({
            handle: '.handle',
            cursor: "move",
            stop: function(e,ui) {
                var $target = $(e.target);
                data = {};
                data[that.parentId] = $target.data('id');
                data['items'] = [];

                $($target.children()).each(function(i,e){
                    var $e = $(e);
                    if($e.data('id')!="") {
                        data['items'][$e.data('id')] = i;
                    }
                });

                // make the request
                $.ajax({
                    method: 'POST',
                    url: that.endPoint,
                    data: data
                })
                .success(function(data){
                    console.log(data);
                })
                .error(function(data){
                    console.log(data);
                });

            }
        });
    }
});

module.exports = DragToOrderView;

},{}],3:[function(require,module,exports){
var ProjectsView = require('../library/views/ProjectsView');

var projectsView = new ProjectsView({
    el: 'body'
});

},{"../library/views/ProjectsView":1}]},{},[3]);
