<section id="content">
	<ul>
		{{#each trade.objects}}
			{{#if this.size}}
				<li class="wrapper-label"{{#or ../../trade.isOpen ../../trade.isNewest}}{{#if this.last}}{{#gt ../../../../trade.positions 1}} data-swipe="1"{{/gt}}{{/if}}{{/or}}>
					<div class="label position {{#gt this.size 0}}buy{{else}}sell{{/gt}}{{#or ../../trade.isOpen ../../trade.isNewest}}{{#if this.last}}{{#gt ../../../../trade.positions 1}} swipe{{/gt}}{{/if}}{{/or}}">
						<div class="ball"></div>
						<div class="row">
							<div class="size-price">{{this.sizePrice}}</div>
						</div>
						<div class="row">
							<div class="date">{{#date this.created_at}}{{/date}} - {{#time this.created_at}}{{/time}}</div>
						</div>
						{{#or ../../trade.isOpen ../../trade.isNewest}}
							{{#if this.last}}
								{{#gt ../../../../trade.positions 1}}
									<div class="swipe-triangle"></div>
								{{/gt}}
							{{/if}}
						{{/or}}
					</div>
					{{#or ../../trade.isOpen ../../trade.isNewest}}
						{{#if this.last}}
							{{#gt ../../../../trade.positions 1}}
								<div class="wrapper-swipe">
									<div class="swipe-buttons">
										<ul>
											<li class="button-swipe delete" data-id="{{this.id}}"></li>
										</ul>
									</div>
								</div>
							{{/gt}}
						{{/if}}
					{{/or}}
				</li>
			{{else}}
				<li class="wrapper-label" data-swipe="1">
					<div class="label comment swipe">
						<div class="ball"></div>
						<div class="row">
							<div class="body">{{#nl2br this.body}}{{/nl2br}}</div>
						</div>
						<div class="row">
							<div class="date">{{#date this.created_at}}{{/date}} - {{#time this.created_at}}{{/time}}</div>
						</div>
						<div class="swipe-triangle"></div>
					</div>
					<div class="wrapper-swipe">
						<div class="swipe-buttons">
							<ul>
								<li class="button-swipe delete" data-id="{{this.id}}"></li>
							</ul>
						</div>
					</div>
				</li>
			{{/if}}
		{{/each}}
	</ul>
</section>