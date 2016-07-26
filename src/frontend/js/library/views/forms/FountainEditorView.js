var FountainEditorView = Backbone.View.extend({
    events: {
        'click .fountain-edit-preview-button': 'showPreview'
    },
    initialize: function() {
        var that = this;
    },
    showPreview: function() {
        var that = this;
        var parsed = fountain.parse(
            $(that.el).find('.fountain-edit-editor').val(),
            true
        );
        $('#modal').find('.modal-title').html('Script Preview');
        $('#modal').find('.modal-body').html('<div class="fountain">' + parsed.html.script + '</div>');
        $('#modal').modal('show');
    }
});

module.exports = FountainEditorView;
