var app = {
	deviceReady: function() {
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
