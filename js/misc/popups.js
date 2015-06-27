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
						case 'open':
							guider.description = 'The trade will remain open in order to allow trade management (i.e. add positions) until you close it by adding an exit position which results in zero open shares or contracts. Reversing a trade is accomplished by closing the trade and opening a new one in opposite direction.';
							guider.title = 'Trade is now open';
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
					}, 500);
				}
			});
		}
	};
})();
