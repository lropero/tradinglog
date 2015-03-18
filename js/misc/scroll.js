(function() {
	'use strict';

	var Scroll = function(view) {
		$(view.el).wrap('<div class="scroll"></div>');
		view.dragDown = snabbt($('.scroll'), {
			manual: true,
			position: [0, 30, 0]
		});

		view.maxScroll = $(view.el).height() - $('.scroll').height();

		var hammer = new Hammer($('.scroll')[0]);
		hammer.get('pan').set({
			direction: Hammer.DIRECTION_VERTICAL
		});

		hammer.on('panstart', function(e) {
			view.posY = parseInt($(view.el).css('transform').split(',')[5], 10);
			view.posY = isNaN(view.posY) ? 0 : view.posY;
		});

		hammer.on('pan', function(e) {
			var delta = view.posY + e.deltaY;
			if(delta > 0) {
				delta = 0;
				$(view.el).css('transform', 'translate(0, 0)');
			} else if(Math.abs(delta) > view.maxScroll) {
				delta = -view.maxScroll;
			}
			switch(e.direction) {
				case Hammer.DIRECTION_DOWN:
					if(delta === 0) {
						var value = e.distance > 200 ? 1 : $.easing.easeOutSine(1, e.distance, 0, 1, 200);
						view.dragDown.setValue(value);
					} else {
						$(view.el).css('transform', 'translate(0, ' + delta + 'px)');
					}
					break;
				case Hammer.DIRECTION_UP:
					$(view.el).css('transform', 'translate(0, ' + delta + 'px)');
					break;
			};
		});

		hammer.on('panend', function(e) {
			snabbt($('.scroll'), {
				callback: function() {
					view.dragDown = snabbt($('.scroll'), {
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
