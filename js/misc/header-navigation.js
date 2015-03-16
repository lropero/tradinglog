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
			if(!options.icon) {
				button.removeClass('icon');
			} else {
				button.attr('data-icon', String.fromCharCode(parseInt(options.icon, 16))).addClass('icon');
			}
			if(!options.text) {
				button.html('');
			} else {
				button.html(options.text);
			}
			if(options.view) {
				button.off().on('click', function() {
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
