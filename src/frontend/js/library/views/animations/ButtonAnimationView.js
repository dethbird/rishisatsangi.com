var ButtonAnimationView = Backbone.View.extend({
    initialize: function(options) {
        var that = this;
        this.timeline = new TimelineMax({
            paused: true,
            onComplete: function(){
                alert('Fantastic!');
            }
        });
        this.timeline.set($(this.el), {autoAlpha:1});
        this.timeline
        .fromTo(
            this.el,
            1,
            {
                transformStyle: "preserve-3d",
                transformOrigin: "center 0px",
                rotationX: 0
            },
            {
                rotationX: 360 * 2,
                ease: Back.easeOut
            },
            0
        )
        .fromTo(
            this.el,
            2.2,
            {
                transformStyle: "preserve-3d",
                transformOrigin: "left 0px",
                rotationZ: 0
            },
            {
                rotationZ: 80,
                ease: Elastic.easeOut.config(1.5, 0.3)
            },
            0.8
        )
        .to(
            this.el,
            1.2,
            {
                physics2D: {
                    gravity: 5000,
                    velocity: 400,
                    angle: -90
                }
            },
            1
        );
        // console.log(this);
        $(this.el).on('click', function(){
            that.timeline.play(0);
        });
    }
});

module.exports = ButtonAnimationView;