(function() {
	'use strict';

	app.Views.settingsAddInstrument = Backbone.View.extend({
		el: 'section#settings section#content',
		events: {
			'tap div#done': 'combine',
			'tap div.checkbox-tap': 'toggleCheckbox',
			'tap input': 'isolate',
			'tap ul#type div:not(.active)': 'radio',
			'tap ul#type span': 'radio'
		},

		initialize: function(instrument, cache) {
			var self = this;
			if(typeof instrument !== 'string') {
				this.instrument = instrument;
			}
			app.submit = function() {
				self.submit();
			}
			app.templateLoader.get('settings-add-instrument').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render(cache);
			});
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function(cache) {
			if(this.instrument) {
				app.trigger('change', 'settings-edit-instrument');
				this.$el.html(this.template({
					instrument: this.instrument
				}));
			} else {
				var template = app.cache.get('settingsAddInstrument', this.template);
				if(typeof cache !== 'boolean') {
					app.trigger('change', 'settings-add-instrument');
					this.$el.html(template);
				}
			}
			if(this.instrument) {
				switch(this.instrument.type) {
					case 1:
						$('.type-2').hide();
						$('.type-3').hide();
						$('.type-1').show();
						break;
					case 2:
						$('.type-1').hide();
						$('.type-3').hide();
						$('.type-2').show();
						break;
					case 3:
						$('.type-1').hide();
						$('.type-2').hide();
						$('.type-3').show();
						$('.wrapper-checkbox').css('display', 'table');
						break;
				}
			} else {
				$('.type-2').hide();
				$('.type-3').hide();
				$('.type-1').show();
			}
			return this;
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
		},

		isolate: function(e) {
			e.preventDefault();
			app.isolate(e);
		},

		radio: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var $radio = $target;
			if($target.is('span')) {
				$radio = $target.prev();
			}
			if(!$radio.hasClass('active')) {
				this.$el.find('ul.wrapper-radiobutton div.active').removeClass('active');
				$radio.addClass('active');
				this.$el.find('.error').removeClass('error');
				var type = $radio.data('type');
				switch(type) {
					case 1:
						var $point_value = this.$el.find('input#point_value');
						if($point_value.is(':hidden')) {
							if(this.instrument) {
								$point_value.val(this.instrument.point_value);
							} else {
								$point_value.val('');
							}
						}
						var $commission = this.$el.find('input#commission');
						if($commission.is(':hidden')) {
							if(this.instrument) {
								$commission.val(this.instrument.commission);
							} else {
								$commission.val('');
							}
						}
						$('.type-2').hide();
						$('.type-3').hide();
						$('.type-1').show();
						break;
					case 2:
						$('.type-1').hide();
						$('.type-3').hide();
						$('.type-2').show();
						this.$el.find('input#point_value').val('1');
						this.$el.find('input#commission').val('0');
						break;
					case 3:
						var $point_value = this.$el.find('input#point_value');
						if($point_value.is(':hidden')) {
							if(this.instrument) {
								$point_value.val(this.instrument.point_value);
							} else {
								$point_value.val('');
							}
						}
						var $commission = this.$el.find('input#commission');
						if($commission.is(':hidden')) {
							if(this.instrument) {
								$commission.val(this.instrument.commission);
							} else {
								$commission.val('');
							}
						}
						$('.type-1').hide();
						$('.type-2').hide();
						$('.type-3').show();
						$('.wrapper-checkbox').css('display', 'table');
						break;
				}
			}
		},

		submit: function() {
			var self = this;
			var type = this.$el.find('ul#type div.active').data('type');
			var name = this.$el.find('input#name').val().trim();
			var point_value = this.$el.find('input#point_value').val().replace(',', '.');
			var commission = this.$el.find('input#commission').val().replace(',', '.');
			var alert = this.$el.find('div#alert').hasClass('active') ? 1 : 0;

			name = name.charAt(0).toUpperCase() + name.slice(1);
			switch(type) {
				case 1:
					alert = 0;
					break;
				case 2:
					alert = 1;
					break;
				case 3:
					if(!point_value) {
						point_value = 1;
					}
					if(!commission) {
						commission = 0;
					}
					break;
			}
			var deferred = $.Deferred();
			var instruments = new app.Collections.instruments();
			instruments.setName(name);
			instruments.fetch({
				success: function() {
					var same = false;
					if(self.instrument) {
						if(instruments.models[0] && self.instrument.id === instruments.models[0].id) {
							same = true;
						}
					}
					if(instruments.length > 0 && name.length && !same) {
						alertify.error('An instrument with this name already exists');
					} else {
						deferred.resolve();
					}
				}
			});
			if(this.instrument) {
				var instrument = new app.Models.instrument({
					id: this.instrument.id
				});
				var group_id = this.instrument.group_id;
			} else {
				var instrument = new app.Models.instrument();
				var group_id = 0;
			}
			instrument.set({
				type: type,
				name: name,
				point_value: point_value,
				commission: commission,
				alert: alert,
				group_id: group_id
			});
			deferred.done(function() {
				instrument.save(null, {
					success: function() {
						$('header button').hide();
						app.cache.delete('mainAddTrade');
						app.view.subview.destroy();
						app.view.subview = new app.Views.settingsInstruments();
					}
				});
			});
		},

		toggleCheckbox: function(e) {
			e.preventDefault();
			var $checkbox = $(e.currentTarget).find('div.checkbox');
			if($checkbox.hasClass('active')) {
				$checkbox.removeClass('active');
			} else {
				$checkbox.addClass('active');
			}
		}
	});
})();
