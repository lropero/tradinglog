(function() {
	'use strict';

	app.Views.settingsAccounts = Backbone.View.extend({
		el: 'section#settings section#content',

		initialize: function() {
			var self = this;
			app.templateLoader.get('settings-accounts').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			app.trigger('change', 'settings-accounts');
			this.$el.html(this.template());
			return this;
		}
	});
})();
