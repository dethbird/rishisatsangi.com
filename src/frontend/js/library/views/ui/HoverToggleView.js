var HoverToggleView = Backbone.View.extend({
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
          that.show();
        });

        that.jqEl.mouseout(function(){
          that.hide();
        });
    },
    show: function() {
        var that = this;
        _.each(that.children, function(e){
          e.show();
        });
    },
    hide: function() {
        var that = this;
        _.each(that.children, function(e){
          e.hide();
        });
    }
});

module.exports = HoverToggleView;
