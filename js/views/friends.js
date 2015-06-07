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
				OAuth.popup('twitter').done(function(result) {
					self.$el.html(result);
				});
			}
		}
	});
})();
