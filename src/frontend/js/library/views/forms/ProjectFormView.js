var MarkdownEditorView = require('./MarkdownEditorView');
var ProjectFormView = Backbone.View.extend({
    projectUrl: '/api/project',
    events: {
        'click .submit-button': 'submit'
    },
    initialize: function() {
        var that = this;
        var $el = $(this.el);

        $el.find('.markdown-edit').each(function(i,editor){
            var markdownEditor = new MarkdownEditorView({
                el: editor
            });
        });
    },
    submit: function(e) {
        var that = this;
        $el = $(this.el);
        data = _.object(_.map($el.serializeArray(), _.values));

        $.ajax({
            method: data['id'] == '' ? 'POST' : 'PUT',
            url: this.projectUrl + (
                data['id'] == '' ? '' : '/' + data['id']),
            data: data
        })
        .success(function(data){
            $el.find('input[name=id]').val(data.id);
        })
        .error(function(data){
            console.log(data);
        });
    }
});

module.exports = ProjectFormView;