(function() {
	'use strict';

	app.Views.settings = Backbone.View.extend({
		el: 'section#settings',
		events: {
			'tap li:not(.active)': 'switch'
		},

		initialize: function() {
			var self = this;
			app.templateLoader.get('settings').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		destroy: function(callback) {
			this.undelegateEvents();
			if(typeof this.subview.destroy === 'function') {
				this.subview.destroy(callback);
			} else {
				callback();
			}
		},

		render: function() {
			app.trigger('change', 'settings');
			this.$el.html(this.template({
				section: 'instruments'
			}));
			this.subview = new app.Views.settingsInstruments();
			return this;
		},

		switch: function(e) {
			e.preventDefault();
			this.$el.find('li.active').removeClass('active');
			var $target = $(e.currentTarget);
			$target.addClass('active');
			var section = $target.data('section');
			if(typeof this.subview.destroy === 'function') {
				this.subview.destroy();
			}
			this.subview = new app.Views['settings' + section]();
		}
	});
})();
