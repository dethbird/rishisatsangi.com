var DragToOrderView = require('./ui/DragToOrderView');
var ProjectDetailView = Backbone.View.extend({
    initialize: function(options) {
        var that = this;
        var $el = $(this.el);
        $el.imagesLoaded(function(){

            $('.sortable-characters').each(function(i,e){
                dragToOrderView = new DragToOrderView({
                    el: e,
                    endPoint: '/api/project_character_order',
                    parentId: 'project_id',
                    columnCount: $(this).data('column-count')
                });
            });

            $('.sortable-storyboards').each(function(i,e){
                dragToOrderView = new DragToOrderView({
                    el: e,
                    endPoint: '/api/project_storyboard_order',
                    parentId: 'project_id',
                    columnCount: $(this).data('column-count')
                });
            });

            $('.sortable-panels').each(function(i,e){
                dragToOrderView = new DragToOrderView({
                    el: e,
                    endPoint: '/api/project_storyboard_panel_order',
                    parentId: 'storyboard_id',
                    columnCount: $(this).data('column-count')
                });
            });

            $('.sortable-concept_art').each(function(i,e){
                dragToOrderView = new DragToOrderView({
                    el: e,
                    endPoint: '/api/project_concept_art_order',
                    parentId: 'project_id',
                    columnCount: $(this).data('column-count')
                });
            });

        });
    }
});

module.exports = ProjectDetailView;
