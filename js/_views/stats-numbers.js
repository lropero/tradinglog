(function() {
	'use strict';

	app.Views.statsNumbersView = Backbone.View.extend({
		el: '#content',
		initialize: function() {
			var self = this;
			$.get('js/_templates/stats-numbers.tpl', function(template) {
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
