(function() {
	'use strict';

	app.Views.settingsView = Backbone.View.extend({
		el: '#settings',
		events: {
			'click li:not(.active)': 'switch'
		},
		initialize: function() {
			var self = this;
			$.get('js/_templates/settings.tpl', function(template) {
				self.template = _.template($(template).html().trim());
				self.render();
			});
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		},
		switch: function(e) {
			this.$el.find('li.active').removeClass('active');
			$(e.currentTarget).addClass('active');
			var route = $(e.currentTarget).data('route');
		}
	});
})();
