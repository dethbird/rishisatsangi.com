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
