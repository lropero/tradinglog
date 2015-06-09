(function() {
	'use strict';

	app.Views.noInternet = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('no-internet'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'no-internet');
			this.$el.html(this.template());
			return this;
		}
	});
})();
