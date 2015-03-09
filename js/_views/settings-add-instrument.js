(function() {
	'use strict';

	app.Views.settingsAddInstrument = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('settings-add-instrument', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				left: {
					icon: 'f124',
					text: 'Cancel',
					view: 'settings',
					subview: 'Instruments'
				},
				right: {
					text: 'Add',
					view: 'settings',
					subview: 'Instruments'
				}
			});
			this.$el.html(this.template());
			$('#settings #content').empty().append(this.$el);
			return this;
		}
	});
})();
