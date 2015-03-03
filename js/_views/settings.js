(function() {
	'use strict';

	app.Views.settings = Backbone.View.extend({
		events: {
			'click li:not(.active)': 'switch'
		},
		initialize: function(subview) {
			if(typeof subview === 'undefined') {
				subview = 'Instruments';
			}
			this.subview = subview;
			var self = this;
			app.Helpers.templateLoader.get('settings', function(template) {
				self.template = _.template(template);
				self.render();
			});
		},
		render: function() {
			this.$el.html(this.template());
			$('#settings').empty().append(this.$el);
			this.content = new app.Views['settings' + this.subview]();
			return this;
		},
		switch: function(e) {
			this.$el.find('li.active').removeClass('active');
			var target = $(e.currentTarget);
			target.addClass('active');
			this.subview = target.data('subview');
			this.content = new app.Views['settings' + this.subview]();
		}
	});
})();
