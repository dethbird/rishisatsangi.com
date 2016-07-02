var DropdownButtonView = Backbone.View.extend({
    currentService: null,
    initialize: function(options) {
        var that = this;
        that.$el = $(that.el);
        that.$el.find('.dropdown-item').on('click', function(e){
            that.currentService = $(e.target).data('service');
            that.render();
        });
    },
    render: function() {
        var that = this;
        var content = that.$el.find(
            '.dropdown-item[data-service=' + that.currentService+ ']').html();
        that.$el.find('.displayed-item').html(content);
    }
});

module.exports = DropdownButtonView;
