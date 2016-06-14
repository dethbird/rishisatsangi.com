var SequenceView = Backbone.View.extend({
    object: null,
    parent: null,
    currentIndex: null,
    timeout: null,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        that.currentIndex = that.object.sequence.length -1;
        that.sequence();
    },
    sequence: function() {
        var that = this;
        clearTimeout(that.timeout);

        that.currentIndex++;
        if(that.currentIndex>=that.object.sequence.length) {
          that.currentIndex = 0;
        }

        $(that.el).attr('src',  that.object.sequence[that.currentIndex].image_url);

        that.timeout = setTimeout(function(){
          that.sequence();
        }, that.object.sequence[that.currentIndex].duration * 1000);

    }
});

module.exports = SequenceView;
