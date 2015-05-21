(function() {
	'use strict';

	app.Models.instrument = Backbone.Model.extend({
		dao: app.DAOs.instrument,
		defaults: {
			type: 0,
			name: '',
			point_value: 1,
			commission: 0,
			alert: 0,
			group_id: 0,
			is_deleted: 0
		},
		validation: {
			name: {
				required: true
			},
			point_value: {
				gt: 0
			},
			commission: {
				min: 0
			}
		},

		initialize: function() {
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
		},

		delete: function() {
			this.destroy({
				success: function() {
					app.cache.delete('mainAddTrade');
				}
			});
		},

		getTypeName: function() {
			switch(this.get('type')) {
				case 1:
					return 'Future';
					break;
				case 2:
					return 'Stock';
					break;
				case 3:
					return 'Other';
					break;
			}
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			json.group = String.fromCharCode(this.get('group_id') + 65);
			json.typeName = this.getTypeName();
			return json;
		}
	});
})();
