var app = {
	initialize: function() {
		this.bindEvents();
	},
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	onDeviceReady: function() {
		StatusBar.styleLightContent();
		StatusBar.backgroundColorByHexString("#4020d0");
	}
};
