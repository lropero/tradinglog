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
						callback(self.get('size'));
					}
				}
			});
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			json.sizePrice = Math.abs(this.get('size')) + ' @ ' + accounting.formatMoney(this.get('price'), '');
			return json;
		}
	});
})();
