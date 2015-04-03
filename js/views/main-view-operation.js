(function() {
	'use strict';

	app.Views.mainViewOperation = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(attrs) {
			var self = this;
			this.operation = attrs.operation;
			app.templateLoader.get('main-view-operation').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
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
