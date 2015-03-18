(function() {
	'use strict';

	app.Views._agustin = Backbone.View.extend({
		el: 'section#main-stats-friends',
		initialize: function() {
			var self = this;
			app.templateLoader.get('_agustin').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},
		render: function() {
			app.trigger('change', '_agustin');
			this.$el.html(this.template());
			return this;
		}
	});
})();
