(function() {
	'use strict';

	app.Views.mainViewOperation = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(key) {
			this.operation = app.objects[key];
			this.template = app.templateLoader.get('main-view-operation');
			this.template = Handlebars.compile($(template).html().trim());
			this.render();
		},

		render: function() {
			app.trigger('change', 'main-view-operation');
			this.$el.html(this.template({
				operation: this.operation
			}));
			return this;
		}
	});
})();
