(function() {
	'use strict';

	app.Views.mainAddTrade = Backbone.View.extend({
		el: 'section#main-stats-friends section#content',
		events: {
			'tap div#done': 'combine',
			'tap input': 'isolate',
			'tap select': 'removeValidation',
			'tap ul#type div:not(.active)': 'radio'
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.templateLoader.get('main-add-trade').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
			this.instruments = [];
			this.fetchInstruments();
			app.submit = function() {
				self.submit();
			}
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			var self = this;
			this.deferred.done(function() {
				app.trigger('change', 'main-add-trade');
				self.$el.html(self.template({
					instruments: self.instruments
				}));
				return this;
			});
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
		},

		fetchInstruments: function() {
			var self = this;
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
		},

		isolate: function(e) {
			e.preventDefault();
			if($(e.currentTarget).attr('id') === 'size') {
				if(!this.$el.find('input#size').val()) {
					var size = $.cookie('size');
					if(size) {
						if(size < 0) {
							size *= -1;
						}
						this.$el.find('input#size').val(size);
					}
				}
			}
			app.isolate(e);
		},

		radio: function(e) {
			e.preventDefault();
			this.$el.find('ul.wrapper-radiobutton div.active').removeClass('active');
			var $target = $(e.currentTarget);
			$target.addClass('active');
		},

		removeValidation: function(e) {
			var $target = $(e.currentTarget);
			if($target.hasClass('error')) {
				$target.removeClass('error');
				var $wrapper = $target.parents('div.wrapper-select');
				if($wrapper) {
					$wrapper.removeClass('error');
				}
			}
		},

		submit: function() {
			var instrument_id = this.$el.find('select#instrument_id').val();
			var type = this.$el.find('ul#type div.active').data('type');
			var size = this.$el.find('input#size').val();
			if(type === 2) {
				size *= -1;
			}
			var price = this.$el.find('input#price').val().replace(',', '.');
			var trade = new app.Models.trade();
			trade.set({
				account_id: 1,
				instrument_id: instrument_id,
				type: type
			});
			trade.validate();
			var position = new app.Models.position();
			position.set({
				size: size,
				price: price,
				created_at: (new Date()).getTime()
			});
			position.validate();
			if(trade.isValid() && position.isValid()) {
				trade.save(null, {
					success: function(model, insertId) {
						position.set({
							trade_id: insertId
						});
						position.save(null, {
							success: function() {
								$.cookie('size', size, {
									expires: 20
								});
								app.trigger('clear', 'main');
							}
						});
					}
				});
			}
		}
	});
})();
