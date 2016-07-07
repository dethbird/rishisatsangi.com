var ProjectFormView = Backbone.View.extend({
    projectUrl: '/api/project',
    events: {
        'click .submit-button': 'submit'
    },
    submit: function(e) {
        var that = this;
        $el = $(this.el);
        data = _.object(_.map($el.serializeArray(), _.values));

        $.ajax({
            method: data['id'] == '' ? 'POST' : 'PUT',
            url: this.projectUrl,
            data: data
        })
        .success(function(data){
            console.log(data);
        })
        .error(function(data){
            console.log(data);
            var $el = $(that.el);
        });
    }
});

module.exports = ProjectFormView;
