var SlidesGalleryView = Backbone.View.extend({
    object: null,
    trigger_object: null,
    parent: null,
    $el: null,
    $trigger: null,
    currentIndex: 1,
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

        that.$el.find('.close').click(function(){
          that.hide();
        });
        that.$el.find('.prev').click(function(){
          that.prev();
        });
        that.$el.find('.next').click(function(){
          that.next();
        });

    },
    show: function(){
      var that = this;
      that.parent.$container.find('.slides-gallery').hide();
      that.parent.$container.find('.slides-gallery-trigger').removeClass('active');
      that.parent.$container.find('.slides-gallery-trigger').trigger('mouseout');

      that.$el.show();
      that.$trigger.trigger('mouseover');
      that.$trigger.addClass('active');
      that.render();
    },
    hide: function(){
      var that = this;
      that.parent.$container.find('.slides-gallery').hide();
      that.parent.$container.find('.slides-gallery-trigger').removeClass('active');
      that.$trigger.removeClass('active');
      that.$trigger.trigger('mouseout');
    },
    next: function() {
        var that = this;
        that.currentIndex++;
        if(that.currentIndex>=that.$slides.length) {
          that.currentIndex = 1;
        }
        that.render();
    },
    prev: function() {
        var that = this;
        that.currentIndex--;
        if(that.currentIndex<1) {
          that.currentIndex = that.$slides.length;
        }
        that.render();
    },
    render: function() {
        var that = this;
        that.$slides.hide();
        var $slide = $('#' + that.object.slides_gallery.id + that.currentIndex);
        $slide.show();
        $slide.find('.gallery-object img').css({
          maxHeight: that.$el.height() * 0.95,
          maxWidth: that.$el.width() * 0.95
        });
        $slide.find('.gallery-object iframe').css({
          height: that.$el.height() * 0.95,
          width: that.$el.width() * 0.95
        });
        $slide.find('.gallery-comic-object').css({
          height: that.$el.height() * 0.95,
          width: that.$el.width() * 0.95
        });
        $slide.find('.gallery-comic-object img').css({
          maxHeight: that.$el.height() * 0.85
        });
    }
});

module.exports = SlidesGalleryView;
