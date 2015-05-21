<div id="loading"><span></span></div>
<div id="top">
	<ul>
		<li class="wrapper-label">
			<div class="label trade {{#if trade.isLong}}long{{else}}short{{/if}} {{#if trade.isOpen}}open {{/if}}full">
				<div class="ball">
					{{#if trade.edit_commission}}
						<div class="globe-commission"></div>
					{{/if}}
					<div class="icon"></div>
				</div>
				<div class="row">
					<div class="instrument">{{trade.instrument}}</div>
					<div class="net {{#gt trade.net 0}}positive{{else}}{{#lt trade.net 0}}negative{{else}}zero{{/lt}}{{/gt}}">{{#unless trade.isOpen}}{{#money trade.net}}{{/money}}{{else}}{{#if trade.hasClosedPositions}}{{#money trade.net}}{{/money}}{{/if}}{{/unless}}</div>
				</div>
				<div class="row">
					<div class="{{#if trade.isOpen}}size-price{{else}}date{{/if}}">{{#if trade.isOpen}}{{trade.sizePrice}}{{else}}{{#date trade.closed_at}}{{/date}}{{/if}}</div>
					{{#unless trade.isOpen}}
						<div class="variation">{{#variation trade.variation}}{{/variation}}</div>
					{{/unless}}
				</div>
			</div>
		</li>
	</ul>
	<ul class="wrapper-button-default two-button-default">
		{{#if trade.isOpen}}
			<li class="button-default" data-view="mainAddPosition">Add position</li>
		{{else}}
			<li class="button-default" data-view="mainEditCommission">Edit commission</li>
		{{/if}}
		<li class="button-default" data-view="mainAddComment">Add comment</li>
	</ul>
</div>
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
