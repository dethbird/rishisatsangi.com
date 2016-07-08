marked = require('marked');
var ModalView = require('../ui/ModalView');

var MarkdownEditorView = Backbone.View.extend({
    modalView: null,
    events: {
        'click .markdown-edit-btn-preview': 'showPreview'
    },
    initialize: function() {
        var that = this;
        that.modalView = new ModalView();
    },
    showPreview: function() {
        var that = this;
        that.modalView.showContent(
            marked(
                $(that.el).find('.markdown-edit-editor').val()));
    }
});

module.exports = MarkdownEditorView;
