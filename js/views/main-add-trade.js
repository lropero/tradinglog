(function() {
	'use strict';

	app.Views.mainAddTrade = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',

		initialize: function() {
			var self = this;
			app.templateLoader.get('main-add-trade').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		render: function() {
			app.trigger('change', 'main-add-trade');
			this.$el.html(this.template());
			return this;
		}
	});
})();
