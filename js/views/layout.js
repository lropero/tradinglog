(function() {
	'use strict';

	app.Views.layout = Backbone.View.extend({
		el: 'div#layout',
		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.templateLoader.get('layout').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},
		render: function() {
			var self = this;
			this.$el.html(this.template());
			$.when(
				new app.Views.header().deferred.promise(),
				new app.Views.footer().deferred.promise()
			).done(function() {
				self.deferred.resolve();
			})
			return this;
		},
	});
})();
