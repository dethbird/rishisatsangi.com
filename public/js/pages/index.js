(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _ButtonAnimationView = require('./animations/ButtonAnimationView');

var _ButtonAnimationView2 = _interopRequireDefault(_ButtonAnimationView);

var _FlickerView = require('./animations/FlickerView');

var _FlickerView2 = _interopRequireDefault(_FlickerView);

var _ParallaxView = require('./animations/ParallaxView');

var _ParallaxView2 = _interopRequireDefault(_ParallaxView);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var IndexView = Backbone.View.extend({
    w: null,
    scaleFactor: 1,
    initialize: function initialize(options) {
        var that = this;
        that.w = $(window);

        // figure out the scale multiplier
        that.scaleFactor = that.w.width() / 1920;

        new _ButtonAnimationView2.default({
            el: '#great_button'
        });

        // parallaxes
        _.each($(that.el).find('.parallax'), function (e, i) {
            e = $(e);
            var object = _.findWhere(layout.objects, { 'id': e.attr('id') });
            var parallaxView = new _ParallaxView2.default({
                el: '#' + e.attr('id'),
                object: object,
                parallax_details: _.findWhere(layout.parallax, { 'id': object.parallax.parallax_id }),
                parent: that
            });
        });

        // flicker
        _.each($(that.el).find('.flicker'), function (e, i) {
            e = $(e);
            var object = _.findWhere(layout.objects, { 'id': e.attr('id') });
            var flickerView = new _FlickerView2.default({
                el: '#' + e.attr('id'),
                object: object
            });
        });
    }
});

module.exports = IndexView;

},{"./animations/ButtonAnimationView":2,"./animations/FlickerView":3,"./animations/ParallaxView":4}],2:[function(require,module,exports){
"use strict";

var ButtonAnimationView = Backbone.View.extend({
    initialize: function initialize(options) {
        var that = this;
        this.timeline = new TimelineMax({
            paused: true,
            onComplete: function onComplete() {
                alert('Fantastic!');
            }
        });
        this.timeline.set($(this.el), { autoAlpha: 1 });
        this.timeline.fromTo(this.el, 1, {
            transformStyle: "preserve-3d",
            transformOrigin: "center 0px",
            rotationX: 0
        }, {
            rotationX: 360 * 2,
            ease: Back.easeOut
        }, 0).fromTo(this.el, 2.2, {
            transformStyle: "preserve-3d",
            transformOrigin: "left 0px",
            rotationZ: 0
        }, {
            rotationZ: 80,
            ease: Elastic.easeOut.config(1.5, 0.3)
        }, 0.8).to(this.el, 1.2, {
            physics2D: {
                gravity: 5000,
                velocity: 600,
                angle: -90
            }
        }, 1);
        // console.log(this);
        $(this.el).on('click', function () {
            that.timeline.play(0);
        });
    }
});

module.exports = ButtonAnimationView;

},{}],3:[function(require,module,exports){
"use strict";

var FlickerView = Backbone.View.extend({
    initialize: function initialize(options) {
        var that = this;
        that.object = options.object;
        setTimeout(function () {
            that.flicker();
        }, that.object.flicker.delay * 1000);
    },
    flicker: function flicker() {
        var that = this;
        var duration = that.object.flicker.min_duration + Math.random() * that.object.flicker.max_duration;
        var tm = new TweenMax($(that.el), duration, {
            opacity: that.object.flicker.min_opacity + Math.random() * that.object.flicker.max_opacity,
            onComplete: function onComplete() {
                that.flicker();
            }
        });
    }
});

module.exports = FlickerView;

},{}],4:[function(require,module,exports){
'use strict';

var ParallaxView = Backbone.View.extend({
  object: null,
  parent: null,
  currentIndex: null,
  timeout: null,
  initialize: function initialize(options) {
    var that = this;
    that.object = options.object;
    that.parent = options.parent;
    that.parallax_details = options.parallax_details;
    that.parent.w.mousemove(_.bind($.debounce(1, that.animate), that));
  },
  animate: function animate(e) {
    var that = this;
    $('#' + that.object.id).css({
      left: that.parent.scaleFactor * (that.object.location.left + -1 * (e.screenX + window.scrollX - that.parent.scaleFactor * that.parallax_details.location.left) * that.object.parallax.scale),
      top: that.parent.scaleFactor * (that.object.location.top + -1 * (e.screenY + window.scrollY - that.parent.scaleFactor * that.parallax_details.location.top) * that.object.parallax.scale)
    });
  }
});

module.exports = ParallaxView;

},{}],5:[function(require,module,exports){
'use strict';

var IndexView = require('../library/views/IndexView');

var indexView = new IndexView({
    el: 'body'
});

},{"../library/views/IndexView":1}]},{},[5]);
