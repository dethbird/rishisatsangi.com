var BaseFormView = require('./BaseFormView');
var LocationFormView = BaseFormView.extend({
    baseUrl: '/api/project_location'
});

module.exports = LocationFormView;
