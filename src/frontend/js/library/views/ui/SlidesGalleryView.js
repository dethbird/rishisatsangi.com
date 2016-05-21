var SlidesGalleryView = Backbone.View.extend({
    object: null,
    trigger_object: null,
    parent: null,
    $el: null,
    $trigger: null,
    currentIndex: -1,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.trigger_object = options.trigger_object;
        that.parent = options.parent;
        that.$el = $(that.el);
        that.$trigger = $('#' + that.object.slides_gallery.trigger_id);
        that.$slides = that.$el.find('.gallery-slide');
        that.$el.hide();
        that.$slides.hide();

        that.$trigger.click(function(){
          that.show();
        })
        // that.currentIndex = that.popup_details.slides.length - 1;

        that.$el.find('.close').click(function(){
          that.hide();
        });
        // that.jQpopup.find('.prev').click(function(){
        //   that.prev();
        // });
        // that.jQpopup.find('.next').click(function(){
        //   that.next();
        // });
        // $(that.el).click(function(){
        //   that.next();
        // });
        console.log(that);
    },
    show: function(){
      var that = this;
      that.parent.$container.find('.slides-gallery').hide();
      that.parent.$container.find('.slides-gallery-trigger').removeClass('active');
      that.$el.show();
      that.$trigger.addClass('active');
      // that.$trigger.attr('src', that.trigger_object.slides_gallery_trigger.swap_image_src);
    },
    hide: function(){
      var that = this;
      that.parent.$container.find('.slides-gallery').hide();
      that.parent.$container.find('.slides-gallery-trigger').removeClass('active');
      that.$trigger.removeClass('active');
      that.$trigger.trigger('mouseout');
      // that.$trigger.attr('src', that.trigger_object.image_url);
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

module.exports = SlidesGalleryView;
