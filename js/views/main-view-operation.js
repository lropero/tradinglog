(function() {
	'use strict';

	app.Views.mainViewOperation = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function(attrs) {
			var self = this;
			this.operation = new app.Models.operation({
				id: attrs.id
			});
			this.operation.fetch({
				success: function() {
					app.templateLoader.get('main-view-operation').done(function(template) {
						self.template = Handlebars.compile($(template).html().trim());
						self.render();
					});
				}
			})
		},

		render: function() {
			app.trigger('change', 'main-view-operation');
			this.$el.html(this.template({
				description: this.operation.get('description')
			}));
			return this;
		}
	});
})();
