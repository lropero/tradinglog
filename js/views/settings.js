(function() {
	'use strict';

	app.Views.settings = Backbone.View.extend({
		el: 'section#settings',
		events: {
			'touchend li:not(.active)': 'switch'
		},

		initialize: function() {
			var self = this;
			app.templateLoader.get('settings').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'settings');
			this.$el.html(this.template({
				section: 'instruments'
			}));
			new app.Views.settingsInstruments();
			return this;
		},

		switch: function(e) {
			this.$el.find('li.active').removeClass('active');
			var target = $(e.currentTarget);
			target.addClass('active');
			var section = target.data('section');
			new app.Views['settings' + section]();
		}
	});
})();
