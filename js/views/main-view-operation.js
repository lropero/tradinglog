(function() {
	'use strict';

	app.Views.mainViewOperation = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(key) {
			var self = this;
			this.key = key;
			this.operation = app.objects[key];
			this.template = Handlebars.compile(app.templateLoader.get('main-view-operation'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'main-view-operation', {
				key: this.key.toString()
			});
			this.$el.html(this.template({
				operation: this.operation
			}));
			return this;
		}
	});
})();
