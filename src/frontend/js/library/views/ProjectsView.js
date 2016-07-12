var DragToOrderView = require('./ui/DragToOrderView');
var ProjectsView = Backbone.View.extend({
    initialize: function(options) {
        var that = this;
        var $el = $(this.el);
        $('.sortable-characters').each(function(i,e){
            dragToOrderView = new DragToOrderView({
                el: e,
                endPoint: '/api/project_character_order',
                parentId: 'project_id'
            });
        });

        $('.sortable-storyboards').each(function(i,e){
            dragToOrderView = new DragToOrderView({
                el: e,
                endPoint: '/api/project_storyboard_order',
                parentId: 'project_id'
            });
        });

        $('.sortable-panels').each(function(i,e){
            dragToOrderView = new DragToOrderView({
                el: e,
                endPoint: '/api/project_storyboard_panel_order',
                parentId: 'storyboard_id'
            });
        });
    }
});

module.exports = ProjectsView;
