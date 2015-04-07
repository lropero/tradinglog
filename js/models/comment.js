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
			var trade = new app.Models.trade({
				id: this.get('trade_id')
			});
			trade.deferred.then(function() {
				trade.addToComments(-1, function() {
					app.trigger('clear');
					self.destroy();
				});
			});
		}
	});
})();
