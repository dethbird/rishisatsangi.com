var DropdownButtonView = require('./buttons/DropdownButtonView');
var DashboardView = Backbone.View.extend({
    model: null,
    dropdownButtonView: null,
    initialize: function(options) {
        var that = this;
        this.render();

        that.dropdownButtonView = new DropdownButtonView({
            el: '#contentSelector'
        });
        // $('#contentSelector').parent().on('hide.bs.dropdown', function (e) {
        //     console.log(e);
        // });
    }
});

module.exports = DashboardView;
