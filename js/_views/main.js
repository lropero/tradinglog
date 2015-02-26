(function() {
	'use strict';

	app.Views.mainView = Backbone.View.extend({
		el: '#main-stats-friends',
		initialize: function() {
			var self = this;
			$.get('js/_templates/main.tpl', function(template) {
				self.template = _.template($(template).html().trim());
				self.render();
			});
		},
		render: function() {
			this.$el.html(this.template());
			return this;
		}
	});
})();
