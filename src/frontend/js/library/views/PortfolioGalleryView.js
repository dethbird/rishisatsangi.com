var autoLink = require('../../library/autolink');

var PortfolioGalleryView = Backbone.View.extend({
    sectionSelectors: null,
    sections: null,
    thumbnails: null,
    overlayId: null,
    galleryCollection: null,
    galleryModelTemplateId: null,
    instagramCollection: null,
    instagramModelTemplateId: null,
    initialize: function(options) {
        var that = this;

        this.overlayId = options.overlayId;

        this.galleryCollection = options.galleryCollection;
        this.galleryModelTemplateId = options.galleryModelTemplateId;
        this.instagramCollection = options.instagramCollection;
        this.instagramModelTemplateId = options.instagramModelTemplateId;

        this.sectionSelectors = $(this.el).find('.section-selector');
        this.sections = $(this.el).find('.section');
        this.thumbnails = $(this.el).find('.thumbnail');


        // section selection
        $.each(this.sectionSelectors, function(i,e) {
            e = $(e);
            e.on('click', function(){
                $(that.sectionSelectors).removeClass('active');
                $('.section').hide();

                e.addClass('active');
                $('.section[data-section="' + e.data('section') + '"]').show();
            });

        });

        // thumbnail selection to overlay
        $.each(this.thumbnails, function(i,e) {
            e = $(e);
            e.on('click', function(){
                that.overlay(e);
            });
        });

        // hide overlay on escape
        $(document).keydown(function(e) {
            // ESCAPE key pressed
            if (e.keyCode == 27) {
                 $(that.overlayId).hide();
            }
        });
        $(that.overlayId + ' .contents').on('click', function(e){
            e.stopPropagation();
        });
        $(that.overlayId).on('click', function(e){
            $(that.overlayId).hide();
        });

        // re-fit overlay on window scroll
        // @todo refit the overlay

        // re-fit overlay on window resize
        // @todo refit the overlay
    },
    overlay: function(thumbnail){
        var that = this;
        var type = thumbnail.data('type');
        var model = null;
        var id = thumbnail.data('id');
        var templateId = null;
        if( type=="portfolio") {
            model = that.galleryCollection.get(id);
            templateId = that.galleryModelTemplateId;
        } else if (type=="instagram") {
            model = that.instagramCollection.get(id);
            templateId = that.instagramModelTemplateId;
            // timeago
            var date = new Date(model.get('created_time')*1000);
            date = $.timeago(date.toISOString());
            model.set('date', date);
        }
        // render in the contents
        var template = _.template($(templateId).html());
        var html = template(model.attributes, {escape: false});
        html = html.autoLink();
        html = html.replace(/#([a-zA-Z0-9]+)/g,'<a>#$1</a>');
        $(that.overlayId + ' .contents').html(html);
        // position the overlay
        $(that.overlayId).css('height', $('body').height());
        $(that.overlayId + ' .contents').css('margin-top', $(window).scrollTop());
        $(that.overlayId).show();
    }
});

module.exports = PortfolioGalleryView;