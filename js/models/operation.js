(function() {
	'use strict';

	app.Models.operation = Backbone.Model.extend({
		dao: app.DAOs.operation,
		defaults: {
			account_id: 0,
			amount: 0,
			description: '',
			variation: 0,
			created_at: 0
		},
		validation: {
			amount: {
				not: 0
			}
		},

		initialize: function() {
			if(this.isNew()) {
				this.listenTo(this, 'validated', function(isValid, model, errors) {
					if(!isValid) {
						$.each(errors, function(index) {
							var $el = $('#' + index);
							$el.addClass('error');
							var $price = $el.parent('div.price');
							if($price) {
								$price.addClass('error');
							}
						});
					}
				});
			}
		},

		delete: function(callback) {
			var self = this;
			this.destroy({
				success: function() {
					if(typeof callback === 'function') {
						callback(self.get('amount'));
					}
				}
			});
		}
	});
})();
