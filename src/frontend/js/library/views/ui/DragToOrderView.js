var Draggabilly = require('draggabilly');
var DragToOrderView = Backbone.View.extend({
    endPoint: null,
    parentId: null,
    columnCount: false, // use grid functionality? keeps items heights at max(elems.height)
    initialize: function(options) {

        var that = this;
        var $el = $(this.el);
        that.endPoint = options.endPoint;
        that.parentId = options.parentId;
        that.grid = options.grid;
        that.columnCount = options.columnCount;


        $.notify.defaults({
            autoHideDelay: 2500,
            className: 'info',
            position: 'top',
            showAnimation: 'fadeIn',
            hideAnimation: 'fadeOut'
        });

        $el.sortable({
            handle: '.handle',
            cursor: 'move',
            stop: function(e,ui){

                var $item = $(ui.item);

                $item.notify('Saving order ...', {
                    autoHide: false
                });

                data = {};
                data[that.parentId] = $el.data('id');
                data['items'] = [];

                // console.log();

                $el.children('.sortable-row-divider').remove();
                $el.children('.sortable').each( function(i,e) {
                    var $e = $(e);
                    if((i+1) % that.columnCount == 0){
                        $('<div class="sortable-row-divider"></div>').insertAfter($e);
                    }
                    if($e.data('id')!="") {
                        data['items'][$e.data('id')] = i;
                    }
                    $e.find('.sort_order').html(i+1);
                });

                // make the request
                $.ajax({
                    method: 'POST',
                    url: that.endPoint,
                    data: data
                })
                .success(function(data){
                    $item.notify('Saved order.', {
                        className: 'success'});
                })
                .error(function(data){
                    $item.notify('Error', {
                        className: 'error'});
                });
            }
        });

    },

});

module.exports = DragToOrderView;
