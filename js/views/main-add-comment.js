(function() {
	'use strict';

	app.Views.mainAddComment = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div#done': 'combine',
			'tap textarea': 'isolate'
		},

		initialize: function(attrs) {
			var self = this;
			this.trade = attrs.trade;
			app.submit = function() {
				self.submit();
			}
			app.templateLoader.get('main-add-comment').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render();
			});
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'main-add-comment', {
				trade: this.trade
			});
			this.$el.html(this.template());
			return this;
		},

		combine: function(e) {
			e.preventDefault();
			app.combine();
		},

		isolate: function(e) {
			e.preventDefault();
			app.isolate(e);
		},

		submit: function() {
			var self = this;
			var body = this.$el.find('textarea#body').val().trim();
			var comment = new app.Models.comment();
			comment.set({
				trade_id: this.trade.id,
				body: body,
				created_at: (new Date()).getTime()
			});
			comment.save(null, {
				success: function() {
					app.headerNavigation.update({});
					var trade = new app.Models.trade({
						id: self.trade.id
					});
					trade.deferred.then(function() {
						trade.addToComments(1, function() {
							var isFirst = self.trade.isFirst ? self.trade.isFirst : false;
							app.cache.delete('main');
							app.cache.delete('trade' + self.trade.id);
							app.loadView('mainViewTrade', {
								trade_id: self.trade.id,
								isFirst: self.trade.isFirst
							});
						});
					});
				}
			})
		}
	});
})();
