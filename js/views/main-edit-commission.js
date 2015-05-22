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
			var commissionModel = new app.Models.commission({
				commission: commission
			});
			commissionModel.validate();
			if(commissionModel.isValid()) {
				$('header button').hide();
				var trades = new app.Collections.trades();
				trades.setFetchId(app.objects[this.key].id);
				trades.fetch({
					success: function() {
						var trade = trades.at(0);
						var previousBalance = trade.getNet() * 100 / trade.get('variation');
						trade.set({
							commission: parseFloat(commission),
							edit_commission: 0
						});
						var newNet = trade.getNet();
						var newVariation = newNet * 100 / previousBalance;
						trade.set({
							variation: newVariation
						});
						var newBalance = previousBalance + newNet;
						trade.save(null, {
							success: function() {
								app.objects[self.key] = trade.toJSON();
								app.cache.delete('mainViewTrade' + app.objects[self.key].id).done(function() {
									app.loadView('mainViewTrade', {
										key: self.key,
										top: self.top
									}, function() {
										var deferreds = [];
										var ids = [];
										var keys = [];
										var variations = [];
										for(var i = self.key - 1; i >= 0; i--) {
											deferreds[app.objects[i].id] = new $.Deferred();
											ids.push(app.objects[i].id);
											keys[app.objects[i].id] = i;
											variations[app.objects[i].id] = app.objects[i].net * 100 / newBalance;
											newBalance += app.objects[i].net;
										}
										var trades = new app.Collections.trades();
										trades.setFetchIds(ids);
										trades.fetch({
											success: function() {
												for(var i = 0; i < trades.length; i++) {
													var trade = trades.at(i);
													trade.set({
														variation: variations[trade.id]
													});
													trade.save(null, {
														success: function(trade) {
															app.objects[keys[trade.id]] = trade.toJSON();
															app.cache.delete('mainViewTrade' + trade.id).done(function() {
																new app.Views.mainViewTrade({
																	cache: true,
																	key: keys[trade.id]
																});
															});
															deferreds[trade.id].resolve();
														}
													});
												}
											}
										});
										$.when.apply($, deferreds).done(function() {
											app.cache.delete('main');
										});
									});
								});
							}
						});
					}
				});
			}
		}
	});
})();
