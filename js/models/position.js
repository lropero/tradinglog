(function() {
	'use strict';

	app.Models.position = Backbone.Model.extend({
		dao: app.DAOs.position,
		defaults: {
			trade_id: 0,
			size: 0,
			price: 0,
			created_at: 0
		},
		validation: {
			size: {
				nat: 0
			},
			price: {
				gt: 0
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
