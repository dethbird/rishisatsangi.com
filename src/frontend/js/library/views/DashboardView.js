var DropdownButtonView = require('./buttons/DropdownButtonView');
var DashboardView = Backbone.View.extend({
    model: null,
    dropdownButtonView: null,
    currentService: null,
    initialize: function(options) {
        var that = this;
        that.$el = $(that.el);
        that.currentService = $(that.$el.find(
            '.content-container')[0]).data('service');
        that.dropdownButtonView = new DropdownButtonView({
            el: '#contentSelector'
        });
        that.dropdownButtonView.on('serviceChange', function(serviceName){
            that.currentService = serviceName;
            that.render();
        });
        that.render();
    },
    render: function() {
        var that = this;
        $(that.$el.find('.content-container')).hide();
        $(that.$el.find(
            '.content-container[data-service=' + that.currentService + ']')).show();
    }
});

module.exports = DashboardView;
