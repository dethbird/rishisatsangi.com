var DropdownButtonView = Backbone.View.extend({
    currentService: null,
    initialize: function(options) {
        var that = this;
        that.$el = $(that.el);
        that.currentService = that.$el.find(
            '.dropdown-item:first-child').data('service');
        that.$el.find('.dropdown-item').on('click', function(e){
            that.currentService = $(e.target).data('service');
            that.render();
        });
        that.render();
    },
    render: function() {
        var that = this;
        var content = that.$el.find(
            '.dropdown-item[data-service=' + that.currentService+ ']').html();
        that.$el.find('.displayed-item').html(content);
        that.trigger('serviceChange', that.currentService);
    }
});

module.exports = DropdownButtonView;
