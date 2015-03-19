(function() {
	'use strict';

	app.scroll = {
		init: function(el, hasDrag) {
			if(typeof hasDrag === 'undefined') {
				hasDrag = false;
			}
			app.scroll.hasDrag = hasDrag;

			var $content = $(el).find('section#content');
			$content.wrap('<div class="scroll"></div>');
			app.scroll.maxScroll = $content.height() - $('.scroll').height();

			if(hasDrag) {
				app.scroll.dragDown = snabbt($('.scroll'), {
					duration: 120,
					manual: true,
					position: [0, 30, 0]
				});
			}

			var hammer = new Hammer($('.scroll')[0]);
			hammer.get('pan').set({
				direction: Hammer.DIRECTION_VERTICAL,
				threshold: 20
			});

			hammer.on('panstart', function(e) {
				if(app.scroll.animating) {
					$content.stop();
				}
				app.scroll.animating = true;
				app.scroll.contentY = parseInt($content.css('transform').split(',')[5], 10);
				app.scroll.contentY = isNaN(app.scroll.contentY) ? 0 : app.scroll.contentY;
			});

			hammer.on('pan', function(e) {
				app.scroll.set($content, e.direction, e.deltaY);
			});

			hammer.on('panend', function(e) {
				app.scroll.set($content, e.direction, e.deltaY);
				app.scroll.contentY = parseInt($content.css('transform').split(',')[5], 10);
				if(app.scroll.dragSize > 0) {
					app.scroll.dragDown.rollback(function() {
						app.scroll.dragDown = snabbt($('.scroll'), {
							duration: 120,
							manual: true,
							position: [0, 30, 0]
						});
						app.scroll.dragSize = 0;
					});
				} else {
					var inertia = -100 * e.velocityY;
					var delta = app.scroll.contentY + inertia;
					if(delta > 0) {
						delta = 0;
					} else if(delta < -app.scroll.maxScroll) {
						delta = -app.scroll.maxScroll
					}
					$content.animate({
						transform: 'translateY(' + delta + 'px)'
					}, 500, 'easeOutExpo', function() {
						app.scroll.animating = false;
					});
				}
			});
		},
		set: function(content, direction, deltaY) {
			if(app.scroll.dragSize > 0) {
				if(direction === Hammer.DIRECTION_DOWN) {
					var value = $.easing.easeOutSine(1, deltaY, 0, 1, 200);
					if(value > app.scroll.dragSize) {
						app.scroll.dragSize = value;
						app.scroll.dragDown.setValue(app.scroll.dragSize);
					}
				}
				return;
			}

			var delta = app.scroll.contentY + deltaY;
			if(delta > 0) {
				delta = 0;
				content.css('transform', 'translateY(0)');
			} else if(delta < -app.scroll.maxScroll) {
				delta = -app.scroll.maxScroll;
			}

			switch(direction) {
				case Hammer.DIRECTION_DOWN:
					if(delta === 0 && app.scroll.hasDrag) {
						app.scroll.dragSize = $.easing.easeOutSine(1, deltaY, 0, 1, 200);
						app.scroll.dragDown.setValue(app.scroll.dragSize);
					} else {
						content.css('transform', 'translateY(' + delta + 'px)');
					}
					break;
				case Hammer.DIRECTION_UP:
					content.css('transform', 'translateY(' + delta + 'px)');
					break;
			};
		}
	};
})();
