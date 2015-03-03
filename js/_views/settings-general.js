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
			return this;
		}
	});
})();
