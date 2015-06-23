(function() {
	'use strict';

	app.headerNavigation = {
		update: function(options) {
			var self = this;
			setTimeout(function() {
				self.remove('left');
				self.remove('right');
				if(options['left']) {
					self.set('left', options['left']);
				}
				if(options['right']) {
					self.set('right', options['right']);
				}
			}, 10);
		},

		set: function(button, options) {
			var $button = $('header #button-' + button);
			if(options.icon) {
				$button.attr('data-icon', String.fromCharCode(parseInt(options.icon, 16))).addClass('icon');
				$button.css('bottom', '-2px');
			} else {
				$button.removeClass('icon');
				$button.css('bottom', '0');
			}
			if(options.text) {
				$button.html(options.text);
			} else {
				$button.html('');
				$button.css('bottom', '-1px');
			}
			if(options.rotate) {
				$button.addClass('rotate');
			} else {
				$button.removeClass('rotate');
			}
			if(options.action) {
				$button.off().on('touchend', function(e) {
					e.preventDefault();
					options.action();
				});
			} else if(options.view) {
				$button.off().on('touchend', function(e) {
					e.preventDefault();
					app.loadView(options.view);
				});
			}
			$button.show();
			if(typeof options.animate === 'boolean') {
				var animated = 'animated rubberBand';
				$button.addClass(animated).one('webkitAnimationEnd', function() {
					$button.removeClass(animated);
				});
			} else if(typeof options.loading === 'boolean') {
				$button.addClass('loading');
			}
		},

		remove: function(button) {
			var remove = 'animated loading rubberBand';
			$('header #button-' + button).off().hide().removeClass(remove);
		}
	};
})();
