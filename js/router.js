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
			this.view.render();
		},
		stats: function() {
			this.view = new app.Views.statsView({
				el: '#content'
			});
			this.view.render();
		},
		friends: function() {
			this.view = new app.Views.friendsView({
				el: '#content'
			});
			this.view.render();
		},
		settings: function() {
			this.view = new app.Views.settingsView({
				el: '#settings'
			});
			this.view.render();
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
				self.$tab.find('a.active').removeClass('active');
				$(this).addClass('active');
				var route = $(this).data('route');

				// Trigger/untrigger settings pane
				var $settings = $('.app').find('div#settings');
				if(route === 'settings') {
					var animated = 'animated bounceInDown';
					$settings.addClass('show ' + animated).one('webkitAnimationEnd', function() {
						$settings.removeClass(animated);
					});
				} else if($settings.hasClass('show')) {
					var animated = 'animated bounceOutUp';
					$settings.addClass(animated).one('webkitAnimationEnd', function() {
						$settings.removeClass('show ' + animated);
					});
				}

				app.router.navigate(route, {trigger: true});
			});
		}
	};

	window.navigationController = new NavigationController();
})();
