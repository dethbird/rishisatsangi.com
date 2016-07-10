var BaseFormView = require('./BaseFormView');
var CharacterRevisionFormView = BaseFormView.extend({
    baseUrl: '/api/project_character_revision'
});

module.exports = CharacterRevisionFormView;
