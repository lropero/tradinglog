var app = {
	deviceReady: function() {
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
				this.$tab.on('click', 'a', function() {
					self.$tab.find('a').removeClass('active');
					$(this).addClass('active');
					app.router.navigate($(this).data('route'), {trigger: true});
				});
			}
		};

		var navigationController = new NavigationController();
		Backbone.history.start();
	}
};

$(function() {
	if(document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1) {
		document.addEventListener('deviceready', app.deviceReady, false);
		window.addEventListener('load', function() {
			new FastClick(document.body);
		}, false);
	} else {
		app.deviceReady();
	}
});
