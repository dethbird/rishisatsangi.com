var LoginFormView = Backbone.View.extend({
    loginUrl: '/api/login',
    initialize: function(options) {
        var that = this;
        $(this.el).on('submit', function(e){
            e.preventDefault();
            that.login($('#username').val(), $('#password').val());
        });
    },
    login: function(username, password) {
        var that = this;
        $.ajax({
            method: 'POST',
            url: this.loginUrl,
            data: {
                username: username,
                password: password
            }
        })
        .success(function(data){
            document.location = data.redirectTo;
        })
        .error(function(data){
            var $el = $(that.el);
            $.each($el.children(), function(i,e) {
                TweenLite.to($(e), 2, {
                    rotation: -15 + Math.random() * 30,
                    ease: Elastic.easeOut.config(1, 0.25)
                });
            });
            TweenLite.to($el, 2, {
                backgroundColor: "#500b0b",
                ease: Elastic.easeOut.config(1, 0.25)
            });
        });
    }
});

module.exports = LoginFormView;
