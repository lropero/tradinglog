(function() {
	'use strict';

	app.Models.trade = Backbone.Model.extend({
		dao: app.DAOs.trade,
		initialize: function() {
			this.deferred = $.Deferred();
			if(this.collection) {
				this.collection.deferreds.push(this.deferred);
			}
			this.fetchInstrument();
		},
		calculateGross: function() {
			var gross = this.get('profit') - this.get('loss');
			return gross;
		},
		calculateNet: function() {
			var net = this.calculateGross() - this.get('commission');
			return net;

		},
		fetchInstrument: function() {
			var self = this;
			var instrument = new app.Models.instrument({
				id: self.get('instrument_id')
			});
			instrument.fetch({
				success: function() {
					self.instrument = instrument.toJSON().name;
					self.deferred.resolve();
				}
			});
		},
		toJSON: function() {
			var self = this;
			var json = Backbone.Model.prototype.toJSON.apply(self, arguments);
			json.instrument = self.instrument;
			json.net = self.calculateNet();
			return json;
		}
	});
})();
