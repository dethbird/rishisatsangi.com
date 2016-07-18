var LikeDropDashboardView = Backbone.View.extend({
    initialize: function(options) {
        var that = this;

        $(that.el).ready(function(){
            that.render();
        });

        $(window).resize( $.debounce( 250, function(){
            that.render();
        }));
    },
    render: function() {
        var that = this;
        var $el = $(that.el);
        var $window = $(window);

        var firstCard = $el.find('.content-container').find('.card:first-child');
        var rowCount = Math.floor($window.width() / $(firstCard).outerWidth());
        $el.find('.content-container').children('.card-row-divider').remove();
        $el.find('.content-container').children('.card').each(function(i,e){
            if (((i + 1) % rowCount) == 0) {
                $('<div class="card-row-divider"></div>').insertAfter($(e));
            }
        });
    }
});

module.exports = LikeDropDashboardView;
