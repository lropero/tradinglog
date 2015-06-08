(function() {
	'use strict';

	app.Views.friendsConnect = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div.twitter': 'twitter'
		},

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('friends-connect'));
			this.render();
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'friends-connect');
			this.$el.html(this.template());
			return this;
		},

		twitter: function() {
			if(typeof OAuth !== 'undefined') {
				OAuth.initialize('_PATekA0POUmb4bhgncFMXoQsxE');
				OAuth.popup('twitter', {
					cache: true
				}).done(function(result) {
					result.me(['alias', 'avatar', 'name']).done(function(response) {
						$.ajax(avatar, {
							success: function(data) {
								var user = new app.Models.user();
								user.set({
									alias: alias,
									avatar: data,
									name: name,
									me: 1
								});
								user.save(null, {
									success: function() {
										app.user = {
											alias: alias,
											avatar: data,
											name: name
										}
										app.loadView('friends');
									}
								});
							}
						});
					});
				});
			}
		}
	});
})();
