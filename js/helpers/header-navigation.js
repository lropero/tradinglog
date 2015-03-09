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
			if(typeof options.icon === 'undefined') {
				button.removeClass('icon');
			} else {
				button.attr('data-icon', String.fromCharCode(parseInt(options.icon, 16))).addClass('icon');
			}
			if(typeof options.text === 'undefined') {
				button.html('');
			} else {
				button.html(options.text);
			}
			button.off().on('click', function() {
				if(typeof options.subview === 'undefined') {
					app.loadView(options.view);
				} else {
					app.loadView(options.view, options.subview);
				}
			});
			button.show();
		},
		remove: function(button) {
			$('#button-' + button).off().hide();
		}
	};
})();
