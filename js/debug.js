(function() {
	'use strict';

	app.debug = {
		start: function() {
			return (new Date()).getTime();
		},

		stop: function(timer, message) {
			var now = (new Date()).getTime();
			console.log(message + ': ' + (now - timer));
		}
	}
})();
