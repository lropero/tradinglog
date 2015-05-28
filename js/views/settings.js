(function() {
	'use strict';

	app.Views.settings = Backbone.View.extend({
		el: 'section#settings',
		events: {
			'tap control.segmented li:not(.active)': 'switch'
		},

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('settings'));
			this.render();
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
			$('control.segmented').find('li.active').removeClass('active');
			$target.addClass('active');
			if(typeof this.subview.destroy === 'function') {
				this.subview.destroy();
			}
			this.subview = new app.Views['settings' + section]();
		}
	});
})();
