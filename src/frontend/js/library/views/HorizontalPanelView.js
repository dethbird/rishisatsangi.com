var FlickerView = require('./animations/FlickerView');
var SlideIntoView = require('./animations/SlideIntoView');
var FromToView = require('./animations/FromToView');
var ParallaxView = require('./animations/ParallaxView');
var SequenceView = require('./animations/SequenceView');
var ClickScrollView = require('./buttons/ClickScrollView');
var AlwaysOnTopManagerView = require('./ui/AlwaysOnTopManagerView');
var PopupBannerView = require('./ui/PopupBannerView');
var PopupSlideshowView = require('./ui/PopupSlideshowView');
var HoverToggleView = require('./ui/HoverToggleView');
var HoverSwapView = require('./ui/HoverSwapView');

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
        console.log(that.w.width());
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

            if (e.hasClass('hover-toggle-trigger')) {
              new HoverToggleView({
                el: '#' + e.attr('id'),
                object: object,
                parent: that
              });
            }

            if (e.hasClass('hover-swap-trigger')) {
              new HoverSwapView({
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

      // vertically center the container
      var container = $('#container');
      container.css({
        marginTop: (that.w.height() - container.height()) / 2
      });

    }
});

module.exports = HorizontalPanelView;
