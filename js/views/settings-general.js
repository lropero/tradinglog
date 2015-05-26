(function() {
	'use strict';

	app.Views.settingsGeneral = Backbone.View.extend({
		el: 'section#settings section#content',
		events: {
			'tap div#button-reset': 'buttonReset'
		},

		initialize: function() {
			this.template = Handlebars.compile(app.templateLoader.get('settings-general'));
			this.render();
		},

		destroy: function() {
			if(app.shake) {
				app.shake.stopWatch();
				delete app.shake;
			}
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'settings-general');
			this.$el.html(this.template());
			if(navigator.accelerometer) {
				this.shake();
			}
			return this;
		},

		buttonReset: function(e) {
			e.preventDefault();
			alertify.set({
				buttonFocus: 'none',
				buttonReverse: true,
				labels: {
					cancel: 'No',
					ok: 'Yes'
				}
			});
			alertify.confirm('Are you sure?<br />All your data will be deleted!', function(e) {
				var $alertify = $('section#alertify');
				if(e) {
					alertify.set({
						buttonReverse: false,
						labels: {
							cancel: 'No',
							ok: 'Yes, DELETE EVERYTHING'
						}
					});
					alertify.confirm('Are you REALLY sure?<br />This action cannot be undone!', function(e) {
						$alertify.hide();
						setTimeout(function() {
							if($('div#alertify-cover').is(':hidden')) {
								$alertify.show();
							}
						}, 100);
						if(e) {
							app.cache.reset();
							app.dates = {};
							app.stats.availables = {
								monthly: [],
								weekly: []
							};
							app.stats.data = {};
							delete app.account;
							delete app.count;
							delete app.previousCustom;
							app.databaseController.reset(app.init);
						}
					});
					$('button#alertify-ok').css('backgroundColor', '#ff3b30');
				} else {
					$alertify.hide();
					setTimeout(function() {
						if($('div#alertify-cover').is(':hidden')) {
							$alertify.show();
						}
					}, 100);
				}
			});
		},

		shake: function() {
			app.shake = new Shake({
				frequency: 100,
				threshold: 30,
				success: function(magnitude, accelerationDelta, timestamp) {
					app.shake.stopWatch();
					app.trigger('change', 'easter');
					$('section#settings section#content').empty().append('<img src="img/easter.jpg" style="width: 100%;" /><span class="copyright">TradingLog &copy; 2015<br />www.tradinglog.com<br />All rights reserved</span>');
				},
				waitBetweenShakes: 0
			});
			app.shake.startWatch();
		}
	});
})();
