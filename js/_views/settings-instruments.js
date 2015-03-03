(function() {
	'use strict';

	app.Views.settingsInstruments = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('settings-instruments', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				'right': {
					'icon': 'f218',
					'view': 'settingsAddInstrument'
				}
			});
			this.$el.html(this.template());
			$('#settings #content').empty().append(this.$el);
			return this;
		}
	});
})();
