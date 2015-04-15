(function() {
	'use strict';

	app.Views.settingsAddInstrument = Backbone.View.extend({
		el: 'section#settings section#content',
		events: {
			'tap div#done': 'combine',
			'tap input': 'isolate',
			'tap ul#type div:not(.active)': 'radio',
			'tap ul#type span': 'radio'
		},

		initialize: function(attrs, cache) {
			var self = this;
			if(typeof attrs !== 'undefined') {
				this.instrument = attrs.instrument;
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
				var template = app.cache.get('addInstrument', this.template);
				if(typeof cache !== 'boolean') {
					app.trigger('change', 'settings-add-instrument');
					this.$el.html(template);
				}
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
				var type = $radio.data('type');
				switch(type) {
					case 1:
						this.$el.find('input#point_value').val('');
						this.$el.find('input#commission').val('');
						$('div#form-point_value').show();
						$('div#form-broker_commission').show();
						$('span#text-currency').hide();
						$('span#text-stock').hide();
						break;
					case 2:
						this.$el.find('input#point_value').val('');
						$('div#form-point_value').show();
						$('div#form-broker_commission').hide();
						$('span#text-currency').show();
						$('span#text-stock').hide();
						this.$el.find('input#commission').val('0');
						break;
					case 3:
						$('div#form-point_value').hide();
						$('div#form-broker_commission').hide();
						$('span#text-currency').hide();
						$('span#text-stock').show();
						this.$el.find('input#point_value').val('1');
						this.$el.find('input#commission').val('0');
						break;
				}
			}
		},

		submit: function() {
			var self = this;
			var type = this.$el.find('ul#type div.active').data('type');
			var name = this.$el.find('input#name').val();
			name = name.charAt(0).toUpperCase() + name.slice(1);
			var point_value = this.$el.find('input#point_value').val().replace(',', '.');
			var commission = this.$el.find('input#commission').val().replace(',', '.');
			if(this.instrument) {
				var instrument = new app.Models.instrument({
					id: this.instrument.id
				});
			} else {
				var instrument = new app.Models.instrument();
			}
			instrument.set({
				type: type,
				name: name,
				point_value: point_value,
				commission: commission
			});
			instrument.save(null, {
				success: function() {
					$('header button').hide();
					app.view.subview.destroy();
					app.view.subview = new app.Views.settingsInstruments();
				}
			});
		}
	});
})();
