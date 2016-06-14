var HoverSwapView = Backbone.View.extend({
    object: null,
    parent: null,
    jqEl: null,
    children: null,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        that.jqEl = $(that.el);
        that.children = [];
        _.each(that.object.hover_toggle, function(e){
          that.children.push($('#' + e.toggle_id));
        });

        that.jqEl.mouseover(function(){
          that.swap();
        });

        that.jqEl.mouseout(function(){
          that.restore();
        });

        that.jqEl.click(function(){
          that.restore();
        });

    },
    swap: function() {
        var that = this;
        if(!that.jqEl.hasClass('active')){
          that.jqEl.attr('src', that.object.hover_swap.swap_image_src);
        }
    },
    restore: function() {
        var that = this;
        if(!that.jqEl.hasClass('active')){
          that.jqEl.attr('src', that.object.image_url);
        }
    }
});

module.exports = HoverSwapView;
