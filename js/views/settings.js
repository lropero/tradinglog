(function() {
	'use strict';

	app.Views.settings = Backbone.View.extend({
		el: 'section#settings',
		events: {
			'tap control.segmented li:not(.active)': 'switch'
		},

		initialize: function() {
			var self = this;
			app.templateLoader.get('settings').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		destroy: function() {
			if(typeof this.subview.destroy === 'function') {
				this.subview.destroy();
			}
			this.undelegateEvents();
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
			var $target = $(e.currentTarget);
			var section = $target.data('section');
			this.$el.find('li.active').removeClass('active');
			$target.addClass('active');
			if(typeof this.subview.destroy === 'function') {
				this.subview.destroy();
			}
			this.subview = new app.Views['settings' + section]();
		}
	});
})();
