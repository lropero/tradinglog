(function() {
	'use strict';

	app.Views.mainEditCommission = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div#done': 'combine',
			'tap input': 'isolate'
		},

		initialize: function(attrs) {
			var self = this;
			this.key = attrs.key;
			this.top = attrs.top;
			app.submit = function() {
				self.submit();
			}
			this.template = Handlebars.compile(app.templateLoader.get('main-edit-commission'));
			this.render();
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'main-edit-commission', {
				key: this.key,
				top: this.top
			});
			this.$el.html(this.template({
				commission: app.objects[this.key].commission
			}));
			return this;
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
		},

		isolate: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			if(app.objects[this.key].commission > 0 && !$target.val().length) {
				$target.val(app.objects[this.key].commission);
			}
			app.isolate(e);
		},

		submit: function() {
			var self = this;
			var $commission = $('input#commission');
			var commission = $commission.val();

			if(!commission.length) {
				commission = $commission.attr('placeholder').replace('$', '').trim();
			}
			commission = parseFloat(commission);
			var commissionModel = new app.Models.commission({
				commission: commission
			});
			commissionModel.validate();
			if(commissionModel.isValid()) {
				$('header button').hide();
				var previousBalance = Big(app.account.get('balance'));
				for(var i = app.count.open; i <= this.key; i++) {
					if(app.objects[i].instrument_id) {
						previousBalance = previousBalance.minus(app.objects[i].net);
					} else {
						previousBalance = previousBalance.minus(app.objects[i].amount);
					}
				}
				var newNet = parseFloat(Big(app.objects[this.key].profit).minus(app.objects[this.key].loss).minus(commission).toString());
				var newVariation = parseFloat(Big(newNet * 100).div(previousBalance).toString());
				var newBalance = previousBalance.plus(newNet);
				if(parseFloat(newBalance.toString()) < 0) {
					alertify.error('Non-sufficient funds');
					$('header button').show();
					return;
				}
				for(var i = this.key - 1; i >= 0; i--) {
					if(app.objects[i].instrument_id) {
						newBalance = newBalance.plus(app.objects[i].net);
					} else {
						newBalance = newBalance.plus(app.objects[i].amount);
					}
					if(parseFloat(newBalance.toString()) < 0) {
						alertify.error('Non-sufficient funds in subsequent account movements');
						$('header button').show();
						return;
					}
				}
				app.objects[this.key].commission = commission;
				app.objects[this.key].edit_commission = 0;
				app.objects[this.key].net = newNet;
				app.objects[this.key].variation = newVariation;
				var affected = {
					operations: [],
					trades: []
				};
				newBalance = previousBalance.plus(newNet);
				for(var i = this.key - 1; i >= 0; i--) {
					if(app.objects[i].instrument_id) {
						app.objects[i].variation = parseFloat(Big(app.objects[i].net * 100).div(newBalance).toString());
						affected.trades.push({
							id: app.objects[i].id,
							variation: app.objects[i].variation
						});
						newBalance = newBalance.plus(app.objects[i].net);
					} else {
						app.objects[i].variation = parseFloat(Big(app.objects[i].amount * 100).div(newBalance).toString());
						affected.operations.push({
							id: app.objects[i].id,
							variation: app.objects[i].variation
						});
						newBalance = newBalance.plus(app.objects[i].amount);
					}
				}
				app.storeCache().done(function() {
					var trades = new app.Collections.trades();
					trades.setFetchId(app.objects[self.key].id);
					trades.fetch({
						success: function() {
							var trade = trades.at(0);
							trade.set({
								commission: app.objects[self.key].commission,
								edit_commission: 0,
								variation: newVariation
							});
							trade.save(null, {
								success: function() {
									var operations = new app.Collections.operations();
									operations.setAffected(affected.operations);
									operations.fetch();
									var trades = new app.Collections.trades();
									trades.setAffected(affected.trades);
									trades.fetch();
									app.account.set({
										balance: parseFloat(newBalance.toString())
									});
									app.account.save(null, {
										success: function() {
											var date = new Date(app.objects[self.key].closed_at);
											var monthly = date.getFullYear() + '-' + date.getMonth();
											date.setDate(date.getDate() - date.getDay());
											var weekly = date.getFullYear() + '-' + date.getMonth() + '-' + (date.getDate());
											app.stats.delete(monthly);
											app.stats.delete(weekly);
											app.cache.delete('main');
											app.cache.delete('mainMap');
											app.loadView('mainViewTrade', {
												key: self.key,
												top: self.top
											});
										}
									});
								}
							});
						}
					});
				});
			}
		}
	});
})();
