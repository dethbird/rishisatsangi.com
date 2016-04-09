var CardView = Backbone.View.extend({
    model: null,
    initialize: function(options) {
        var that = this;
        this.model = options.model;

        // click thumbnails to select preview
        $(this.el).find('thumbnail').click(function(e){
            // active states of thumbnails
            $(that.el).find('thumbnail').removeClass('active');
            $(e.currentTarget).addClass('active');

            var thumbnailImage =  $(e.currentTarget).find('img');
            var previewImage = $(that.el).find('preview img');
            previewImage.removeClass('portrait').removeClass('landscape');
            previewImage.attr('src', thumbnailImage.attr('src'));
            previewImage.attr('data-image-index', thumbnailImage.attr('data-image-index'));
            previewImage.addClass(
              that.model.get('images')[thumbnailImage.attr('data-image-index')].orientation
            );
        });

        // click preview to open full size
        $(this.el).find('preview.overlay-trigger').click(function(e){
          var imageIndex = $(e.target).attr('data-image-index');
          var image = that.model.get('images')[imageIndex];

          $('body overlay content').html('<img src="' + image.display + '" class="' + image.orientation + '" />');
          $('body overlay content').css('margin-top', $(window).scrollTop());
          $('body overlay').show();
        });

        // hide overlay on escape
        $(document).keydown(function(e) {
            // ESCAPE key pressed
            if (e.keyCode == 27) {
                 $('body overlay').hide();
            }
        });
        this.render();
    }
});

module.exports = CardView;
