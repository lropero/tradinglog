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
			console.log(HOST + "/api/v.1/users/" + uid[1]);
			jQuery.get(HOST + "/api/v.1/users/" + uid[1], function (data) {
				var userData = data[0];
				var user = new app.Models.user();
				user.set({
					mongo_id: userData._id,
					name: userData.name,
					screen_name: userData.screen_name,
					picture: userData.profile_image,
					location: "",
					device: window.device.uuid
				});
				console.log(user.toJSON());
				user.save(null, {
					success: function (model, insertId) {
						console.log("user " + insertId + " inserted");
						app.loadView('friendsProfile', {
							key: insertId
						});
					}
				});
			});
		}
	});
})();
