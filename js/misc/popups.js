(function() {
	'use strict';

	app.popups = {
		show: function(name) {
			var popups = new app.Collections.popups();
			popups.setName(name);
			popups.fetch({
				success: function() {
					var guider = {};
					switch(name) {
						case 'calculator':
							guider.description = 'Shake the device to turn on the calculator.';
							guider.title = 'Calculator';
							break;
						case 'delete':
							guider.description = 'You\'ll be able to delete trades, operations, positions and others under certain conditions only.<br /><br />We added a small triangle at the bottom left of every swipeable element for your convenience.';
							guider.title = 'Swipe left to delete';
							break;
						case 'drag':
							guider.attachTo = 'header';
							guider.description = 'Drag down to see your current account and its balance.';
							guider.offset = {
								left: 0,
								top: 10
							};
							guider.position = 'bottom';
							guider.title = 'Account info';
							break;
						case 'map':
							guider.attachTo = 'button.left';
							guider.description = 'Click this icon to view the briefing map.';
							guider.offset = {
								left: 0,
								top: -20
							};
							guider.position = 'bottomLeft';
							guider.title = 'Map';
							break;
						case 'open':
							guider.description = 'When adding a trade, it will remain open (black backgorund) in order to allow trade management (i.e. add positions) until you close it by adding an exit position which results in zero open shares or contracts.<br /><br />Reversing a trade is accomplished by closing the trade and opening a new one in opposite direction.';
							guider.title = 'Opening trades';
							break;
					}
					setTimeout(function() {
						guiders.createGuider({
							attachTo: guider.attachTo,
							buttons: [{
								name: 'OK',
								onclick: guiders.hideAll
							}],
							description: guider.description,
							offset: guider.offset,
							onHide: function() {
								var popup = new app.Models.popup();
								popup.set({
									name: name
								});
								popup.save();
							},
							overlay: true,
							position: guider.position,
							title: guider.title,
							width: '80%'
						}).show();
					}, 300);
				}
			});
		}
	};
})();
