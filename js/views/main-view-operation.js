(function() {
	'use strict';

	app.Views.mainViewOperation = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(attrs) {
			var self = this;
			this.key = attrs.key.toString();
			this.top = attrs.top;
			this.operation = app.objects[this.key];
			this.template = Handlebars.compile(app.templateLoader.get('main-view-operation'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'main-view-operation', {
				key: this.key,
				top: this.top
			});
			this.$el.html(this.template({
				operation: this.operation
			}));
			return this;
		}
	});
})();
