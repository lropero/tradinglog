(function() {
	'use strict';

	app.Views.friends = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div.twitter': 'twitter'
		},

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('friends'));
			this.render();
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'friends');
			this.$el.html(this.template());
			return this;
		},

		twitter: function() {
			var self = this;
			if(typeof OAuth !== 'undefined') {
				OAuth.popup('twitter', {
					cache: true
				}).done(function(result) {
					result.me().done(function(response) {
						self.$el.html(typeof response);
						self.$el.append('<br />');
						self.$el.append(response.toString());
					});
				});
			}
		}
	});
})();
