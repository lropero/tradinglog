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
			var self = this;
			this.deferred = $.Deferred();
			if(!this.isNew()) {
				this.fetch({
					success: function() {
						self.deferred.resolve();
					}
				});
			}
			this.listenTo(this, 'validated', function(isValid, model, errors) {
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
		},

		delete: function() {
			var self = this;
			this.deferred.done(function() {
				self.destroy({
					success: function() {
						app.cache.delete('mainAddTrade');
					}
				});
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
