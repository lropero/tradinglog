var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		var width = $('.splash').width();
		var height = $('.splash').height();
		alert(width + 'x' + height);
	}
};
