var PopupBannerView = Backbone.View.extend({
    objects: [],
    parent: null,
    popup_el: null,
    popup_details: null,
    jQpopup: null,
    initialize: function(options) {
        var that = this;
        that.object = options.object;
        that.parent = options.parent;
        that.popup_el = options.popup_el;
        that.popup_details = options.popup_details;
        that.jQpopup = $(that.popup_el);

        that.jQpopup.find('.close').click(function(){
          that.jQpopup.hide();
        });

        $(that.el).click(function(){
          that.popup();
        });

    },
    popup: function() {
        var that = this;
        that.jQpopup.find('.popup-content-body').html('');
        that.jQpopup.find('.popup-content-body').html(
          $('#' + that.object.popup_banner.popup_content_id).html()
        );
        that.jQpopup.show();

        TweenLite.to(
          that.popup_el,
          1,
          {
            left: window.scrollX,
            top: (( that.jQpopup.parent().height() - that.jQpopup.height()) / 2),
            width: that.parent.w.width(),
            ease: Power2.easeOut
          }
        );
    }
});

module.exports = PopupBannerView;
