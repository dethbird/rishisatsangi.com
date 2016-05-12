var HorizontalPanelView = Backbone.View.extend({
    w: null,
    layout: null,
    scaleFactor: 1,
    initialize: function(options) {
        var that = this;
        that.w = $(window);
        that.layout = options.layout;

        // rescale on window resize
        that.w.resize(_.bind($.debounce(250, that.resize), that));
        that.resize();
    },
    resize: function(){
      var that = this;

      // figure out the scale multiplier
      that.scaleFactor = that.w.width() / that.layout.panel.width;

      $(that.el).css({
        marginTop: (that.w.height() - that.scaleFactor * that.layout.panel.height) / 2
      });

      _.each($(that.el).find('.object'), function(e, i){
          e = $(e);
          var object = _.findWhere(that.layout.objects, {'id': e.attr('id')});
          e.css({
            width: that.scaleFactor * object.dimensions.width,
            height: that.scaleFactor * object.dimensions.height,
            top: that.scaleFactor * object.end_location.top,
            left: that.scaleFactor * object.end_location.left
          });
      });

      _.each($(that.el).find('.text'), function(e, i){
          e = $(e);
          var object = _.findWhere(that.layout.text, {'id': e.attr('id')});
          e.css({
            width: that.scaleFactor * object.dimensions.width,
            height: that.scaleFactor * object.dimensions.height,
            top: that.scaleFactor * object.end_location.top,
            left: that.scaleFactor * object.end_location.left
          });
      });
    }
});

module.exports = HorizontalPanelView;
