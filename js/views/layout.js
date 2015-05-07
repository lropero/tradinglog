(function() {
	'use strict';

	app.Views.layout = Backbone.View.extend({
		el: 'div#layout',

		initialize: function() {
			this.deferred = $.Deferred();
			this.template = Handlebars.compile(app.templateLoader.get('layout'));
			this.render();
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
