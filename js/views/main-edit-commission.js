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
				var previousBalance = app.objects[this.key].net * 100 / app.objects[this.key].variation;
				var newNet = app.objects[this.key].profit - app.objects[this.key].loss - commission;
				var newVariation = newNet * 100 / previousBalance;
				app.objects[this.key].commission = parseFloat(commission);
				app.objects[this.key].edit_commission = 0;
				app.objects[this.key].net = newNet;
				app.objects[this.key].variation = newVariation;
				var newBalance = previousBalance + newNet;
				if(newBalance < 0) {
					alertify.error('Non-sufficient funds');
					$('header button').show();
					return;
				}
				var affected = {
					operations: [],
					trades: []
				};
				for(var i = this.key - 1; i >= 0; i--) {
					if(app.objects[i].instrument_id) {
						app.objects[i].variation = app.objects[i].net * 100 / newBalance;
						newBalance += app.objects[i].net;
						affected.trades.push({
							id: app.objects[i].id,
							variation: app.objects[i].variation
						});
					} else {
						app.objects[i].variation = app.objects[i].amount * 100 / newBalance;
						newBalance += app.objects[i].amount;
						affected.operations.push({
							id: app.objects[i].id,
							variation: app.objects[i].variation
						});
					}
				}
				app.cache.delete('main');
				var trades = new app.Collections.trades();
				trades.setFetchId(app.objects[this.key].id);
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
								app.cache.delete('mainViewTrade' + trade.id).done(function() {
									app.loadView('mainViewTrade', {
										key: self.key,
										top: self.top
									}, function() {
										var operations = new app.Collections.operations();
										operations.setAffected(affected.operations);
										operations.fetch();
										var trades = new app.Collections.trades();
										trades.setAffected(affected.trades);
										trades.fetch();
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
