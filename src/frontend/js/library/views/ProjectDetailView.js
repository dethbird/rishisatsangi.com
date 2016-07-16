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

            $('.sortable-reference_images').each(function(i,e){
                dragToOrderView = new DragToOrderView({
                    el: e,
                    endPoint: '/api/project_reference_image_order',
                    parentId: 'project_id',
                    columnCount: $(this).data('column-count')
                });
            });

            $('.sortable-locations').each(function(i,e){
                dragToOrderView = new DragToOrderView({
                    el: e,
                    endPoint: '/api/project_location_order',
                    parentId: 'project_id',
                    columnCount: $(this).data('column-count')
                });
            });

        });

        $('.card-ui').each(function(i,card){
            var $card = $(card);
            $card.find('.thumbnail').on('mouseup', function(e){
                var $currentTarget = $(e.currentTarget);
                $card.find('.thumbnail').removeClass('active');
                $currentTarget.addClass('active');

                var thumbnailImage =  $currentTarget.find('img');
                var displayImage = $card.find('img.display');
                displayImage.removeClass('portrait').removeClass('landscape');
                displayImage.attr('src', thumbnailImage.attr('src'));
                displayImage.attr('data-image-index', displayImage.attr('data-image-index'));
            });
        });
    }
});

module.exports = ProjectDetailView;
