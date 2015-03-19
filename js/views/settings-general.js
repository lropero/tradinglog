(function() {
	'use strict';

	app.Views.settingsGeneral = Backbone.View.extend({
		el: 'section#settings section#content',

		initialize: function() {
			var self = this;
			app.templateLoader.get('settings-general').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			app.trigger('change', 'settings-general');
			this.$el.html(this.template());
			if(navigator.accelerometer) {
				this.shake();
			}
			return this;
		},

		shake: function() {
			app.shake = new Shake({
				frequency: 100,
				threshold: 30,
				success: function(magnitude, accelerationDelta, timestamp) {
					app.trigger('change', 'easter');
					$('section#settings section#content').empty().append('<img src="img/easter.jpg" style="height: 100%; width: 100%;" />');
				}
			});
			app.shake.startWatch();
		}
	});
})();
