(function() {
	'use strict';

	app.Views.friends = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function() {
			var self = this;
			this.template = app.templateLoader.get('friends');
			this.template = Handlebars.compile(this.template);
			this.render();
		},

		render: function() {
			app.trigger('change', 'friends');
			this.$el.html(this.template());
			return this;
		}
	});
})();
