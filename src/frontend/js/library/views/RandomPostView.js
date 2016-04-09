var RandomPostView = Backbone.View.extend({
    randomPosts: null,
    events: {
        "click a#random-post-button": "randomPost"
    },
    initialize: function(options) {
        var that = this;
        this.randomPosts = this.$('.random-post');
        // console.log(this.randomPosts);
        // this.randomPosts = $(this.el + ' .random-post');
        // console.log(this.randomPosts);
        // console.log(this.randomPosts[0]);
        $(this.randomPosts[0]).show();
    },
    randomPost: function() {
        $(this.randomPosts).hide();
        var index = Math.floor(Math.random() * this.randomPosts.length);
        $(this.randomPosts[index]).fadeIn(1000);
    }
});

module.exports = RandomPostView;