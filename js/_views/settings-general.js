(function() {
	'use strict';

	app.Views.settingsGeneral = Backbone.View.extend({
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('settings-general', function(template) {
				self.template = Handlebars.compile(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update();
			this.$el.html(this.template());
			$('#settings #content').empty().append(this.$el);
			this.shake();
			return this;
		},
		shake: function() {
			var shake = new Shake({
				frequency: 300,
				threshold: 50,
				waitBetweenShakes: 1000,
				success: function(magnitude, accelerationDelta, timestamp) {
					$('#settings #content').append('SI!');
					shake.stopWatch();
					// new app.Views['friends']();
				},
				failure: function() {
					// new app.Views['stats']();
				}
			});
			shake.startWatch();
		}
	});
})();
