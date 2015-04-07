<script type="text/x-handlebars-template" id="main-view-trade-template">
	<ul>
		<li class="wrapper-label">
			<div class="label trade {{#if trade.isLong}}long{{else}}short{{/if}} {{#if trade.isOpen}}open {{/if}}full">
				<div class="ball">
					<div class="icon"></div>
				</div>
				<div class="row">
					<div class="instrument">{{trade.instrument}}</div>
					<div class="net {{#gt trade.net 0}}positive{{else}}negative{{/gt}}">{{#if trade.net}}{{#money trade.net}}{{/money}}{{/if}}</div>
				</div>
				<div class="row">
					<div class="{{#if trade.isOpen}}size-price{{else}}date{{/if}}">{{#if trade.isOpen}}{{trade.sizePrice}}{{else}}{{#date trade.closed_at}}{{/date}}{{/if}}</div>
					{{#if trade.variation}}
						<div class="variation">{{#variation trade.variation}}{{/variation}}</div>
					{{/if}}
				</div>
			</div>
		</li>
	</ul>
	<ul class="wrapper-button-default {{#if trade.isOpen}}two{{else}}one{{/if}}-button-default">
		{{#if trade.isOpen}}
			<li class="button-default" data-view="mainAddPosition">Add position</li>
		{{/if}}
		<li class="button-default" data-view="mainAddComment">Add comment</li>
	</ul>
	<section id="content">
		<ul>
			{{#each trade.objects}}
				<li class="wrapper-label">
					{{#if this.size}}
						<div class="label comment {{#gt this.size 0}}buy{{else}}sell{{/gt}}">
							<div class="ball"></div>
							<div class="row">
								<div class="size-price">{{this.sizePrice}}</div>
							</div>
							<div class="row">
								<div class="date">{{#date this.created_at}}{{/date}} - {{#time this.created_at}}{{/time}}</div>
							</div>
						</div>
					{{else}}
						<div class="label comment commentary swipe">
							<div class="ball"></div>
							<div class="row">
								<div class="body">{{#nl2br this.body}}{{/nl2br}}</div>
							</div>
							<div class="row">
								<div class="date">{{#date this.created_at}}{{/date}} - {{#time this.created_at}}{{/time}}</div>
							</div>
						</div>
						<div class="wrapper-swipe">
							<div class="swipe-buttons">
								<ul>
									<li class="button-swipe delete"></li>
									<li class="button-swipe add-photo"></li>
								</ul>
							</div>
						</div>
					{{/if}}
				</li>
			{{/each}}
		</ul>
	</section>
</script>
