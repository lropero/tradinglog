(function() {
	'use strict';

	app.Views.settingsAddAccount = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('settings-add-account', function(template) {
				self.template = _.template(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				'left': {
					'icon': 'f124',
					'text': 'Cancel',
					'view': 'settings',
					'subview': 'Accounts'
				},
				'right': {
					'text': 'Add',
					'view': 'settings',
					'subview': 'Accounts'
				}
			});
			this.$el.html(this.template());
			$('#settings #content').empty().append(this.$el);
			return this;
		}
	});
})();
