(function() {
	'use strict';

	app.Views.settingsInstruments = Backbone.View.extend({
		el: '#settings #content',
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('settings-instruments', function(template) {
				self.template = _.template(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update({
				'right': {
					'icon': 'f218',
					'text': '',
					'view': ''
				}
			});
			this.$el.html(this.template());
			return this;
		}
	});
})();
