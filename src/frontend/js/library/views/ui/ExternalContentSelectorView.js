var ExternalContentSelectorView = Backbone.View.extend({
    contentSource: null,
    contentTarget: null,
    urls: {
        'flickr' : '/flickr?method=flickr.people.getPhotos'
    },
    initialize: function(options) {
        var that = this;
        this.contentSource = options.contentSource;
        this.contentTarget = options.contentTarget;
        $(this.el).click(function(){
            that.load();
        });
    },
    load: function() {
        var that = this;
        $('#modal').find('.modal-title').html('Select from ' + that.contentSource);
        $('#modal').find('.modal-body').html('Loading ...');
        $('#modal').modal('show');

        $.ajax({
            method: 'GET',
            url: '/api/external-content-source' + that.urls[that.contentSource]
        })
        .success(function(data){
            $('#modal').find('.modal-body').html('');
            var card = _.template($('#' + that.contentSource + 'Card').html());
            $.each(data, function(i,d){
                $('#modal').find('.modal-body').append(card({'p':d}));
            });
            that.render();
        })
        .error(function(data){
            console.log(data);
        });
    },
    render: function() {
        var that = this;
        var $el = $('#modal').find('.modal-body');

        var firstCard = $el.find('.card:first-child');
        var rowCount = Math.floor($el.width() / $(firstCard).outerWidth());
        $el.children('.card-row-divider').remove();
        $el.children('.card').each(function(i,e){
            $(e).click(function(){
                $('#' + that.contentTarget).val($(this).data('content'));
                $('#modal').modal('hide');
            });
            if (((i + 1) % rowCount) == 0) {
                $('<div class="card-row-divider"></div>').insertAfter($(e));
            }
        });
    }
});

module.exports = ExternalContentSelectorView;
