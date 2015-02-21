(function() {
	'use strict';

	var Router = Backbone.Router.extend({
		routes: {
			''        : 'main',
			'/'       : 'main',
			'main'    : 'main',
			'stats'   : 'stats',
			'friends' : 'friends',
			'settings': 'settings'
		},
		main: function() {
			this.view = new app.Views.mainView({
				el: '#content'
			});
		},
		stats: function() {
			this.view = new app.Views.statsView({
				el: '#content'
			});
		},
		friends: function() {
			this.view = new app.Views.friendsView({
				el: '#content'
			});
		},
		settings: function() {
			this.view = new app.Views.settingsView({
				el: '#settings'
			});
		}
	});

	app.router = new Router();

	var NavigationController = function() {
		this.$tab = $('.app').find('footer bar.tab');
		this.initialize();
	};

	NavigationController.prototype = {
		initialize: function() {
			this.bindEvents();
			_.extend(this, Backbone.Events);
		},
		bindEvents: function() {
			var self = this;
			this.$tab.on('click', 'a:not(.active)', function() {
				if(self.running) {
					return;
				}
				self.$tab.find('a.active').removeClass('active');
				$(this).addClass('active');
				var route = $(this).data('route');

				// Trigger/untrigger settings pane
				var $settings = $('.app').find('div#settings');
				if(route === 'settings') {
					self.running = true;
					var animated = 'animated bounceInDown';
					$settings.addClass('show ' + animated).one('webkitAnimationEnd', function() {
						$settings.removeClass(animated);
						self.running = false;
					});
				} else if($settings.hasClass('show')) {
					self.running = true;
					var animated = 'animated bounceOutUp';
					$settings.addClass(animated).one('webkitAnimationEnd', function() {
						$settings.removeClass('show ' + animated);
						self.running = false;
					});
				}

				app.router.navigate(route, {trigger: true});
			});
		},
		running: false
	};

	window.navigationController = new NavigationController();
})();
