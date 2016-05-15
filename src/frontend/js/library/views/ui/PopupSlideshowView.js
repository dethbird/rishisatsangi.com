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
        that.jQpopup.find('.popup-content-body').html('');
        that.jQpopup.find('.popup-content-body').html(
          $('#' + that.object.popup_slideshow.popup_slideshow_id + that.currentIndex).html()
        );

        that.jQpopup.find('.popup-controls .title').html(that.popup_details.title);

        that.jQpopup.find('.popup-controls .indicator').html(that.currentIndex +  1 + '/' + that.popup_details.slides.length);

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

        that.jQpopup.show();

        TweenLite.to(
          that.popup_el,
          1,
          {
            left: window.scrollX,
            top: 0,
            width: that.parent.w.width(),
            height: that.parent.w.height(),
            ease: Power2.easeOut
          }
        );
    }
});

module.exports = PopupSlideshowView;
