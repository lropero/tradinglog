(function() {
	'use strict';

	app.headerNavigation = {
		update: function(options) {
			if(!options['left']) {
				this.remove('left');
			} else {
				this.set('left', options['left']);
			}
			if(!options['right']) {
				this.remove('right');
			} else {
				this.set('right', options['right']);
			}
		},

		set: function(button, options) {
			var button = $('header #button-' + button);
			if(options.icon) {
				button.attr('data-icon', String.fromCharCode(parseInt(options.icon, 16))).addClass('icon');
			} else {
				button.removeClass('icon');
			}
			if(options.text) {
				button.html(options.text);
			} else {
				button.html('');
			}
			if(options.rotate) {
				button.addClass('rotate');
			} else {
				button.removeClass('rotate');
			}
			if(options.action) {
				button.off().on('touchend', function() {
					options.action();
				});
			} else if(options.view) {
				button.off().on('touchend', function() {
					app.loadView(options.view);
				});
			}
			button.show();
		},

		remove: function(button) {
			$('header #button-' + button).off().hide();
		}
	};
})();
