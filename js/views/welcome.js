(function() {
	'use strict';

	app.Views.welcome = Backbone.View.extend({
		el: 'div#layout',

		initialize: function() {
			var self = this;
			app.templateLoader.get('welcome').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			var self = this;
			this.$el.html(this.template());
			return this;
		},
	});
})();
