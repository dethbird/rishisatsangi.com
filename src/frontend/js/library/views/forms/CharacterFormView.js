var BaseFormView = require('./BaseFormView');
var CharacterFormView = BaseFormView.extend({
    baseUrl: '/api/project_character'
});

module.exports = CharacterFormView;
