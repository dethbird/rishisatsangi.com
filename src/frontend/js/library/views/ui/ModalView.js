var ModalView = Backbone.View.extend({
    modal: null,
    initialize: function() {
        var that = this;
        var $el = $(this.el);

        that.modal = $('#explosioncorp-modal');
        that.modal.find('#explosioncorp-modal-close').click(function(){
            that.closeModal();
        });

    },
    showContent: function(content) {
        var that = this;
        that.modal.find('#explosioncorp-modal-content').html(content);
        that.modal.show();
    },
    closeModal: function() {
        var that = this;
        that.modal.hide();
    }
});

module.exports = ModalView;
