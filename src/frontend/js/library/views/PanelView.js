var ButtonAnimationView = require('./animations/ButtonAnimationView');
var FlickerView = require('./animations/FlickerView');
var SlideIntoView = require('./animations/SlideIntoView');
var FromToView = require('./animations/FromToView');
var ParallaxView = require('./animations/ParallaxView');
var SequenceView = require('./animations/SequenceView');
var ClickScrollView = require('./buttons/ClickScrollView');
var AlwaysOnTopManagerView = require('./ui/AlwaysOnTopManagerView');
var SlidesGalleryView = require('./ui/SlidesGalleryView');
var HoverToggleView = require('./ui/HoverToggleView');
var HoverSwapView = require('./ui/HoverSwapView');

var HorizontalPanelView = Backbone.View.extend({
    $container: null,
    greatButtonId: null,
    w: null,
    layout: null,
    scaleFactor: 1,
    alwaysOnTopManager: null,
    slidesGalleryManager: null,
    initialize: function(options) {
        var that = this;
        that.w = $(window);
        that.layout = options.layout;
        that.greatButtonId = options.greatButtonId;
        that.$container = $('#container');

        // figure out the scale multiplier
        that.scaleFactor = that.w.width() / that.layout.panel.width;

        // always on top manager keeps the menu on top
        that.alwaysOnTopManager = new AlwaysOnTopManagerView({
          el: window,
          parent: that
        });

        new ButtonAnimationView({
          el: that.greatButtonId
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

            // if (e.hasClass('popup-banner-trigger')) {
            //   new PopupBannerView({
            //     el: '#' + e.attr('id'),
            //     popup_el: '#popup_banner',
            //     object: object,
            //     popup_details: _.findWhere(that.layout.popup_banner, {'id': object.popup_banner.popup_content_id}),
            //     parent: that
            //   });
            // }

            // if (e.hasClass('popup-slideshow-trigger')) {
            //   var popupSlideshowView = new PopupSlideshowView({
            //     el: '#' + e.attr('id'),
            //     popup_el: '#' + object.popup_slideshow.popup_slideshow_id,
            //     object: object,
            //     parent: that
            //   });
            // }

            if (e.hasClass('parallax')) {
              var parallaxView = new ParallaxView({
                el: '#' + e.attr('id'),
                object: object,
                parallax_details: _.findWhere(that.layout.parallax, {'id': object.parallax.parallax_id}),
                parent: that
              });
            }

            if (e.hasClass('slides-gallery')) {
              new SlidesGalleryView({
                el: '#' + e.attr('id'),
                object: object,
                trigger_object: _.findWhere(that.layout.objects, {'id': object.slides_gallery.trigger_id}),
                parent: that
              });
            }

            if (e.hasClass('always-on-top')) {
                that.alwaysOnTopManager.addObject(object);
            }

        });

        // rescale on window resize
        that.w.resize(_.bind($.debounce(250, that.resize), that));
        that.w.trigger('resize');
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

          var cssProps = {};
          if(object.dimensions != undefined) {
            cssProps.width = that.scaleFactor * object.dimensions.width;
            cssProps.height = that.scaleFactor * object.dimensions.height;
          }
          if(object.location != undefined) {
            cssProps.top = that.scaleFactor * object.location.top;
            cssProps.left = that.scaleFactor * object.location.left;
          }
          if (object) {
            e.css(cssProps);
          }
      });


    }
});

module.exports = HorizontalPanelView;
