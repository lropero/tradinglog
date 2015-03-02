(function() {
	'use strict';

	app.Views.settingsGeneral = Backbone.View.extend({
		el: '#settings #content',
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('settings-general', function(template) {
				self.template = _.template(template);
				self.render();
			});
		},
		render: function() {
			app.Helpers.headerNavigation.update();
			this.$el.html(this.template());
			return this;
		}
	});
})();
