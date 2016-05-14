var FromTo = Backbone.View.extend({
    object: null,
    parent: null,
    currentIndex: null,
    timeout: null,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        that.currentIndex = that.object.from_to.sequence.length -1;
        that.fromTo();
    },
    fromTo: function() {
        var that = this;
        clearTimeout(that.timeout);

        that.currentIndex++;
        if(that.currentIndex>=that.object.from_to.sequence.length) {
          that.currentIndex = 0;
        }

        // that.object.from_to.sequence[that.currentIndex].duration)

        that.timeout = setTimeout(
          function(){
            var tm = TweenLite.fromTo(
              $(that.el),
              that.object.from_to.sequence[that.currentIndex].duration,
              {
                left: that.parent.scaleFactor * that.object.from_to.sequence[that.currentIndex].from.left,
                top: that.parent.scaleFactor * that.object.from_to.sequence[that.currentIndex].from.top
              },
              {
                left: that.parent.scaleFactor * that.object.from_to.sequence[that.currentIndex].to.left,
                top: that.parent.scaleFactor * that.object.from_to.sequence[that.currentIndex].to.top,
                onComplete: function(){
                  that.fromTo();
                },
                ease: Power0.easeNone
              }
            );
          },
          (that.object.from_to.sequence[that.currentIndex].min_delay + Math.random() * that.object.from_to.sequence[that.currentIndex].random_delay)  * 1000
        );



        // $(that.el).attr('src',  that.object.sequence[that.currentIndex].image_url);
        //
        // that.timeout = setTimeout(function(){
        //   that.sequence();
        // }, that.object.sequence[that.currentIndex].duration * 1000);

    }
});

module.exports = FromTo;
