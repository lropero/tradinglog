(function() {
	'use strict';

	var Scroll = function(view) {
		$(view.el).wrap('<div class="scroll"></div>');
		view.maxScroll = $(view.el).height() - $('.scroll').height();
		view.dragDown = snabbt(view.el, {
			manual: true,
			position: [0, 30, 0]
		});

		var hammer = new Hammer($('.scroll')[0]);
		hammer.get('pan').set({
			direction: Hammer.DIRECTION_VERTICAL
		});

		hammer.on('panstart', function(e) {
			view.top = parseInt($(view.el).css('top'), 10);
		});

		hammer.on('pan', function(e) {
			var delta = view.top + e.deltaY;
			if(delta > 0) {
				delta = 0;
				$(view.el).css('top', 0);
			} else if(Math.abs(delta) > view.maxScroll) {
				delta = -view.maxScroll;
			}
			switch(e.direction) {
				case Hammer.DIRECTION_DOWN:
					if(delta === 0) {
						var value = e.distance > 200 ? 1 : $.easing.easeOutSine(1, e.distance, 0, 1, 200);
						view.dragDown.setValue(value);
					} else {
						$(view.el).css('top', delta);
					}
					break;
				case Hammer.DIRECTION_UP:
					$(view.el).css('top', delta);
					break;
			};
		});

		hammer.on('panend', function(e) {
			snabbt(view.el, {
				callback: function() {
					view.dragDown = snabbt(view.el, {
						manual: true,
						position: [0, 30, 0]
					});
				},
				duration: 200,
				easing: 'easeOut',
				position: [0, 0, 0]
			});
		});
	};

	app.Scroll = Scroll;
})();
