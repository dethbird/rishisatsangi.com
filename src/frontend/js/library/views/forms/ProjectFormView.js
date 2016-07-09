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
        var $target = $(e.target);
        var $el = $(this.el);
        var data = _.object(_.map($el.serializeArray(), _.values));

        $.ajax({
            method: data['id'] == '' ? 'POST' : 'PUT',
            url: this.projectUrl + (
                data['id'] == '' ? '' : '/' + data['id']),
            data: data,
            beforeSend: function(){
                $el.find('.form-group').removeClass('has-danger');
                $target.addClass('disabled');
            }
        })
        .success(function(data){
            $el.find('input[name=id]').val(data.id);
        })
        .error(function(data){
            $.each(data.responseJSON, function(i,e){
                $el.find(
                    '[name=' +  e.property + ']').closest(
                        '.form-group').addClass('has-danger');
            });
        })
        .complete(function(){
            $target.removeClass('disabled');
        });
    }
});

module.exports = ProjectFormView;
