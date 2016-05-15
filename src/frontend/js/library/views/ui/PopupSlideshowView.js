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
