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
			this.key = attrs.key;
			this.top = attrs.top;
			this.trade = app.objects[this.key];
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
				key: this.key,
				top: this.top
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

			// var created_at = (new Date()).getTime();

			// Remove & uncomment previous line
			app.timestamp += Math.floor(Math.random() * 432000000);
			var created_at = app.timestamp;

			var comment = new app.Models.comment();
			comment.set({
				trade_id: this.trade.id,
				body: body,
				created_at: created_at
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
										app.loadView('mainViewTrade', {
											key: self.key,
											top: self.top
										}, function() {
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
