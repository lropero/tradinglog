(function() {
	'use strict';

	app.Models.comment = Backbone.Model.extend({
		dao: app.DAOs.comment,
		validation: {
			body: {
				required: true
			}
		},

		initialize: function() {
			var self = this;
			this.deferred = $.Deferred();
			if(!this.isNew()) {
				this.fetch({
					success: function() {
						self.deferred.resolve();
					}
				});
			} else {
				this.listenTo(this, 'validated', function(isValid, model, errors) {
					if(!isValid) {
						$.each(errors, function(index, error) {
							var $el = $('#' + index);
							$el.addClass('error');
						});
					}
				});
			}
		},

		delete: function() {
			var self = this;
			this.deferred.done(function() {
				var trade_id = self.get('trade_id');
				var trade = new app.Models.trade({
					id: trade_id
				});
				trade.deferred.done(function() {
					trade.addToComments(-1, function() {
						self.destroy({
							success: function() {
								app.cache.delete('main');
								app.cache.delete('trade' + trade_id);
								app.loadView('mainViewTrade', {
									trade_id: trade_id
								});
							}
						});
					});
				});
			});
		}
	});
})();
