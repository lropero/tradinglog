(function() {
	'use strict';

	app.Views.settingsView = Backbone.View.extend({
		initialize: function() {
			var self = this;
			$.get('js/_templates/settings-template.html', function(template) {
				self.template = _.template($(template).html().trim());
				self.render();
			});
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
})();
