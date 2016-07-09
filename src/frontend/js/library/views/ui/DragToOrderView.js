var DragToOrderView = Backbone.View.extend({
    endPoint: null,
    parentId: null,
    initialize: function(options) {
        var that = this;
        that.endPoint = options.endPoint;
        that.parentId = options.parentId;

        $(that.el).sortable({
            handle: '.handle',
            cursor: "move",
            stop: function(e,ui) {
                var $target = $(e.target);
                data = {};
                data[that.parentId] = $target.data('id');
                data['items'] = [];

                $($target.children()).each(function(i,e){
                    var $e = $(e);
                    if($e.data('id')!="") {
                        data['items'][$e.data('id')] = i;
                    }
                });

                // make the request
                $.ajax({
                    method: 'POST',
                    url: that.endPoint,
                    data: data
                })
                .success(function(data){
                    console.log(data);
                })
                .error(function(data){
                    console.log(data);
                });

            }
        });
    }
});

module.exports = DragToOrderView;
