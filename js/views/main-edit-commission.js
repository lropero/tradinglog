(function() {
	'use strict';

	app.Views.mainEditCommission = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(attrs) {
			this.key = attrs.key;
			this.top = attrs.top;
			this.template = Handlebars.compile(app.templateLoader.get('main-edit-commission'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'main-edit-commission', {
				key: this.key,
				top: this.top
			});
			this.$el.html(this.template());
			return this;
		}
	});
})();
