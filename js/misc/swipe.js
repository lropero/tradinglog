(function() {
	'use strict';

	app.swipe = {
		init: function(selector) {
			$(selector).pep({
				axis: 'x',
				constrainTo: 'parent',
				cssEaseDuration: 500,
				shouldPreventDefault: false,
				startThreshold: [30, 20],
				useCSSTranslation: false,

				rest: function() {
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
					// $.pep.restore();
				},

				// stop: function(e) {
				// 	e.preventDefault();
				// }
			});
		}
	};
})();
