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
