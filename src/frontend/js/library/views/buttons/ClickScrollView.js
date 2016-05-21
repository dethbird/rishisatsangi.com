var ClickScrollView = Backbone.View.extend({
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
        var props = {};
        if(that.object.click_scroll.scroll_x){
          props.x = that.parent.scaleFactor * that.object.click_scroll.scroll_x;
        }
        if(that.object.click_scroll.scroll_y){
          props.y = that.parent.scaleFactor * that.object.click_scroll.scroll_y;
        }
        TweenLite.to(
          window,
          that.object.click_scroll.duration,
          {
            scrollTo: props,
            ease: Power2.easeOut
          }
        );
    }
});

module.exports = ClickScrollView;
