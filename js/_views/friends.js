(function() {
	'use strict';

	app.Views.friendsView = Backbone.View.extend({
		el: '#main-stats-friends',
		initialize: function() {
			var self = this;
			$.get('js/_templates/friends.tpl', function(template) {
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
