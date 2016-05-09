var PageCollection = Backbone.Collection.extend({
    initialize: function(data) {
        var that = this;
        $.each(data, function(i,e){
            e.id = i+1;
            var model = new Backbone.Model(e);
            that.add(model);
        });
    }
});

module.exports = PageCollection;