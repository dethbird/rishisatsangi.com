var Draggabilly = require('draggabilly');
var DragToOrderView = Backbone.View.extend({
    endPoint: null,
    parentId: null,
    grid: true, // use grid functionality? keeps items heights at max(elems.height)
    initialize: function(options) {
        var that = this;
        var $el = $(this.el);
        that.endPoint = options.endPoint;
        that.parentId = options.parentId;
        that.grid = options.grid;

        $.notify.defaults({
            autoHideDelay: 2500,
            className: 'info',
            position: 'top',
            showAnimation: 'fadeIn',
            hideAnimation: 'fadeOut'
        });

        $el.packery({
            itemSelector: '.sortable',
            gutter: 5,
            percentPosition: true
        });

        $el.find('.sortable').each(function(i,e){
            var draggie = new Draggabilly(e, {
                containment: $(e).parent()[0],
                handle: '.handle'
            });
            $el.packery( 'bindDraggabillyEvents', draggie );
        });
        //
        // $el.imagesLoaded( function() {
        console.log(that.grid);
        if (that.grid == true) {
            var maxHeight = 0;
            $el.find('.sortable').each(function(i,e){
                $e = $(e);
                if($e.height() > maxHeight){
                    maxHeight = $e.height();
                }
            })
            $el.find('.sortable').css('height', maxHeight);
        }
        $el.packery();
        // });

        $el.on( 'dragItemPositioned', function(e, trigger){
            that.orderItems(trigger,
                $el.packery('getItemElements'));
        });

    },
    orderItems: function(trigger,items) {

        var that = this;
        var $el = $(this.el);

        data = {};
        data[that.parentId] = $el.data('id');
        data['items'] = [];

        $(items).each(function(i,e){
            var $e = $(e);
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
            $(trigger.element).notify('Saved order.', {
                className: 'success'});
        })
        .error(function(data){
            $(trigger.element).notify('Error saving order.', {
                className: 'error'});
        });
    }

});

module.exports = DragToOrderView;
