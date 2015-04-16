(function() {
	'use strict';

	app.Views.main = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div.operation:not(.no-click):not(.swiped)': 'viewOperation',
			'tap div.trade:not(.swiped)': 'viewTrade',
			'tap li.button-swipe.delete': 'buttonDelete'
		},

		initialize: function(cache, fromDelete) {
			var self = this;
			this.deferred = $.Deferred();
			this.operations = [];
			this.trades = [];
			$.when(
				this.fetchOperations(),
				this.fetchTrades()
			).done(function() {
				self.count = {
					open: 0,
					closed: 0,
					operations: 0
				};
				self.objects = [];
				self.prepareObjects(cache, fromDelete);
				self.deferred.resolve();
			});
			app.templateLoader.get('main').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render(cache);
			});
		},

		destroy: function() {
			this.drag.destroy();
			this.undelegateEvents();
		},

		render: function(cache) {
			var self = this;
			this.deferred.done(function() {
				var template = app.cache.get('main', self.template, {
					objects: self.objects
				});
				if(typeof cache !== 'boolean') {
					app.trigger('change', 'main', {
						closed: self.count.closed
					});
					self.$el.html(template);
					self.decorate();
				} else {
					self.undelegateEvents();
				}
			});
			return this;
		},

		buttonDelete: function(e) {
			var self = this;
			e.preventDefault();
			var id = $(e.currentTarget).data('id');
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var $label = $wrapper.children('div');
			var object = $label.hasClass('operation') ? 'operation' : ($label.hasClass('trade') ? 'trade' : '');
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
					$wrapper.hide();
					switch(object) {
						case 'operation':
							var operation = new app.Models.operation({
								id: id
							});
							operation.delete();
							break;
						case 'trade':
							var trade = new app.Models.trade({
								id: id
							});
							trade.delete();
							break;
					}
					self.decorate();
				}
			});
		},

		decorate: function() {
			this.drag = new app.Views.mainDrag();
			app.swipe.init('.swipe');
			var $content = $('section#content');
			var $ul = $('section#content').children('ul');
			if($content.height() > $ul.height()) {
				$ul.append('<li style="background: #ffffff; height: ' + ($content.height() - $ul.height() + 5) + 'px; width: 100%;"></li>');
				setTimeout(function() {
					app.enableScroll();
				}, 10);
			} else {
				app.enableScroll();
			}
		},

		fetchOperations: function() {
			var self = this;
			var deferred = $.Deferred();
			var operations = new app.Collections.operations();
			operations.setAccountId(app.account.get('id'));
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
			trades.setAccountId(app.account.get('id'));
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

		prepareObjects: function(cache, fromDelete) {
			while(this.trades.length && this.trades[0].closed_at === 0) {
				this.objects.push(this.trades.shift());
				this.count.open++;
			}
			while(this.operations.length && this.trades.length) {
				if(this.operations[0].created_at > this.trades[0].closed_at) {
					this.objects.push(this.operations.shift());
					this.count.operations++;
				} else {
					this.objects.push(this.trades.shift());
					this.count.closed++;
				}
			}
			while(this.operations.length) {
				this.objects.push(this.operations.shift());
				this.count.operations++;
			}
			while(this.trades.length) {
				this.objects.push(this.trades.shift());
				this.count.closed++;
			}
			if(!(!this.count.closed && this.count.operations === 1)) {
				this.objects[this.count.open].isFirst = true;
				if(typeof this.objects[this.count.open].instrument_id === 'undefined') {
					if(app.firstTrade) {
						app.cache.delete('mainViewTrade' + app.firstTrade);
						delete(app.firstTrade);
					}
				} else if(app.firstTrade !== this.objects[this.count.open].id) {
					if(app.firstTrade) {
						app.cache.delete('mainViewTrade' + app.firstTrade);
					}
					if(typeof cache !== 'boolean' || fromDelete) {
						app.cache.delete('mainViewTrade' + this.objects[this.count.open].id);
					}
					app.firstTrade = this.objects[this.count.open].id;
				}
			}
		},

		viewOperation: function(e) {
			e.preventDefault();
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var key = $wrapper.data('key');
			app.loadView('mainViewOperation', {
				operation: this.objects[key]
			});
		},

		viewTrade: function(e) {
			e.preventDefault();
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var $label = $($wrapper.context);
			var isOpen = $label.hasClass('open');
			if(!isOpen) {
				$label.css('backgroundColor', '#dadada');
			}
			var key = $wrapper.data('key');
			app.loadView('mainViewTrade', {
				trade: this.objects[key]
			});
		}
	});
})();
