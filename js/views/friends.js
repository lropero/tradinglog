(function() {
	'use strict';

	var HOST = "http://45.55.194.21:3000";

	app.Views.friends = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			"click #twitter-connect" : "twConnect"
		},

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('friends'));
			this.render();
		},

		render: function() {
			app.trigger('change', 'friends');
			this.$el.html(this.template());
			return this;
		},

		twConnect: function () {
			var self = this;
			this.authWindow = window.open(HOST + '/api/v.1/auth/twitter', '_blank', 'location=yes');
			this.bindWindowEvents();
		},

		bindWindowEvents: function () {
			var self = this;
			jQuery(self.authWindow).on('loadstart', function(e) {
				var url = e.originalEvent.url;
				var uid = /\?uid=(.+)$/.exec(url);
				var error = /\?error=(.+)$/.exec(url);

				console.log(url);
				console.log(uid);

				if (uid || error) {
					self.authWindow.close();
					if (uid)
						self.persistUser(uid);
				}
			});
		},

		persistUser: function (uid) {
			jQuery.get(HOST + "/api/v.1/users/" + uid[1], function (data) {
				var userData = data[0];
				var user = new app.Models.user();
				user.set(userData);
				user.set("device", window.device.uuid);
				
			});
		}
	});
})();
