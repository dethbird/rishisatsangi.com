import ButtonAnimationView from './animations/ButtonAnimationView';
import FlickerView from './animations/FlickerView';
import ParallaxView from './animations/ParallaxView';

const IndexView = Backbone.View.extend({
    w: null,
    scaleFactor: 1,
    initialize: function(options) {
        const that = this;
        that.w = $(window);

        // figure out the scale multiplier
        that.scaleFactor = that.w.width() / 1920;

        new ButtonAnimationView({
            el: '#great_button'
        });

        // parallaxes
        _.each($(that.el).find('.parallax'), function(e, i){
            e = $(e);
            const object = _.findWhere(layout.objects, {'id': e.attr('id')});
            const parallaxView = new ParallaxView({
                el: '#' + e.attr('id'),
                object: object,
                parallax_details: _.findWhere(layout.parallax, {'id': object.parallax.parallax_id}),
                parent: that
            });
        });

        // flicker
        _.each($(that.el).find('.flicker'), function(e, i){
            e = $(e);
            const object = _.findWhere(layout.objects, {'id': e.attr('id')});
            const flickerView = new FlickerView({
                el: '#' + e.attr('id'),
                object: object
            });
        });
    }
});

module.exports = IndexView;
