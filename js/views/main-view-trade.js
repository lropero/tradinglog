(function() {
	'use strict';

	app.Views.mainViewTrade = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap li.button-swipe.delete': 'buttonDelete',
			'tap ul.wrapper-button-default li': 'add'
		},

		initialize: function(attrs, cache) {
			var self = this;
			this.deferred = $.Deferred();
			if(attrs.trade) {
				this.trade = attrs.trade;
				this.deferred.resolve();
			} else if(attrs.trade_id) {
				this.trade = new app.Models.trade({
					id: attrs.trade_id
				});
				this.deferred = this.trade.deferred;
				this.deferred.then(function() {
					self.trade = self.trade.toJSON();
				});
			}
			app.templateLoader.get('main-view-trade').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render(cache);
			});
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function(cache) {
			var self = this;
			this.deferred.done(function() {
				var template = app.cache.get('trade' + self.trade.id, self.template, {
					trade: self.trade
				});
				if(typeof cache !== 'boolean') {
					app.trigger('change', 'main-view-trade');
					self.$el.html(template);
					app.swipe.init('.swipe');
					setTimeout(function() {
						app.enableScroll();
					}, 10);
				} else {
					self.undelegateEvents();
				}
			});
			return this;
		},

		add: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var view = $target.data('view');
			app.loadView(view, {
				trade: this.trade
			});
		},

		buttonDelete: function(e) {
			var self = this;
			e.preventDefault();
			var id = $(e.currentTarget).data('id');
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			var $label = $wrapper.children('div');
			var object = $label.hasClass('comment') ? 'comment' : ($label.hasClass('position') ? 'position' : '');
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
						case 'comment':
							var comment = new app.Models.comment({
								id: id
							});
							comment.delete();
							break;
						case 'position':
							var position = new app.Models.position({
								id: id
							});
							position.delete();
							break;
					}
				}
			});
		}
	});
})();
