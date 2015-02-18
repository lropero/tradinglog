var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		setTimeout(function() {
			console.log(navigator);
			navigator.splashscreen.hide();
			// this.start();
		}, 5000);
	}
	// start: function() {
	// 	var width = $('.splash').width();
	// 	var height = $('.splash').height();
	// 	app.html(width + 'x' + height);
	// }
};
