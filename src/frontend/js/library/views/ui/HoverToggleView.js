var HoverToggleView = Backbone.View.extend({
    object: null,
    parent: null,
    jqEl: null,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        that.jqEl = $(that.el);
        that.toggleEl = $('#' + that.object.hover_toggle.toggle_id);

        that.jqEl.mouseover(function(){
          that.show();
        });

        that.jqEl.mouseout(function(){
          that.hide();
        });
    },
    show: function() {
        var that = this;
        that.toggleEl.show();
    },
    hide: function() {
        var that = this;
        that.toggleEl.hide();
    }
});

module.exports = HoverToggleView;
