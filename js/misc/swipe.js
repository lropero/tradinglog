(function() {
	'use strict';

	app.swipe = {
		init: function(selector) {
			$(selector).pep({
				axis: 'x',
				constrainTo: 'parent',
				shouldPreventDefault: false,
				startThreshold: [30, 20],
				useCSSTranslation: false,

				initiate: function() {
					var $el = $(this.el);
					if($el.hasClass('swiped')) {
						$el.removeClass('swiped');
					}
					$.pep.restore();
				},

				rest: function() {
					// console.log('rest');
					// // var $el = $(this.el);
					// // if($el.position().left > 0) {
					// // 	app.swipe.counter--;
					// // }
					// // if(app.swipe.counter === 0) {
					// 	console.log('si');
					this.coco = true;
					var self = this;
					$.each($('.active-swipe'), function() {
						if($(this).hasClass('swiped')) {
							self.coco = false;
							return;
						}
					});
					if(this.coco) {
						console.log('eee');
						$('section#content').css('-webkit-overflow-scrolling', 'touch');
						$('section#content').css('overflow-y', 'scroll');
					}
					// // }
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
					// console.log('no');
					// // if(typeof app.swipe.counter === 'undefined') {
					// // 	app.swipe.counter = 0;
					// // }
					// // app.swipe.counter++;
					$('section#content').css('-webkit-overflow-scrolling', 'auto');
					$('section#content').css('overflow-y', 'hidden');
				},

				// stop: function(e) {
				// 	e.preventDefault();
				// }
			});
		}
	};
})();
