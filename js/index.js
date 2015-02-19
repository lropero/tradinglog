var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		StatusBar.overlaysWebView(false);
		StatusBar.backgroundColorByHexString('#ff0000');
		StatusBar.styleLightContent();
	}
};
