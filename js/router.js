(function() {
	'use strict';

	var Router = Backbone.Router.extend({
		routes: {
			'main'    : 'main',
			'stats'   : 'stats',
			'friends' : 'friends',
			'settings': 'settings'
		},
		main: function() {
			// console.log('main');
		},
		stats: function() {
			// console.log('stats');
		},
		friends: function() {
			// this.view = new app.Views.friendsView({
			// 	el: '#content'
			// });
			// this.view.render();
		},
		settings: function() {
			// console.log('settings');
		}
	});

	app.router = new Router();

	var $app = $('.app');

	var NavigationController = function() {
		this.$tab = $app.find('footer bar.tab');
		this.init();
	};

	NavigationController.prototype = {
		init: function() {
			this.bindEvents();
			_.extend(this, Backbone.Events);
		},
		bindEvents: function() {
			var self = this;
			this.$tab.on('click', 'a:not(.active)', function() {
				self.$tab.find('a.active').removeClass('active');
				$(this).addClass('active');
				app.router.navigate($(this).data('route'), {trigger: true});
			});
		}
	};

	app.on('started', function() {
		var navigationController = new NavigationController();
		// app.router.navigate('friends', {trigger: true});
	});
})();
