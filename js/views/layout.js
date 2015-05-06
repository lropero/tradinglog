(function() {
	'use strict';

	app.Views.layout = Backbone.View.extend({
		el: 'div#layout',

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.templateLoader.loadTemplates(function () {
				self.template = app.templateLoader.get('layout');
				self.template = Handlebars.compile(self.template);
				self.render();
			});
		},

		render: function() {
			var self = this;
			this.$el.html(this.template());
			$.when(
				new app.Views.header().deferred,
				new app.Views.footer().deferred
			).done(function() {
				self.deferred.resolve();
			})
			return this;
		},
	});
})();
