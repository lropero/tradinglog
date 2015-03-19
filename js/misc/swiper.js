(function() {
	'use strict';

	app.swiper = {
		init: function(selector) {
			$(selector).pep({
				axis: 'x',
				constrainTo: 'parent',
				shouldPreventDefault: false,
				startThreshold: [30, 0],
				useCSSTranslation: false,
				initiate: function() {
					var $el = $(this.el);
					if($el.hasClass('swiped')) {
						$el.removeClass('swiped');
					}
					$.pep.restore();
				},
				rest: function() {
					var $el = $(this.el);
					if($el.hasClass('swiped') && $el.position().left > 0) {
						$el.removeClass('swiped');
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
				stop: function(e) {
					e.preventDefault();
				}
			});
		}
	};
})();
