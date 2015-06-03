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

		initialize: function(attrs) {
			var self = this;
			this.cache = false;
			if(attrs.cache) {
				this.cache = true;
			} else if(attrs.instrument) {
				this.instrument = attrs.instrument;
			}
			app.submit = function() {
				self.submit();
			}
			this.template = Handlebars.compile(app.templateLoader.get('settings-add-instrument'));
			this.render();
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			var self = this;
			var deferred = app.cache.get('settingsAddInstrument', this.template);
			if(!this.cache) {
				deferred.then(function(html) {
					if(self.instrument) {
						app.trigger('change', 'settings-edit-instrument');
						self.$el.html(html);

						switch(self.instrument.type) {
							case 1:
								$('.type-2').hide();
								$('.type-3').hide();
								$('.type-1').show();
								break;
							case 2:
								$('#radio-1').removeClass('active');
								$('#radio-2').addClass('active');
								$('#radio-3').removeClass('active');
								$('.type-1').hide();
								$('.type-3').hide();
								$('.type-2').show();
								break;
							case 3:
								$('#radio-1').removeClass('active');
								$('#radio-2').removeClass('active');
								$('#radio-3').addClass('active');
								$('.type-1').hide();
								$('.type-2').hide();
								$('.type-3').show();
								$('.wrapper-checkbox').css('display', 'table');
								break;
						}
						$('input#name').val(self.instrument.name);
						$('input#point_value').val(self.instrument.point_value);
						$('input#commission').val(self.instrument.commission);
						if(!self.instrument.alert) {
							$('div.checkbox').removeClass('active');
						}

						$('div#view').show();
					} else {
						app.trigger('change', 'settings-add-instrument');
						self.$el.html(html);
						$('.type-2').hide();
						$('.type-3').hide();
						$('.type-1').show();
						$('div#view').show();
					}
				});
			} else {
				setTimeout(function() {
					self.destroy();
				}, 10);
			}
			return this;
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
			return false;
		},

		isolate: function(e) {
			e.preventDefault();
			app.isolate(e);
			return false;
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
			return false;
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
			deferred.done(function() {
				if(self.instrument) {
					instruments = new app.Collections.instruments();
					instruments.setFetchId(self.instrument.id);
					instruments.fetch({
						success: function() {
							var instrument = instruments.at(0);
							instrument.set({
								type: type,
								name: name,
								point_value: point_value,
								commission: commission,
								alert: alert,
								group_id: self.instrument.group_id
							});
							instrument.validate();
							if(instrument.isValid()) {
								app.trigger('change', 'loading-right');
								instrument.save(null, {
									success: function() {
										app.cache.delete('mainAddTrade');
										app.view.subview.destroy();
										app.view.subview = new app.Views.settingsInstruments();
									}
								});
							}
						}
					});
				} else {
					var instrument = new app.Models.instrument();
					instrument.set({
						type: type,
						name: name,
						point_value: point_value,
						commission: commission,
						alert: alert,
						group_id: 0
					});
					instrument.validate();
					if(instrument.isValid()) {
						app.trigger('change', 'loading-right');
						instrument.save(null, {
							success: function() {
								app.cache.delete('mainAddTrade');
								app.view.subview.destroy();
								app.view.subview = new app.Views.settingsInstruments();
							}
						});
					}
				}
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
			return false;
		}
	});
})();
