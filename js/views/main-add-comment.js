(function() {
	'use strict';

	app.Views.mainAddComment = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap div#done': 'combine',
			'tap textarea': 'isolate'
		},

		initialize: function(key) {
			var self = this;
			this.key = key;
			this.trade = app.objects[key];
			app.submit = function() {
				self.submit();
			}
			this.template = Handlebars.compile(app.templateLoader.get('main-add-comment'));
			this.render();
		},

		destroy: function() {
			delete app.submit;
			this.undelegateEvents();
		},

		render: function() {
			app.trigger('change', 'main-add-comment', {
				key: this.key
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
			comment.validate();
			if(comment.isValid()) {
				$('header button').hide();
				comment.save(null, {
					success: function() {
						var trades = new app.Collections.trades();
						trades.setFetchId(self.trade.id);
						trades.fetch({
							success: function() {
								var trade = trades.at(0);
								trade.deferred.then(function() {
									trade.addToComments(1, function() {
										app.objects[self.key] = trade.toJSON();
										app.cache.delete('main');
										app.cache.delete('mainViewTrade' + self.trade.id).done(function() {
											app.loadView('mainViewTrade', self.key);
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
