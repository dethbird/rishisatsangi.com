var LoaderView = Backbone.View.extend({
    interval: null,
    timeline: null,
    maxPixels: 300,
    loadingEl: null,
    documentImagesLoaded: 0,
    documentImageCount: null,
    documentImages: null,
    fakeTimeOutComplete: false,
    imagesLoadedComplete: false,

    initialize: function(options) {

        var that = this;
        this.loadingEl = options.loadingEl;
        this.documentImages = $('img');
        this.documentImageCount = this.documentImages.length;

        for (i = 0; i < this.maxPixels; i++) {
          var dot = $("<div class='dot'/>");
          dot.appendTo($(this.el));
          dot.attr('id', "dot" + i);
        }

        this.timeline = new TimelineMax(
          {
            repeat: -1
          }
        );

        this.timeline.add( TweenMax.to($(this.loadingEl), .25, {
          scale: [1.2, 1.2],
          ease: Power1.easeIn
        }))
        .add( TweenMax.to($(this.loadingEl), 1, {
          scale: [1, 1],
          ease: Elastic.easeOut.config(1, 0.3)
        }))
        .call(this.render, null, this, 0);

        setTimeout(function(){
            that.fakeTimeOutComplete = true;
            // if(that.imagesLoadedComplete==true) {
                that.timeline.pause();
                $(that.el).fadeOut(1000);
            // }
        }, 1500);

        // $.each(this.documentImages, function(i,e){
        //     $(e).on('load', function(){
        //         that.documentImagesLoaded++;
        //         // console.log(that.documentImagesLoaded);
        //         if(that.documentImagesLoaded>(that.documentImageCount*.65)) {
        //             that.imagesLoadedComplete=true;
        //             if(that.fakeTimeOutComplete==true) {
        //                 that.timeline.pause();
        //                 $(that.el).fadeOut(1000);
        //             }
        //         }
        //     });
        // });

        $(that.el).css('margin-top', window.scrollY);


    },
    render: function() {
        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var pixelSize = windowWidth / this.maxPixels;
        var counter = 0;
        var increase = ((Math.PI * Math.random() * 10) + 8) / this.maxPixels;
        var pos = Math.random()*4;
        var waveHeight = Math.random()*3 + 3;

        $.each($('.dot'), function(i,dot){

            TweenLite.set(dot, {
              x: i*pixelSize,
              y: (Math.sin( counter + pos)/waveHeight) * windowHeight,
              width: pixelSize,
              height: pixelSize,
              opacity: 1
            });

            TweenLite.to(dot, 1.2 + Math.random()*0.5, {
              opacity: 0,
              y: "+=" + Math.random() * 400 + 400,
              ease: RoughEase.ease.config({ template: Power0.easeNone, strength: 1.5, points: 20, taper: "none", randomize: true, clamp: false})
            });
            counter += increase;
        });
    }
});

module.exports = LoaderView;