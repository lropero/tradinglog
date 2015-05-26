(function() {
	'use strict';

	app.Views.mainViewTrade = Backbone.View.extend({
		el: 'section#main-stats-friends',
		events: {
			'tap li.button-swipe.delete': 'buttonDelete',
			'tap ul.wrapper-button-default li': 'add'
		},

		initialize: function(attrs) {
			this.cache = false;
			if(attrs.cache) {
				this.cache = true;
			} else {
				this.key = attrs.key.toString();
				this.trade = app.objects[this.key];
				this.top = attrs.top;
			}
			this.template = Handlebars.compile(app.templateLoader.get('main-view-trade'));
			this.render();
		},

		destroy: function() {
			this.undelegateEvents();
		},

		render: function() {
			var self = this;
			var deferred = app.cache.get('mainViewTrade', this.template);
			deferred.then(function(html) {
				if(!self.cache) {
					app.trigger('change', 'main-view-trade', {
						key: self.key,
						top: self.top
					});
					self.$el.html(html);

					var $info = $('div#info');
					var $label = $('div.label');
					var $net = $('div.net');
					if(self.trade.isLong) {
						$label.addClass('long');
					} else {
						$label.addClass('short');
					}
					if(self.trade.isOpen) {
						$('div.globe-commission').hide();
						$('li#edit-commission').remove();
						$info.addClass('size-price');
						$info.html(self.trade.sizePrice);
						$label.addClass('open');
						if(self.trade.hasClosedPositions) {
							$net.html('$ ' + accounting.formatMoney(self.trade.net, ''));
						}
					} else {
						$('div.variation').html(accounting.toFixed(self.trade.variation, 2) + '%');
						$('li#add-position').remove();
						$info.addClass('date');
						$info.html(app.date.toDate(self.trade.closed_at));
						$net.html('$ ' + accounting.formatMoney(self.trade.net, ''));
						if(!self.trade.edit_commission) {
							$('div.globe-commission').hide();
						}
					}
					$('div.instrument').html(self.trade.instrument);
					if(self.trade.net > 0) {
						$net.addClass('positive');
					} else if(self.trade.net < 0) {
						$net.addClass('negative');
					} else {
						$net.addClass('zero');
					}
					var swipe = true;
					if(!self.trade.isOpen) {
						for(var i = 0; i < app.count.open; i++) {
							if(app.objects[i].instrument_id === self.trade.instrument_id) {
								swipe = false;
								break;
							}
						}
					}
					var $ul = $('section#content ul');
					for(var i = 0; i < self.trade.objects.length; i++) {
						var object = self.trade.objects[i];
						if(object.size) {
							var li = '<li class="wrapper-label"';
							if((self.trade.isOpen || self.trade.isNewest) && swipe) {
								if(object.last && self.trade.positions > 1) {
									li += 'data-swipe="1"';
								}
							}
							li += '><div class="label position ';
							if(object.size > 0) {
								li += 'buy';
							} else {
								li += 'sell';
							}
							if((self.trade.isOpen || self.trade.isNewest) && swipe) {
								if(object.last && self.trade.positions > 1) {
									li += ' swipe';
								}
							}
							li += '"><div class="ball"></div><div class="row"><div class="size-price">' + object.sizePrice + '</div></div><div class="row"><div class="date">' + app.date.toDate(object.created_at) + ' - ' + app.date.toTime(object.created_at) + '</div></div>';
							if((self.trade.isOpen || self.trade.isNewest) && swipe) {
								if(object.last && self.trade.positions > 1) {
									li += '<div class="swipe-triangle"></div>';
								}
							}
							li += '</div>';
							if((self.trade.isOpen || self.trade.isNewest) && swipe) {
								if(object.last && self.trade.positions > 1) {
									li += '<div class="wrapper-swipe"><div class="swipe-buttons"><ul><li class="button-swipe delete" data-id="' + object.id + '"></li></ul></div></div>';
								}
							}
							li += '</li>';
						} else {
							var li = '<li class="wrapper-label" data-swipe="1"><div class="label comment swipe"><div class="ball"></div><div class="row"><div class="body">' + object.body.replace(/(\r\n|\n\r|\r|\n)/g, '<br />') + '</div></div><div class="row"><div class="date">' + app.date.toDate(object.created_at) + ' - ' + app.date.toTime(object.created_at) + '</div></div><div class="swipe-triangle"></div></div><div class="wrapper-swipe"><div class="swipe-buttons"><ul><li class="button-swipe delete" data-id="' + object.id + '"></li></ul></div></div></li>';
						}
						$ul.append(li);
					}
					$('div#view').show();

					app.swipe.init('.swipe');
					setTimeout(function() {
						app.enableScroll();
					}, 10);
				} else {
					setTimeout(function() {
						self.undelegateEvents();
					}, 10);
				}
			});
			return this;
		},

		add: function(e) {
			e.preventDefault();
			var $target = $(e.currentTarget);
			var view = $target.data('view');
			app.loadView(view, {
				key: this.key,
				top: this.top
			});
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
				var $alertify = $('section#alertify');
				$alertify.hide();
				setTimeout(function() {
					if($('div#alertify-cover').is(':hidden')) {
						$alertify.show();
					}
				}, 100);
				if(e) {
					$wrapper.hide();
					var $label = $wrapper.children('div');
					var object = $label.hasClass('comment') ? 'comment' : ($label.hasClass('position') ? 'position' : '');
					switch(object) {
						case 'comment':
							var comments = new app.Collections.comments();
							comments.setFetchId(id);
							comments.fetch({
								success: function() {
									var comment = comments.at(0);
									comment.delete(function() {
										var trades = new app.Collections.trades();
										trades.setFetchId(self.trade.id);
										trades.fetch({
											success: function() {
												var trade = trades.at(0);
												trade.deferred.then(function() {
													trade.addToComments(-1, function() {
														app.objects[self.key] = trade.toJSON();
														app.storeCache().done(function() {
															app.loadView('mainViewTrade', {
																key: self.key,
																top: self.top
															}, function() {
																app.cache.delete('main');
															});
														});
													});
												});
											}
										});
									});
								}
							});
							break;
						case 'position':
							$('div#top').hide();
							$('div#loading').show();
							var positions = new app.Collections.positions();
							positions.setFetchId(id);
							positions.fetch({
								success: function() {
									var position = positions.at(0);
									position.delete(function(size) {
										var trades = new app.Collections.trades();
										trades.setFetchId(self.trade.id);
										trades.fetch({
											success: function() {
												var trade = trades.at(0);
												trade.deferred.then(function() {
													if((self.trade.type === 1 && size < 0) || (self.trade.type === 2 && size > 0)) {
														if(trade.get('closed_at')) {
															trade.setPnL(function() {
																var key = 0;
																for(var i = 0; i < app.count.open; i++) {
																	if(app.objects[i].id > self.trade.id) {
																		key++;
																	} else {
																		break;
																	}
																}
																app.objects[app.count.open].isNewest = false;
																app.count.open++;
																app.objects.splice(self.key, 1);
																app.count.closed--;
																app.objects.splice(key, 0, trade.toJSON());
																if(!(!app.count.closed && app.count.operations === 1)) {
																	app.objects[app.count.open].isNewest = true;
																}
																app.storeCache().done(function() {
																	app.cache.delete('main');
																	app.cache.delete('mainMap');
																	app.loadView('mainViewTrade', {
																		key: key,
																		top: self.top
																	});
																});
															});
														} else {
															trade.setPnL(function() {
																app.objects[self.key] = trade.toJSON();
																app.storeCache().done(function() {
																	app.cache.delete('main');
																	app.loadView('mainViewTrade', {
																		key: self.key,
																		top: self.top
																	});
																});
															});
														}
													} else {
														app.objects[self.key] = trade.toJSON();
														app.storeCache().done(function() {
															app.cache.delete('main');
															app.loadView('mainViewTrade', {
																key: self.key,
																top: self.top
															});
														});
													}
												});
											}
										});
									});
								}
							});
							break;
					}
				}
			});
		}
	});
})();
