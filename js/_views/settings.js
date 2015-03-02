(function() {
	'use strict';

	app.Views.settings = Backbone.View.extend({
		el: '#settings',
		events: {
			'click li:not(.active)': 'switch'
		},
		initialize: function() {
			var self = this;
			app.Helpers.templateLoader.get('settings', function(template) {
				self.template = _.template(template);
				self.render();
			});
		},
		render: function() {
			this.$el.html(this.template());
			this.content = new app.Views.settingsInstruments();
			return this;
		},
		switch: function(e) {
			this.$el.find('li.active').removeClass('active');
			var target = $(e.currentTarget);
			target.addClass('active');
			var subview = target.data('subview');
			this.content = new app.Views['settings' + subview]();
		}
	});
})();
