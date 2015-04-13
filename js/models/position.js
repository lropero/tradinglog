(function() {
	'use strict';

	app.Models.position = Backbone.Model.extend({
		dao: app.DAOs.position,
		defaults: {
			trade_id: 0,
			size: 0,
			price: 0,
			created_at: 0
		},
		validation: {
			size: {
				nat: 0
			},
			price: {
				gt: 0
			}
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			if(!this.isNew()) {
				this.fetch({
					success: function() {
						self.deferred.resolve();
					}
				});
			} else {
				this.listenTo(this, 'validated', function(isValid, model, errors) {
					if(!isValid) {
						$.each(errors, function(index, error) {
							var $el = $('#' + index);
							$el.addClass('error');
							var $price = $el.parent('div.price');
							if($price) {
								$price.addClass('error');
							}
						});
					}
				});
			}
		},

		delete: function(tradeDelete) {
			var self = this;
			this.deferred.done(function() {
				var trade_id = self.get('trade_id');
				var size = self.get('size');
				self.destroy({
					success: function() {
						if(!tradeDelete) {
							var trade = new app.Models.trade({
								id: trade_id
							});
							trade.deferred.then(function() {
								var type = trade.get('type');
								if((type === 1 && size < 0) || (type === 2 && size > 0)) {
									trade.setPnL(function() {
										app.cache.delete('main', true);
										app.cache.delete('trade' + trade_id);
										app.loadView('mainViewTrade', {
											trade_id: trade_id
										});
									});
								} else {
									app.cache.delete('main');
									app.cache.delete('trade' + trade_id);
									app.loadView('mainViewTrade', {
										trade_id: trade_id
									});
								}
							});
						}
					}
				});
			});
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			json.sizePrice = Math.abs(this.get('size')) + ' @ ' + accounting.formatMoney(this.get('price'), '');
			return json;
		}
	});
})();
