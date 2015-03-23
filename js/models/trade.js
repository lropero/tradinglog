(function() {
	'use strict';

	app.Models.trade = Backbone.Model.extend({
		dao: app.DAOs.trade,

		initialize: function() {
			this.deferred = $.Deferred();
			if(this.collection) {
				this.collection.deferreds.push(this.deferred);
			}
			this.positions = [];
			this.fetchInstrument();
			this.fetchPositions();
			this.fetchComments();
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
				id: this.get('instrument_id')
			});
			instrument.fetch({
				success: function() {
					self.instrument = instrument.toJSON().name;
					self.deferred.resolve();
				}
			});
		},

		fetchPositions: function() {
			// var self = this;
			// var positions = new app.Collections.positions();
			// positions.setTradeId(this.get('id'));
			// positions.fetch({
			// 	success: function() {
			// 		for(var i = 0; i < positions.length; i++) {
			// 			self.positions.push(positions.toJSON()[i]);
			// 		}
			// 	}
			// });
		},

		fetchComments: function() {
		},

		isOpen: function() {
			if(this.get('closed_at') === 0) {
				return true;
			}
			return false;
		},

		toJSON: function() {
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
			json.instrument = this.instrument;
			json.isOpen = this.isOpen();
			json.net = this.calculateNet();
			return json;
		}
	});
})();
