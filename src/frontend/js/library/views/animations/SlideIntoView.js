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
