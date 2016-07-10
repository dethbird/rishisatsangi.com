var BaseFormView = require('./BaseFormView');
var ProjectUserFormView = BaseFormView.extend({
    baseUrl: '/api/project_user'
});

module.exports = ProjectUserFormView;
