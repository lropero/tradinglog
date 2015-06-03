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
			var $button = $('header #button-' + button);
			var remove = 'animated loading rubberBand';
			$button.removeClass(remove);
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
			if(typeof options.loading === 'boolean') {
				$button.addClass('loading');
			}
			$button.show();
			if(typeof options.animate === 'boolean') {
				var animated = 'animated rubberBand';
				$button.addClass(animated).one('webkitAnimationEnd', function() {
					$button.removeClass(animated);
				});
			}
		},

		remove: function($button) {
			$('header #button-' + $button).off().hide();
		}
	};
})();
