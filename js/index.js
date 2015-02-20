var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		var $app = $('.app');

		var NavigationController = function() {
			this.$main = $app.find('footer bar');
			this.$headerNav = $app.find('header');
			this.init();
		};

		NavigationController.prototype = {
			init: function() {
				this.bindEvents();
				_.extend(this, Backbone.Events);
			},
			removeActive: function() {
				this.$main.find('a').removeClass('active');
			},
			bindEvents: function() {
				var self = this;
				this.$main.on('click', 'a', function() {
					self.removeActive();
					jQuery(this).addClass('active');
					app.router.navigate($(this).data('route'), {trigger: true});
				});
			}
		};

		var navController = new NavigationController();

		Backbone.history.start();
	}
};
