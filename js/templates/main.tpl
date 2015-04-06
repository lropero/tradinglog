<script type="text/x-handlebars-template" id="main-template">
	<section id="content">
		<ul>
			{{#each objects}}
				{{#if this.instrument}}
					<li class="wrapper-label" data-key="{{@key}}" data-swipe="1">
						<div class="label trade {{#if this.isLong}}long{{else}}short{{/if}} {{#if this.isOpen}}open {{/if}}swipe">
							<div class="ball">
								{{#if this.comments}}
									<div class="globe-comments">{{this.comments}}</div>
								{{/if}}
								<div class="icon"></div>
							</div>
							<div class="row">
								<div class="instrument">{{this.instrument}}</div>
								<div class="net {{#gt this.net 0}}positive{{else}}negative{{/gt}}">{{#if this.net}}{{#money this.net}}{{/money}}{{/if}}</div>
							</div>
							<div class="row">
								<div class="{{#if this.isOpen}}size-price{{else}}date{{/if}}">{{#if this.isOpen}}{{this.sizePrice}}{{else}}{{#date this.closed_at}}{{/date}}{{/if}}</div>
							</div>
						</div>
						<div class="wrapper-swipe">
							<div class="swipe-buttons">
								<ul>
									<li class="button-swipe {{#if this.isOpen}}delete{{else}}commission{{/if}}" data-id="{{this.id}}"></li>
								</ul>
							</div>
						</div>
					</li>
				{{else}}
					<li class="wrapper-label" data-key="{{@key}}">
						<div class="label operation {{#gt this.amount 0}}deposit{{else}}withdraw{{/gt}}{{#unless this.description.length}} no-click{{/unless}}">
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
						</div>
					</li>
				{{/if}}
			{{/each}}
		</ul>
	</section>
</script>
