<section id="content">
	<ul>
		{{#each objects}}
			{{#if this.instrument}}
				<li class="wrapper-label" data-key="{{@key}}"{{#if this.isOpen}} data-swipe="1"{{/if}}>
					<div class="label trade {{#if this.isLong}}long{{else}}short{{/if}}{{#if this.isOpen}} open swipe{{/if}}"{{#unless this.isOpen}} data-net="{{this.net}}"{{else}}{{#if this.net}} data-net="{{this.net}}"{{/if}}{{/unless}}>
						<div class="ball">
							{{#if this.comments}}
								<div class="globe-comments">{{this.comments}}</div>
							{{/if}}
							{{#if this.edit_commission}}
								<div class="globe-commission"></div>
							{{/if}}
							<div class="icon"></div>
						</div>
						<div class="row">
							<div class="instrument">{{this.instrument}}</div>
							<div class="net {{#gt this.net 0}}positive{{else}}{{#lt this.net 0}}negative{{else}}zero{{/lt}}{{/gt}}">{{#unless this.isOpen}}{{#money this.net}}{{/money}}{{else}}{{#if this.hasClosedPositions}}{{#money this.net}}{{/money}}{{/if}}{{/unless}}</div>
						</div>
						<div class="row">
							<div class="{{#if this.isOpen}}size-price{{else}}date{{/if}}">{{#if this.isOpen}}{{this.sizePrice}}{{else}}{{#date this.closed_at}}{{/date}}{{/if}}</div>
							{{#if this.variation}}
								<div class="variation">{{#variation this.variation}}{{/variation}}</div>
							{{/if}}
						</div>
						{{#if this.isOpen}}
							<div class="swipe-triangle"></div>
						{{/if}}
					</div>
					{{#if this.isOpen}}
						<div class="wrapper-swipe">
							<div class="swipe-buttons">
								<ul>
									<li class="button-swipe delete" data-id="{{this.id}}"></li>
								</ul>
							</div>
						</div>
					{{/if}}
				</li>
			{{else}}
				<li class="wrapper-label" data-key="{{@key}}"{{#if this.isNewest}} data-swipe="1"{{/if}}>
					<div class="label operation {{#gt this.amount 0}}deposit{{else}}withdraw{{/gt}}{{#unless this.description.length}} no-click{{/unless}}{{#if this.isNewest}} swipe{{/if}}" data-net="{{this.amount}}">
						<div class="ball">
							<div class="icon"></div>
						</div>
						<div class="row">
							<div class="instrument">{{#gt this.amount 0}}Deposit{{else}}Withdraw{{/gt}}</div>
							<div class="net {{#gt this.amount 0}}positive{{else}}negative{{/gt}}">{{#money this.amount}}{{/money}}</div>
						</div>
						<div class="row">
							<div class="date">{{#date this.created_at}}{{/date}}</div>
							{{#if this.variation}}
								<div class="variation">{{#variation this.variation}}{{/variation}}</div>
							{{/if}}
						</div>
						{{#if this.isNewest}}
							<div class="swipe-triangle"></div>
						{{/if}}
					</div>
					{{#if this.isNewest}}
						<div class="wrapper-swipe">
							<div class="swipe-buttons">
								<ul>
									<li class="button-swipe delete" data-id="{{this.id}}"></li>
								</ul>
							</div>
						</div>
					{{/if}}
				</li>
			{{/if}}
		{{/each}}
	</ul>
</section>
