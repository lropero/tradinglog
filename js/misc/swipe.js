(function() {
	'use strict';

	app.swipe = {
		init: function(selector) {
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
				cssEaseDuration: 300,
				shouldPreventDefault: false,
				startThreshold: [30, 20],
				useCSSTranslation: false,

				rest: function() {
					var $el = $(this.el);
					if($el.position().left % 80 > 0) {
						$.pep.restore();
					}
					$('section#content').css('-webkit-overflow-scrolling', 'touch');
					$('section#content').css('overflow-y', 'scroll');
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
					$('section#content').css('-webkit-overflow-scrolling', 'auto');
					$('section#content').css('overflow-y', 'hidden');
					var $el = $(this.el);
					if($el.hasClass('swiped')) {
						$el.removeClass('swiped');
					}
					$.pep.restore();
				},

				stop: function(e) {
					e.preventDefault();
				}
			});
		}
	};
})();
