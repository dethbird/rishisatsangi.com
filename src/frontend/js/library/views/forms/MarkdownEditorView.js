marked = require('marked');
var ModalView = require('../ui/ModalView');

var MarkdownEditorView = Backbone.View.extend({
    modalView: null,
    events: {
        'click .markdown-edit-btn-preview': 'showPreview',
        'keypress .markdown-edit-editor': 'keyTest'
    },
    initialize: function() {
        var that = this;
        that.modalView = new ModalView();
    },
    keyTest: function(e) {
        var that = this;
        if(e.keyCode == 13 && e.shiftKey && e.ctrlKey) {
            that.showPreview();
        }
    },
    showPreview: function() {
        var that = this;
        that.modalView.showContent(
            marked(
                $(that.el).find('.markdown-edit-editor').val()));
    }
});

module.exports = MarkdownEditorView;
