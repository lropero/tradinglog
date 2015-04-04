(function() {
	'use strict';

	app.Models.trade = Backbone.Model.extend({
		dao: app.DAOs.trade,
		defaults: {
			account_id: 0,
			instrument_id: 0,
			type: 0,
			profit: 0,
			loss: 0,
			commission: 0,
			variation: 0,
			comments: 0,
			closed_at: 0
		},
		validation: {
			instrument_id: {
				gt: 0
			}
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			if(!this.isNew()) {
				if(this.collection) {
					this.collection.deferreds.push(this.deferred);
				}
				this.fetch({
					success: function() {
						self.positions = [];
						$.when(
							self.fetchInstrument(),
							self.fetchPositions(),
							self.fetchComments()
						).done(function() {
							self.deferred.resolve();
						});
					}
				});
			} else {
				this.listenTo(this, 'validated', function(isValid, model, errors) {
					if(!isValid) {
						$.each(errors, function(index, error) {
							var $el = $('#' + index);
							$el.addClass('error');
							var $wrapper = $el.parents('div.wrapper-select');
							if($wrapper) {
								$wrapper.addClass('error');
							}
						});
					}
				});
			}
		},

		calculateCloseSize: function() {
			var counter = 0;
			for(var i = 0; i < this.positions.length; i++) {
				var position = this.positions[i];
				var size = parseInt(position.size, 10);
				counter += size;
			}
			return counter;
		},

		calculateSizePrice: function() {
			var array = [];
			var type = parseInt(this.get('type'), 10);
			for(var i = 0; i < this.positions.length; i++) {
				var position = this.positions[i];
				var size = parseInt(position.size, 10);
				for(var j = 0; j < Math.abs(size); j++) {
					if(type === 1) {
						if(size > 0) {
							array.push(position.price);
						} else {
							array.shift();
						}
					} else {
						if(size < 0) {
							array.push(position.price);
						} else {
							array.shift();
						}
					}
				}
			}
			var price = 0;
			for(var i = 0; i < array.length; i++) {
				price += array[i];
			}
			var average = price / array.length;
			return array.length + ' @ ' + accounting.formatMoney(average, '');
		},

		delete: function() {
			var self = this;
			this.deferred.done(function() {
				for(var i = 0; i < self.positions.length; i++) {
					var position = new app.Models.position({
						id: self.positions[i].id
					});
					position.delete();
				}
				self.destroy({
					success: function() {
						app.trigger('clear');
					}
				});
			});
		},

		fetchInstrument: function() {
			var self = this;
			var deferred = $.Deferred();
			var instrument = new app.Models.instrument({
				id: this.get('instrument_id')
			});
			instrument.fetch({
				success: function() {
					self.instrument = instrument.toJSON().name;
					deferred.resolve();
				}
			});
			return deferred;
		},

		fetchPositions: function() {
			var self = this;
			var deferred = $.Deferred();
			var positions = new app.Collections.positions();
			positions.setTradeId(this.get('id'));
			positions.fetch({
				success: function() {
					positions = positions.toJSON();
					for(var i = 0; i < positions.length; i++) {
						self.positions.push(positions[i]);
					}
					deferred.resolve();
				}
			});
			return deferred;
		},

		fetchComments: function() {
			var deferred = $.Deferred();
			deferred.resolve();
			return deferred;
		},

		getGross: function() {
			var gross = this.get('profit') - this.get('loss');
			return gross;
		},

		getNet: function() {
			var net = this.getGross() - this.get('commission');
			return net;
		},

		isLong: function() {
			if(this.get('type') === 1) {
				return true;
			}
			return false;
		},

		isOpen: function() {
			if(this.get('closed_at') === 0) {
				return true;
			}
			return false;
		},

		setPnL: function(callback) {
			var self = this;
			var profit = 0;
			var loss = 0;
			var count = 0;
			var array = [];
			var type = parseInt(this.get('type'), 10);
			for(var i = 0; i < this.positions.length; i++) {
				var position = this.positions[i];
				var size = parseInt(position.size, 10);
				for(var j = 0; j < Math.abs(size); j++) {
					if(type === 1) {
						if(size > 0) {
							array.push(position.price);
						} else {
							count++;
							var pnl = position.price - array[0];
							if(pnl > 0) {
								profit += pnl;
							} else {
								loss += Math.abs(pnl);
							}
							array.shift();
						}
					} else {
						if(size < 0) {
							array.push(position.price);
						} else {
							count++;
							var pnl = array[0] - position.price;
							if(pnl > 0) {
								profit += pnl;
							} else {
								loss += Math.abs(pnl);
							}
							array.shift();
						}
					}
				}
			}
			var instrument = new app.Models.instrument({
				id: this.get('instrument_id')
			});
			instrument.deferred.then(function() {
				instrument = instrument.toJSON();
				profit *= instrument.point_value;
				loss *= instrument.point_value;
				var commission = instrument.commission * count;
				self.set({
					profit: profit,
					loss: loss,
					commission: commission
				});
				self.save(null, {
					success: callback
				});
			});
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			if(this.positions && this.positions.length > 0) {
				json.closeSize = this.calculateCloseSize();
				json.instrument = this.instrument;
				json.isLong = this.isLong();
				json.isOpen = this.isOpen();
				if(this.positions.length > 1) {
					json.net = this.getNet();
				}
				json.positions = this.positions;
				json.sizePrice = this.calculateSizePrice();
			}
			return json;
		}
	});
})();
