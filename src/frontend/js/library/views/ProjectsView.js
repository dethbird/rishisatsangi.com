var DragToOrderView = require('./ui/DragToOrderView');
var ProjectsView = Backbone.View.extend({
    initialize: function(options) {
        var that = this;
        var $el = $(this.el);

        $(that.el).ready(function(){
            that.render();
        });

        $(window).resize( $.debounce( 250, function(){
            that.render();
        }));
    },
    render: function(){
        var that = this;

        var $el = $('.content-container');
        var firstCard = $el.find('.card:first-child');
        var rowCount = Math.floor($el.width() / $(firstCard).outerWidth());
        $el.children('.card-row-divider').remove();
        $el.children('.card').each(function(i,e){
            if (((i + 1) % rowCount) == 0) {
                $('<div class="card-row-divider"></div>').insertAfter($(e));
            }
        });
    }
});

module.exports = ProjectsView;
