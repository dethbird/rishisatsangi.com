var AlwaysOnTopManagerView = Backbone.View.extend({
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

module.exports = AlwaysOnTopManagerView;
