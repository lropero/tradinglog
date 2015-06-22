(function() {
	'use strict';

	app.debug = {
		start: function(name) {
			var timer = {
				name: name,
				time: (new Date()).getTime(),

				stop: function() {
					var now = (new Date()).getTime();
					console.log(this.name + ': ' + (now - this.time));
				}
			}
			return timer;
		}
	}
})();
