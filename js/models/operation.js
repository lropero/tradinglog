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
			this.listenTo(this, 'validated', function(isValid, model, errors) {
				$('input').each(function(index, el) {
					var $el = $(el);
					if($el.hasClass('error')) {
						$el.removeClass('error');
						var $price = $el.parent('div.price');
						if($price) {
							$price.removeClass('error');
						}
					}
				});
				if(!isValid) {
					$.each(errors, function(index, error) {
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
	});
})();
