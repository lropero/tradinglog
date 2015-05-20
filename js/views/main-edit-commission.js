(function() {
	'use strict';

	app.Views.mainEditCommission = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(key) {
			this.key = key;
			this.template = Handlebars.compile(app.templateLoader.get('main-edit-commission'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'main-edit-commission', {
				key: this.key
			});
			this.$el.html(this.template());
			return this;
		}
	});
})();
