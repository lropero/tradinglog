(function() {
	'use strict';

	app.swipe = {
		init: function(selector) {

			/** Support all widths */
			var width = $(document).width();
			$(selector).each(function() {
				var $wrapper = $(this).parents('.wrapper-label');
				var swipe = $wrapper.data('swipe');
				$wrapper.css('left', (swipe * -80) + 'px');
				$wrapper.css('width', width + (swipe * 80) + 'px');
				$(this).css('left', (swipe * 80) + 'px');
				$(this).css('width', width + 'px');
				$(this).next().css('width', width + 'px');
			});

			$(selector).pep({
				axis: 'x',
				constrainTo: 'parent',
				cssEaseDuration: 250,
				shouldPreventDefault: false,
				startThreshold: [30, 20],
				useCSSTranslation: false,

				rest: function() {
					var $el = $(this.el);
					var left = $el.position().left;
					if(left > 0 && left < parseInt(this.offset.left, 10)) {
						$.pep.restore();
						if(app.timeout) {
							clearTimeout(app.timeout);
						}
						app.timeout = setTimeout(function() {
							app.enableScroll();
						}, 500);
					} else if($el.position().left > 0) {
						if($el.hasClass('swiped')) {
							$el.removeClass('swiped');
							if(app.timeout) {
								clearTimeout(app.timeout);
							}
							app.enableScroll();
						}
					} else {
						if(app.timeout) {
							clearTimeout(app.timeout);
						}
					}
				},

				revertIf: function() {
					var $el = $(this.el);
					if($el.position().left > 0) {
						return true;
					}
					$el.addClass('swiped');
					return false;
				},

				start: function() {
					app.disableScroll();
					if(app.timeout) {
						clearTimeout(app.timeout);
					}
					var $el = $(this.el);
					if(!$el.hasClass('swiped')) {
						$.pep.restore();
					}
				},

				stop: function(e) {
					e.preventDefault();
					var $el = $(this.el);
					var left = $el.position().left;
					if(left < parseInt(this.offset.left, 10)) {
						app.disableScroll();
					}
				}
			});
		}
	};
})();
