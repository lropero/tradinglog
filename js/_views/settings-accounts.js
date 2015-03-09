(function() {
	'use strict';

	app.Views.settingsAccounts = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('settings-accounts', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				right: {
					icon: 'f218',
					view: 'settingsAddAccount'
				}
			});
			this.$el.html(this.template());
			$('#settings #content').empty().append(this.$el);
			return this;
		}
	});
})();
