(function() {
	'use strict';

	app.Views.settingsInstruments = Backbone.View.extend({
		el: 'section#settings section#content',
		events: {
			'tap div.instrument:not(.swiped)': 'viewInstrument',
			'tap li.button-swipe.delete': 'buttonDelete',
			'tap li.button-swipe.group': 'buttonGroup'
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			this.instruments = [];
			var instruments = new app.Collections.instruments();
			instruments.fetch({
				success: function() {
					instruments = instruments.toJSON();
					for(var i = 0; i < instruments.length; i++) {
						self.instruments.push(instruments[i]);
					}
					self.deferred.resolve();
				}
			});
			app.templateLoader.get('settings-instruments').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function() {
			var self = this;
			this.deferred.done(function() {
				app.trigger('change', 'settings-instruments');
				self.$el.html(self.template({
					instruments: self.instruments
				}));
				app.swipe.init('.swipe');
			});
			return this;
		},

		buttonDelete: function(e) {
			e.preventDefault();
			var id = $(e.currentTarget).data('id');
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			alertify.set({
				buttonFocus: 'none',
				buttonReverse: true,
				labels: {
					cancel: 'No',
					ok: 'Yes'
				}
			});
			alertify.confirm('Are you sure?', function(e) {
				if(e) {
					$wrapper.hide();
					var instrument = new app.Models.instrument({
						id: id
					});
					instrument.delete();
				}
			});
		},

		buttonGroup: function(e) {
			var self = this;
			e.preventDefault();
			clearTimeout(this.timeout);
			var id = $(e.currentTarget).data('id');
			var $span = $(e.currentTarget).children('span');
			var group = $span.html();
			var group_id = group.charCodeAt(0) - 65;
			if(group_id++ == 4) {
				group_id = 0;
			}
			var newGroup = String.fromCharCode(group_id + 65);
			$span.html(newGroup);
			var $group = $(e.currentTarget).parents('.wrapper-swipe').prev().find('span.group');
			this.timeout = setTimeout(function() {
				var instrument = new app.Models.instrument({
					id: id
				});
				instrument.deferred.then(function() {
					instrument.set({
						group_id: group_id
					});
					instrument.save(null, {
						success: function() {
							for(var i = 0; i < self.instruments.length; i++) {
								if(self.instruments[i].id === id) {
									self.instruments[i].group_id = group_id;
									break;
								}
							}
							$group.html(newGroup);
						}
					});
				});
			}, 1000);
		},

		viewInstrument: function(e) {
			var self = this;
			e.preventDefault();
			$('header button').hide();
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var $label = $($wrapper.context);
			$label.css('backgroundColor', '#333');
			var key = $wrapper.data('key');
			app.view.subview.destroy();
			setTimeout(function() {
				app.view.subview = new app.Views.settingsAddInstrument(self.instruments[key]);
			}, 10);
		}
	});
})();
