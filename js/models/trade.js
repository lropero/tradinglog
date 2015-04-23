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
						self.comments = [];
						self.positions = [];
						$.when(
							self.fetchInstrument(),
							self.fetchPositions(),
							self.fetchComments()
						).done(function() {
							self.objects = [];
							self.prepareObjects();
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

		addToComments: function(qty, callback) {
			var comments = this.get('comments');
			this.set({
				comments: comments + qty
			});
			this.save(null, {
				success: function() {
					callback();
				}
			});
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

		delete: function(callback) {
			var self = this;
			this.deferred.done(function() {
				self.destroy({
					success: function() {
						callback();
					}
				});
			});
		},

		fetchComments: function() {
			var self = this;
			var deferred = $.Deferred();
			var comments = new app.Collections.comments();
			comments.setTradeId(this.get('id'));
			comments.fetch({
				success: function() {
					comments = comments.toJSON();
					for(var i = 0; i < comments.length; i++) {
						self.comments.push(comments[i]);
					}
					deferred.resolve();
				}
			});
			return deferred;
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
						if(i + 1 === positions.length) {
							positions[i].last = true;
						}
						self.positions.push(positions[i]);
					}
					deferred.resolve();
				}
			});
			return deferred;
		},

		getGross: function() {
			var gross = this.get('profit') - this.get('loss');
			return gross;
		},

		getNet: function() {
			var commission = this.get('commission');
			if(commission < 0) {
				commission = 0;
			}
			var net = this.getGross() - commission;
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

		prepareObjects: function() {
			var comments = this.comments.slice();
			var positions = this.positions.slice();
			while(comments.length && positions.length) {
				if(comments[0].created_at > positions[0].created_at) {
					this.objects.push(positions.shift());
				} else {
					this.objects.push(comments.shift());
				}
			}
			while(comments.length) {
				this.objects.push(comments.shift());
			}
			while(positions.length) {
				this.objects.push(positions.shift());
			}
		},

		setPnL: function(callback) {
			var self = this;
			var profit = 0;
			var loss = 0;
			var count = 0;
			var created_at = 0;
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
							created_at = position.created_at;
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
							created_at = position.created_at;
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
				var closed_at = self.get('closed_at');
				if(closed_at > 0) {
					var balance = app.account.get('balance') - self.getNet();
					self.set({
						profit: profit,
						loss: loss,
						commission: commission,
						variation: 0,
						closed_at: 0
					});
					self.save(null, {
						success: function() {
							app.account.set({
								balance: balance
							});
							app.account.save(null, {
								success: function() {
									app.cache.delete('mainMap');
									callback();
								}
							});
						}
					});
				} else {
					self.set({
						profit: profit,
						loss: loss,
						commission: instrument.type === 3 ? -1 : commission
					});
					var balance = app.account.get('balance') + self.getNet();
					if(balance < 0) {
						alertify.error('Non-sufficient funds');
						var last = self.positions[self.positions.length - 1];
						var position = new app.Models.position({
							id: last.id
						});
						position.delete(true);
						$('header button').show();
					} else {
						if(!array.length && created_at > 0) {
							self.set({
								variation: (profit - loss - commission) * 100 / app.account.get('balance'),
								closed_at: created_at
							});
							self.save(null, {
								success: function() {
									app.account.set({
										balance: balance
									});
									app.account.save(null, {
										success: function() {
											callback(true);
										}
									});
								}
							});
						} else {
							self.save(null, {
								success: function() {
									callback();
								}
							});
						}
					}
				}
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
				json.objects = this.objects;
				json.positions = this.positions.length;
				json.sizePrice = this.calculateSizePrice();
			}
			return json;
		}
	});
})();
