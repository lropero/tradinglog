(function() {
	'use strict';

	app.scroll = {
		init: function(el) {
			var $content = $(el).find('section#content');
			$content.wrap('<div class="scroll"></div>');
			app.scroll.dragDown = snabbt($('.scroll'), {
				manual: true,
				position: [0, 30, 0]
			});

			app.scroll.maxScroll = $content.height() - $('.scroll').height();

			var hammer = new Hammer($('.scroll')[0]);
			hammer.get('pan').set({
				direction: Hammer.DIRECTION_VERTICAL
			});

			hammer.on('panstart', function(e) {
				app.scroll.posY = parseInt($content.css('transform').split(',')[5], 10);
				app.scroll.posY = isNaN(app.scroll.posY) ? 0 : app.scroll.posY;
			});

			hammer.on('pan', function(e) {
				app.scroll.set($content, e.direction, e.deltaY);
			});

			hammer.on('panend', function(e) {
				app.scroll.set($content, e.direction, e.deltaY);
				app.scroll.posY = parseInt($content.css('transform').split(',')[5], 10);
				app.scroll.posY = isNaN(app.scroll.posY) ? 0 : app.scroll.posY;

				// var inertia = -100 * e.velocityY;
				// var delta = app.scroll.posY + inertia;
				// if(delta > 0) {
				// 	delta = 0;
				// }
				// $content.animate({
				// 	transform: 'translateY(' + delta + 'px)'
				// }, 1000, 'swing');

				if(app.scroll.posY === 0) {
					snabbt($('.scroll'), {
						callback: function() {
							app.scroll.dragDown = snabbt($('.scroll'), {
								manual: true,
								position: [0, 30, 0]
							});
						},
						duration: 200,
						easing: 'easeOut',
						position: [0, 0, 0]
					});
				}
			});
		},
		set: function(content, direction, deltaY) {
			var delta = app.scroll.posY + deltaY;
			if(delta > 0) {
				delta = 0;
				content.css('transform', 'translateY(0)');
			} else if(Math.abs(delta) > app.scroll.maxScroll) {
				delta = -app.scroll.maxScroll;
			}
			switch(direction) {
				case Hammer.DIRECTION_DOWN:
					if(delta === 0) {
						var value = deltaY > 200 ? 1 : $.easing.easeOutSine(1, deltaY, 0, 1, 200);
						app.scroll.dragDown.setValue(value);
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
