var DragToOrderView = require('./ui/DragToOrderView');
var ProjectsView = Backbone.View.extend({
    initialize: function(options) {
        var that = this;
        var $el = $(this.el);
        $('.sortable-storyboards').each(function(i,e){
            dragToOrderView = new DragToOrderView({
                el: e,
                endPoint: '/api/project_storyboard_order',
                parentId: 'project_id'
            });
        });
    }
});

module.exports = ProjectsView;
