(function() {
	'use strict';

	Backbone.sync = function(method, model, options) {
		var dao = new model.dao();
		switch(method) {
			case 'read':
				if(model.id) {
					dao.find(model, function(data) {
						options.success(data);
					});
				} else if(model.account_id || model.trade_id) {
					dao.findSet(model, function(data) {
						options.success(data);
					});
				} else {
					dao.findAll(function(data) {
						options.success(data);
					});
				}
				break;
			case 'create':
				dao.create(model, function(data) {
					options.success(data);
				});
				break;
			case 'update':
				dao.update(model, function(data) {
					options.success(data);
				});
				break;
			case 'delete':
				dao.destroy(model, function(data) {
					options.success(data);
				});
				break;
		}
	};
})();
