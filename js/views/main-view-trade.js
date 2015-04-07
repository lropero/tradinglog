(function() {
	'use strict';

	app.Views.mainViewTrade = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap li.button-swipe': 'button',
			'tap ul.wrapper-button-default li': 'add'
		},

		initialize: function(attrs) {
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
				self.render();
			});
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function() {
			var self = this;
			this.deferred.done(function() {
				app.trigger('change', 'main-view-trade');
				self.$el.html(self.template({
					trade: self.trade
				}));
				app.swipe.init('.swipe');
				setTimeout(function() {
					app.enableScroll();
				}, 10);
				return self;
			});
		},

		add: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var view = $target.data('view');
			app.loadView(view, {
				trade: this.trade
			});
		},

		button: function(e) {
			var self = this;
			e.preventDefault();
			var id = $(e.currentTarget).data('id');
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
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
					var comment = new app.Models.comment({
						id: id
					});
					comment.deferred.then(function() {
						comment.delete();
					});
				}
			});
		}
	});
})();
