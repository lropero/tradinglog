(function() {
	'use strict';

	app.Views.main = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div.operation:not(.no-click):not(.swiped)': 'viewOperation',
			'tap div.trade:not(.swiped)': 'viewTrade',
			'tap li.button-swipe': 'button'
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			app.templateLoader.get('main').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
			this.operations = [];
			this.trades = [];
			$.when(
				this.fetchOperations(),
				this.fetchTrades()
			).done(function() {
				self.objects = [];
				self.prepareObjects();
				self.deferred.resolve();
			});
		},

		destroy: function() {
			this.drag.destroy();
			this.undelegateEvents();
		},

		render: function() {
			var self = this;
			if(app.cache) {
				app.trigger('change', 'main');
				this.$el.html(app.cache);
				this.decorate();
			} else {
				app.headerNavigation.update({});
				this.deferred.done(function() {
					app.trigger('change', 'main');
					app.cache = self.template({
						objects: self.objects
					});
					self.$el.html(app.cache);
					self.decorate();
				});
			}
			return this;
		},

		button: function(e) {
			var self = this;
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var id = $wrapper.data('id');
			alertify.set({
				buttonFocus: 'none',
				buttonReverse: true,
				labels: {
					cancel: 'No',
					ok: 'Yes'
				}
			});
			alertify.confirm('Are you sure?', function(e) {
				if(e) {
					var trade = new app.Models.trade({
						id: id
					});
					trade.delete();
				}
			});
		},

		decorate: function() {
			this.drag = new app.Views.mainDrag();
			app.swipe.init('.swipe');
			var $content = $('section#content');
			var $ul = $('section#content').find('ul');
			if($content.height() > $ul.height()) {
				$ul.append('<li style="background: #ffffff; height: ' + ($content.height() - $ul.height() + 5) + 'px; width: 100%;"></li>');
				setTimeout(function() {
					$content.css('-webkit-overflow-scrolling', 'touch');
					$content.css('overflow-y', 'scroll');
				}, 10);
			}
		},

		fetchOperations: function() {
			var self = this;
			var deferred = $.Deferred();
			var operations = new app.Collections.operations();
			operations.setAccountId(1);
			operations.fetch({
				success: function() {
					operations = operations.toJSON();
					for(var i = 0; i < operations.length; i++) {
						self.operations.push(operations[i]);
					}
					deferred.resolve();
				}
			});
			return deferred;
		},

		fetchTrades: function() {
			var self = this;
			var deferred = $.Deferred();
			var trades = new app.Collections.trades();
			trades.setAccountId(1);
			trades.deferreds = [];
			trades.fetch({
				success: function() {
					$.when.apply($, trades.deferreds).done(function() {
						trades = trades.toJSON();
						for(var i = 0; i < trades.length; i++) {
							self.trades.push(trades[i]);
						}
						deferred.resolve();
					});
				}
			});
			return deferred;
		},

		prepareObjects: function() {
			while(this.trades.length && this.trades[0].closed_at === 0) {
				this.objects.push(this.trades.shift());
			}
			while(this.operations.length && this.trades.length) {
				if(this.operations[0].created_at > this.trades[0].closed_at) {
					this.objects.push(this.operations.shift());
				} else {
					this.objects.push(this.trades.shift());
				}
			}
			while(this.operations.length) {
				this.objects.push(this.operations.shift());
			}
			while(this.trades.length) {
				this.objects.push(this.trades.shift());
			}
		},

		viewOperation: function(e) {
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var id = $wrapper.data('id');
			app.loadView('mainViewOperation', {
				id: id
			});
		},

		viewTrade: function() {
			app.loadView('mainViewTrade');
		}
	});
})();
