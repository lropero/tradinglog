(function() {
	'use strict';

	app.Views.mainViewTrade = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap li.button-swipe.delete': 'buttonDelete',
			'tap ul.wrapper-button-default li': 'add'
		},

		initialize: function(key, cache) {
			var self = this;
			this.key = key;
			this.trade = app.objects[key];
			app.templateLoader.get('main-view-trade').done(function(template) {
				self.template = Handlebars.compile($(template).html().trim());
				self.render(cache);
			});
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function(cache) {
			var self = this;
			var template = app.cache.get('mainViewTrade' + this.trade.id, this.template, {
				trade: this.trade
			});
			if(typeof cache !== 'boolean') {
				app.trigger('change', 'main-view-trade');
				this.$el.html(template);
				app.swipe.init('.swipe');
				setTimeout(function() {
					app.enableScroll();
				}, 10);
			} else {
				setTimeout(function() {
					self.undelegateEvents();
				}, 10);
			}
			return this;
		},

		add: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var view = $target.data('view');
			app.loadView(view, this.key);
		},

		buttonDelete: function(e) {
			var self = this;
			e.preventDefault();
			var id = $(e.currentTarget).data('id');
			var $wrapper = $(e.currentTarget).parents('.wrapper-label');
			alertify.set({
				buttonFocus: 'none',
				buttonReverse: true,
				labels: {
					cancel: 'No',
					ok: 'Yes'
				}
			});
			alertify.confirm('Are you sure?', function(e) {
				$('section#alertify').hide();
				setTimeout(function() {
					if($('div#alertify-cover').is(':hidden')) {
						$('section#alertify').show();
					}
				}, 100);
				if(e) {
					$wrapper.hide();
					var $label = $wrapper.children('div');
					var object = $label.hasClass('comment') ? 'comment' : ($label.hasClass('position') ? 'position' : '');
					switch(object) {
						case 'comment':
							var comment = new app.Models.comment({
								id: id
							});
							comment.delete(function() {
								var trade = new app.Models.trade({
									id: self.trade.id
								});
								trade.deferred.then(function() {
									trade.addToComments(-1, function() {
										app.objects[self.key] = trade.toJSON();
										app.cache.delete('main');
										app.cache.delete('mainViewTrade' + self.trade.id);
										app.loadView('mainViewTrade', self.key);
									});
								});
							});
							break;
						case 'position':
							$('div#top').hide();
							$('div#loading').show();
							var position = new app.Models.position({
								id: id
							});
							position.delete(function(size) {
								var trade = new app.Models.trade({
									id: self.trade.id
								});
								trade.deferred.then(function() {
									if((self.trade.type === 1 && size < 0) || (self.trade.type === 2 && size > 0)) {
										trade.setPnL(function() {
											var key = 0;
											for(var i = 0; i < app.count.open; i++) {
												if(app.objects[i].id > self.trade.id) {
													key++;
												} else {
													break;
												}
											}
											app.objects[app.count.open].isFirst = false;
											app.count.open++;
											app.objects.splice(self.key, 1);
											app.count.closed--;
											app.objects.splice(key, 0, trade.toJSON());
											if(!(!app.count.closed && app.count.operations === 1)) {
												app.objects[app.count.open].isFirst = true;
											}
											app.cache.delete('main');
											app.cache.delete('mainMap');
											app.cache.delete('mainViewTrade' + app.objects[app.count.open].id);
											app.cache.delete('mainViewTrade' + self.trade.id);
											app.loadView('mainViewTrade', key.toString());
										});
									} else {
										app.objects[self.key] = trade.toJSON();
										app.cache.delete('main');
										app.cache.delete('mainViewTrade' + self.trade.id);
										app.loadView('mainViewTrade', self.key);
									}
								});
							});
							break;
					}
				}
			});
		}
	});
})();
