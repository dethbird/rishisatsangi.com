var CharacterCollection = require('../collections/projects/CharacterCollection');
var CardView = require('./CardView');

var ProjectView = Backbone.View.extend({
    characterCollection: null,
    conceptArtCollection: null,
    initialize: function(options) {
        var that = this;

        this.characterCollection = new CharacterCollection();
        $.each(options.configs.characters.list, function(i,character){
          character = new Backbone.Model(character);
          that.characterCollection.add(character);
          var card = new  CardView({
              el: '#' + character.get('id'),
              model: character
          });
        });

        this.conceptArtCollection = new Backbone.Collection();
        $.each(options.configs.concept_art.list, function(i,item){
          item = new Backbone.Model(item);
          that.conceptArtCollection.add(item);
          console.log(item);
          var card = new CardView({
              el: '#' + item.get('id'),
              model: item
          });
        });

        $('#project').on('change', function(e){
          document.location = '/projects/' + $(e.currentTarget).find('option:selected').val();
        });

        $('body overlay content').click(function(){
          $('body overlay').hide();
        })
    }
});

module.exports = ProjectView;
