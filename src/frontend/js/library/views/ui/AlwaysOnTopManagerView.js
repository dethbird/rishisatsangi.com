var AlwaysOnTopManagerView = Backbone.View.extend({
    objects: [],
    parent: null,
    initialize: function(options) {
        var that = this;
        that.parent = options.parent;
        that.parent.w.scroll(_.bind($.debounce(100, that.adjust), that));
    },
    addObject: function(object) {
        var that = this;
        that.objects.push(object);
    },
    adjust: function() {
        var that = this;
        _.each(that.objects, function(object,i){
            TweenLite.to(
              $('#' + object.id),
              object.always_on_top.duration,
              {
                left: (that.parent.scaleFactor * object.location.left) + that.el.scrollX,
                ease: Elastic.easeOut.config(0.8, 0.3),
                delay: Math.random() * 0.15
              }
            );
        });

    }
});

module.exports = AlwaysOnTopManagerView;
