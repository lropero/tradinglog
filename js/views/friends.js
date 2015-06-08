(function() {
	'use strict';

	app.Views.friends = Backbone.View.extend({
		el: 'section#main-stats-friends',

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('friends'));
			this.render();
		},

		render: function() {
			var self = this;
			if(typeof networkinterface !== 'undefined') {
				networkinterface.getIPAddress(function(ip) {
					if(!app.user) {
						app.loadView('friendsConnect');
					} else {
						app.trigger('change', 'friends');
						self.$el.html(self.template({
							alias: app.user.alias,
							avatar: app.user.avatar,
							name: app.user.name
						}));
					}
				}, function() {
					app.loadView('friendsNoConnection');
				});
			} else {
				app.loadView('friendsNoConnection');
			}
			return this;
		}
	});
})();
