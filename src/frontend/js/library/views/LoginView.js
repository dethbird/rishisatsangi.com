var LoginView = Backbone.View.extend({
    loginUrl: '/login',
    initialize: function(options) {
        var that = this;
        $(this.el).find('form').on('submit', function(e){
          e.preventDefault();
          that.login($('#username').val(), $('#password').val());
        });
        this.render();
    },
    login: function(username, password) {
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
        $.each($('#loginForm form').children(), function(i,e) {
          TweenLite.to($(e), 2, {
              rotation: -15 + Math.random() * 30,
              ease: Elastic.easeOut.config(1, 0.25)
          });
        });
        TweenLite.to($('#loginForm .form-signin'), 2, {
            backgroundColor: "#DE3A3A",
            ease: Elastic.easeOut.config(1, 0.25)
        });
      });
    }
});

module.exports = LoginView;
