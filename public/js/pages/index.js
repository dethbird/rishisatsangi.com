(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var FlickerView = require('./animations/FlickerView');
var SlideIntoView = require('./animations/SlideIntoView');
var FromToView = require('./animations/FromToView');
var ParallaxView = require('./animations/ParallaxView');
var SequenceView = require('./animations/SequenceView');
var ClickScrollView = require('./buttons/ClickScrollView');
var AlwaysOnTopManagerView = require('./ui/AlwaysOnTopManagerView');
var PopupBannerView = require('./ui/PopupBannerView');
var PopupSlideshowView = require('./ui/PopupSlideshowView');

var HorizontalPanelView = Backbone.View.extend({
    w: null,
    layout: null,
    scaleFactor: 1,
    alwaysOnTopManager: null,
    popupSlideshowView: null,
    initialize: function(options) {
        var that = this;
        that.w = $(window);
        that.layout = options.layout;

        // figure out the scale multiplier
        that.scaleFactor = that.w.width() / that.layout.panel.width;

        // always on top manager keeps the menu on top
        that.alwaysOnTopManager = new AlwaysOnTopManagerView({
          el: window,
          parent: that
        });

        // start infinite animations
        _.each($(that.el).find('.object'), function(e, i){
            e = $(e);

            if (e.hasClass('text')) {
                var object = _.findWhere(that.layout.text, {'id': e.attr('id')});
            } else {
                var object = _.findWhere(that.layout.objects, {'id': e.attr('id')});
            }

            // rotate
            if (e.hasClass('rotate')) {
              var repeatTimeline = new TimelineMax({repeat:-1});
              repeatTimeline.add(TweenMax.to(e, object.rotate.duration, {rotationZ: object.rotate.degrees, ease: Power0.easeNone}));
            }

            if (e.hasClass('flicker')) {
              var flickerView = new FlickerView({
                el: '#' + e.attr('id'),
                object: object
              });
            }

            if (e.hasClass('slide-in')) {
              var slideIntoView = new SlideIntoView({
                el: '#' + e.attr('id'),
                object: object,
                scaleFactor: that.scaleFactor
              });
            }

            if (e.hasClass('click-scroll')) {
              var clickScrollView = new ClickScrollView({
                el: '#' + e.attr('id'),
                object: object,
                parent: that
              });
            }

            if (e.hasClass('sequence')) {
              new SequenceView({
                el: '#' + e.attr('id'),
                object: object,
                parent: that
              });
            }

            if (e.hasClass('from-to')) {
              new FromToView({
                el: '#' + e.attr('id'),
                object: object,
                parent: that
              });
            }

            if (e.hasClass('popup-banner-trigger')) {
              new PopupBannerView({
                el: '#' + e.attr('id'),
                popup_el: '#popup_banner',
                object: object,
                popup_details: _.findWhere(that.layout.popup_banner, {'id': object.popup_banner.popup_content_id}),
                parent: that
              });
            }

            if (e.hasClass('popup-slideshow-trigger')) {
              var popupSlideshowView = new PopupSlideshowView({
                el: '#' + e.attr('id'),
                popup_el: '#' + object.popup_slideshow.popup_slideshow_id,
                object: object,
                popup_details: _.findWhere(that.layout.popup_slideshow, {'id': object.popup_slideshow.popup_slideshow_id}),
                parent: that
              });
            }

            if (e.hasClass('parallax')) {
              var parallaxView = new ParallaxView({
                el: '#' + e.attr('id'),
                object: object,
                parallax_details: _.findWhere(that.layout.parallax, {'id': object.parallax.parallax_id}),
                parent: that
              });
            }

            if (e.hasClass('always-on-top')) {
              that.alwaysOnTopManager.addObject(object);
            }

        });

        // rescale on window resize
        that.w.resize(_.bind($.debounce(250, that.resize), that));
        that.resize();
    },
    resize: function(){
      var that = this;

      // figure out the scale multiplier
      that.scaleFactor = that.w.width() / that.layout.panel.width;

      that.alwaysOnTopManager.adjust();



      _.each($(that.el).find('.object'), function(e, i){
          e = $(e);
          if (e.hasClass('text')) {
              var object = _.findWhere(that.layout.text, {'id': e.attr('id')});
          } else if (e.hasClass('sprite')) {
              var object = _.findWhere(that.layout.sprite, {'id': e.attr('id')});
          } else {
              var object = _.findWhere(that.layout.objects, {'id': e.attr('id')});
          }
          if (object) {
            e.css({
              width: that.scaleFactor * object.dimensions.width,
              height: that.scaleFactor * object.dimensions.height,
              top: that.scaleFactor * object.location.top,
              left: that.scaleFactor * object.location.left
            });
          }
      });
      var container = $('#container');
      container.css({
        marginTop: (that.w.height() - container.height()) / 2
      });

    }
});

module.exports = HorizontalPanelView;

},{"./animations/FlickerView":2,"./animations/FromToView":3,"./animations/ParallaxView":4,"./animations/SequenceView":5,"./animations/SlideIntoView":6,"./buttons/ClickScrollView":7,"./ui/AlwaysOnTopManagerView":8,"./ui/PopupBannerView":9,"./ui/PopupSlideshowView":10}],2:[function(require,module,exports){
var FlickerView = Backbone.View.extend({
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        setTimeout(function(){
            that.flicker();
        }, that.object.flicker.delay * 1000);

    },
    flicker: function() {
        var that = this;
        duration = that.object.flicker.min_duration + Math.random() * that.object.flicker.max_duration;
        var tm = new TweenMax($(that.el), duration, {
          opacity: that.object.flicker.min_opacity + Math.random() * that.object.flicker.max_opacity,
          onComplete: function(){
            that.flicker();
          }
        });
    }
});

module.exports = FlickerView;

},{}],3:[function(require,module,exports){
var FromTo = Backbone.View.extend({
    object: null,
    parent: null,
    currentIndex: null,
    timeout: null,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        that.currentIndex = that.object.from_to.sequence.length -1;
        that.fromTo();
    },
    fromTo: function() {
        var that = this;
        clearTimeout(that.timeout);

        that.currentIndex++;
        if(that.currentIndex>=that.object.from_to.sequence.length) {
          that.currentIndex = 0;
        }

        // that.object.from_to.sequence[that.currentIndex].duration)

        that.timeout = setTimeout(
          function(){
            var tm = TweenLite.fromTo(
              $(that.el),
              that.object.from_to.sequence[that.currentIndex].duration,
              {
                left: that.parent.scaleFactor * that.object.from_to.sequence[that.currentIndex].from.left,
                top: that.parent.scaleFactor * that.object.from_to.sequence[that.currentIndex].from.top
              },
              {
                left: that.parent.scaleFactor * that.object.from_to.sequence[that.currentIndex].to.left,
                top: that.parent.scaleFactor * that.object.from_to.sequence[that.currentIndex].to.top,
                onComplete: function(){
                  that.fromTo();
                },
                ease: Power0.easeNone
              }
            );
          },
          (that.object.from_to.sequence[that.currentIndex].min_delay + Math.random() * that.object.from_to.sequence[that.currentIndex].random_delay)  * 1000
        );



        // $(that.el).attr('src',  that.object.sequence[that.currentIndex].image_url);
        //
        // that.timeout = setTimeout(function(){
        //   that.sequence();
        // }, that.object.sequence[that.currentIndex].duration * 1000);

    }
});

module.exports = FromTo;

},{}],4:[function(require,module,exports){
var ParallaxView = Backbone.View.extend({
    object: null,
    parent: null,
    currentIndex: null,
    timeout: null,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        that.parallax_details = options.parallax_details;
        that.parent.w.mousemove(_.bind($.debounce(1, that.animate), that));
    },
    animate: function(e) {
        var that = this;
        $('#' + that.object.id).css({
          left: that.parent.scaleFactor * ((that.object.location.left + (
            -1 * (
              e.screenX + window.scrollX -
              (that.parent.scaleFactor * that.parallax_details.location.left)
            ) * that.object.parallax.scale
          ))),
          top: that.parent.scaleFactor * ((that.object.location.top + (
            -1 * (
              e.screenY + window.scrollY -
              (that.parent.scaleFactor * that.parallax_details.location.top)
            ) * that.object.parallax.scale
          )))
        });


    }
});

module.exports = ParallaxView;

},{}],5:[function(require,module,exports){
var SequenceView = Backbone.View.extend({
    object: null,
    parent: null,
    currentIndex: null,
    timeout: null,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        that.currentIndex = that.object.sequence.length -1;
        that.sequence();
    },
    sequence: function() {
        var that = this;
        clearTimeout(that.timeout);

        that.currentIndex++;
        if(that.currentIndex>=that.object.sequence.length) {
          that.currentIndex = 0;
        }

        $(that.el).attr('src',  that.object.sequence[that.currentIndex].image_url);

        that.timeout = setTimeout(function(){
          that.sequence();
        }, that.object.sequence[that.currentIndex].duration * 1000);

    }
});

module.exports = SequenceView;

},{}],6:[function(require,module,exports){
var SlideIntoView = Backbone.View.extend({
    object: null,
    scaleFactor: 1,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        if (options.scaleFactor!=undefined) {
          that.scaleFactor = options.scaleFactor;
        }
        that.slideIn();
    },
    slideIn: function() {
        var that = this;
        $(that.el).css('opacity', 1);
        var tm = new TweenLite.fromTo($(that.el), that.object.slide_in.duration,
          {
            top: that.scaleFactor * that.object.slide_in.top,
            left: that.scaleFactor * that.object.slide_in.left
          },
          {
            top: that.scaleFactor * that.object.location.top,
            left: that.scaleFactor * that.object.location.left
          }
        );
    }
});

module.exports = SlideIntoView;

},{}],7:[function(require,module,exports){
var ClickScrollView = Backbone.View.extend({
    object: null,
    parent: null,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        $(that.el).click(function(){
          that.clickScroll();
        });
    },
    clickScroll: function() {
        var that = this;
        TweenLite.to(
          window,
          that.object.click_scroll.duration,
          {
            scrollTo:{
              x: that.parent.scaleFactor * that.object.click_scroll.scroll_x
            },
            ease: Power2.easeOut
          }
        );
    }
});

module.exports = ClickScrollView;

},{}],8:[function(require,module,exports){
var AlwaysOnTopManagerView = Backbone.View.extend({
    objects: [],
    parent: null,
    initialize: function(options) {
        var that = this;
        that.parent = options.parent;
        that.parent.w.scroll(_.bind($.debounce(100, that.adjust), that));
    },
    addObject: function(object) {
        var that = this;
        that.objects.push(object);
    },
    adjust: function() {
        var that = this;
        _.each(that.objects, function(object,i){
            TweenLite.to(
              $('#' + object.id),
              object.always_on_top.duration,
              {
                left: (that.parent.scaleFactor * object.location.left) + that.el.scrollX,
                ease: Elastic.easeOut.config(0.8, 0.3),
                delay: Math.random() * 0.15
              }
            );
        });

    }
});

module.exports = AlwaysOnTopManagerView;

},{}],9:[function(require,module,exports){
var PopupBannerView = Backbone.View.extend({
    objects: [],
    parent: null,
    popup_el: null,
    popup_details: null,
    jQpopup: null,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        that.popup_el = options.popup_el;
        that.popup_details = options.popup_details;
        that.jQpopup = $(that.popup_el);

        that.jQpopup.find('.close').click(function(){
          that.jQpopup.hide();
        });

        $(that.el).click(function(){
          that.popup();
        });

    },
    popup: function() {
        var that = this;
        that.jQpopup.find('.popup-content-body').html('');
        that.jQpopup.find('.popup-content-body').html(
          $('#' + that.object.popup_banner.popup_content_id).html()
        );
        that.jQpopup.show();

        TweenLite.to(
          that.popup_el,
          1,
          {
            left: window.scrollX,
            top: (( that.jQpopup.parent().height() - that.jQpopup.height()) / 2),
            width: that.parent.w.width(),
            ease: Power2.easeOut
          }
        );
    }
});

module.exports = PopupBannerView;

},{}],10:[function(require,module,exports){
var PopupSlideshowView = Backbone.View.extend({
    objects: [],
    parent: null,
    popup_el: null,
    popup_details: null,
    jQpopup: null,
    currentIndex: -1,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        that.popup_el = options.popup_el;
        that.popup_details = options.popup_details;
        that.jQpopup = $(that.popup_el);
        that.currentIndex = that.popup_details.slides.length - 1;
        that.jQpopup.find('.close').click(function(){
          that.jQpopup.hide();
        });
        that.jQpopup.find('.prev').click(function(){
          that.prev();
        });
        that.jQpopup.find('.next').click(function(){
          that.next();
        });
        $(that.el).click(function(){
          that.next();
        });

    },
    next: function() {
        var that = this;

        that.currentIndex++;
        if(that.currentIndex>=that.popup_details.slides.length) {
          that.currentIndex = 0;
        }
        that.render();
    },
    prev: function() {
        var that = this;
        that.currentIndex--;
        if(that.currentIndex<0) {
          that.currentIndex = that.popup_details.slides.length -1;
        }
        that.render();
    },
    render: function() {
        var that = this;
        
        that.jQpopup.show();
        that.jQpopup.find('.popup-slideshow-slide').hide();
        $('#' + that.object.popup_slideshow.popup_slideshow_id + that.currentIndex).show();
        _.each(that.jQpopup.find('.popup-slideshow-image'), function(e){
          e = $(e);
          e.css({
            height: that.parent.scaleFactor * that.popup_details.image_dimensions.max_height,
            width: 'auto'
          });
        });

        _.each(that.jQpopup.find('iframe'), function(e){
          e = $(e);
          e.css({
            height: that.parent.scaleFactor * that.popup_details.image_dimensions.max_height,
            width: that.parent.scaleFactor * that.popup_details.image_dimensions.max_height * 1.25
          });
        });


        TweenLite.to(
          that.popup_el,
          1,
          {
            left: window.scrollX,
            top: 0,
            width: that.parent.scaleFactor * 1920,
            height: that.parent.scaleFactor * 1080,
            ease: Power2.easeOut
          }
        );
    }
});

module.exports = PopupSlideshowView;

},{}],11:[function(require,module,exports){
var HorizontalPanelView = require('../library/views/HorizontalPanelView');

var horizontalPanelView = new HorizontalPanelView({
    el: 'body',
    layout: layout
});

},{"../library/views/HorizontalPanelView":1}]},{},[11]);
