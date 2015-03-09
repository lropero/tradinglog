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
			app.loadView('main');
		},
		stats: function() {
			app.loadView('stats');
		},
		friends: function() {
			app.loadView('friends');
		},
		settings: function() {
			app.loadView('settings');
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
				if(self.animating) {
					return;
				}
				self.$tab.find('a.active').removeClass('active');
				$(this).addClass('active');
				var route = $(this).data('route');

				// Trigger/untrigger settings pane
				var $settings = $('.app').find('section#settings');
				if(route === 'settings') {
					self.animating = true;
					var animated = 'animated bounceInDown';
					$settings.addClass('show ' + animated).one('webkitAnimationEnd', function() {
						$settings.removeClass(animated);
						self.animating = false;
					});
				} else if($settings.hasClass('show')) {
					self.animating = true;
					var animated = 'animated bounceOutUp';
					$settings.addClass(animated).one('webkitAnimationEnd', function() {
						$settings.removeClass('show ' + animated);
						self.animating = false;
					});
				}

				app.router.navigate(route, {trigger: true});
			});
		},
		animating: false
	};

	window.navigationController = new NavigationController();
})();
