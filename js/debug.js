(function() {
	'use strict';

	app.debug = {
		start: function() {
			var timer = {
				time: (new Date()).getTime(),

				stop: function(message) {
					var now = (new Date()).getTime();
					console.log(message + ': ' + (now - this.time));
				}
			}
			return timer;
		}
	}
})();
