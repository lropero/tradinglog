(function() {
	'use strict';

	app.scroll = {
		init: function(el) {
			var $content = $(el).find('section#content');
			$content.wrap('<div class="scroll"></div>');
			app.scroll.dragDown = snabbt($('.scroll'), {
				duration: 120,
				manual: true,
				position: [0, 30, 0]
			});

			app.scroll.maxScroll = $content.height() - $('.scroll').height();

			var hammer = new Hammer($('.scroll')[0]);
			hammer.get('pan').set({
				direction: Hammer.DIRECTION_VERTICAL,
				threshold: 30
			});

			hammer.on('panstart', function(e) {
				app.scroll.contentY = parseInt($content.css('transform').split(',')[5], 10);
				app.scroll.contentY = isNaN(app.scroll.contentY) ? 0 : app.scroll.contentY;
			});

			hammer.on('pan', function(e) {
				app.scroll.set($content, e.direction, e.deltaY);
			});

			hammer.on('panend', function(e) {
				app.scroll.set($content, e.direction, e.deltaY);
				app.scroll.contentY = parseInt($content.css('transform').split(',')[5], 10);

				var inertia = -200 * e.velocityY;
				var delta = app.scroll.contentY + inertia;
				if(delta > 0) {
					delta = 0;
				} else if(app.scroll.maxScroll + delta < 0) {
					delta = -app.scroll.maxScroll
				}
				$content.animate({
					transform: 'translateY(' + delta + 'px)'
				}, 500, 'swing');

				if(app.scroll.contentY === 0 && parseInt($('.scroll').css('transform').split(',')[5], 10) > 0) {
					app.scroll.dragDown.rollback(function() {
						app.scroll.dragDown = snabbt($('.scroll'), {
							duration: 120,
							manual: true,
							position: [0, 30, 0]
						});
					});
				}
			});
		},
		set: function(content, direction, deltaY) {
			var delta = app.scroll.contentY + deltaY;
			if(delta > 0) {
				delta = 0;
				content.css('transform', 'translateY(0)');
			} else if(Math.abs(delta) > app.scroll.maxScroll) {
				delta = -app.scroll.maxScroll;
			}
			switch(direction) {
				case Hammer.DIRECTION_DOWN:
					if(delta === 0) {
						var scrollY = app.scroll.contentY + deltaY;
						var value = scrollY > 200 ? 1 : $.easing.easeOutSine(1, scrollY, 0, 1, 200);
						app.scroll.dragDown.setValue(value);
					} else {
						content.css('transform', 'translateY(' + delta + 'px)');
					}
					break;
				case Hammer.DIRECTION_UP:
					if(parseInt($('.scroll').css('transform').split(',')[5], 10) > 0) {
						if(deltaY < 0) {
							app.scroll.dragDown.rollback(function() {
								app.scroll.dragDown = snabbt($('.scroll'), {
									duration: 120,
									manual: true,
									position: [0, 30, 0]
								});
							});
						} else {
							var value = deltaY > 200 ? 1 : $.easing.easeOutSine(1, deltaY, 0, 1, 200);
							app.scroll.dragDown.setValue(value);
						}
					} else {
						content.css('transform', 'translateY(' + delta + 'px)');
					}
					break;
			};
		}
	};
})();
