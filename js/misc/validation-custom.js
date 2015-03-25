(function() {
	'use strict';

	_.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

	_.extend(Backbone.Validation.validators, {
		gt: function(value, attr, customValue, model) {
			if(!(value > customValue)) {
				return 'error';
			}
		}
	});
})();
