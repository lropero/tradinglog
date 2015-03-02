(function() {
	'use strict';

	app.Helpers.headerNavigation = {
		update: function(options) {
			if(typeof options === 'undefined') {
				this.remove('left');
				this.remove('right');
			} else {
				if(typeof options['left'] === 'undefined') {
					this.remove('left');
				} else {
					this.set('left', options['left']);
				}
				if(typeof options['right'] === 'undefined') {
					this.remove('right');
				} else {
					this.set('right', options['right']);
				}
			}
		},
		set: function(button, options) {
			var button = $('#button-' + button);
			if(options.icon.length) {
				button.attr('data-icon', String.fromCharCode(parseInt(options.icon, 16)));
				button.addClass('icon');
			} else {
				button.removeClass('icon');
			}
			button.html(options.text);
			button.attr('data-view', options.view);
			button.show();
		},
		remove: function(button) {
			var button = $('#button-' + button);
			button.hide();
		}
	};
})();
