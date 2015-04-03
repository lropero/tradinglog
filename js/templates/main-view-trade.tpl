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
					<div class="{{#if trade.isOpen}}size-price{{else}}date{{/if}}">{{#if trade.isOpen}}{{trade.sizePrice}}{{else}}date{{/if}}</div>
				</div>
			</div>
		</li>
	</ul>
	<ul class="wrapper-button-default two-button-default">
		<li class="button-default">Add position</li>
		<li class="button-default">Add comment</li>
	</ul>
	<ul>
		<li class="wrapper-label">
			<div class="label comment buy swipe">
				<div class="ball"></div>
				<div class="row">
					<div class="size-price">1 @ 103.30</div>
				</div>
				<div class="row">
					<div class="date">Friday, May 3rd, 2014 - 11:34am</div>
				</div>
			</div>
			<div class="wrapper-swipe">
				<div class="swipe-buttons">
					<ul>
						<li class="button-swipe delete"></li>
					</ul>
				</div>
			</div>
		</li>
		<li class="wrapper-label">
			<div class="label comment sell swipe">
				<div class="ball"></div>
				<div class="row">
					<div class="size-price">1 @ 103.30</div>
				</div>
				<div class="row">
					<div class="date">Friday, May 3rd, 2014 - 11:34am</div>
				</div>
			</div>
			<div class="wrapper-swipe">
				<div class="swipe-buttons">
					<ul>
						<li class="button-swipe delete"></li>
					</ul>
				</div>
			</div>
		</li>
		<li class="wrapper-label">
			<div class="label comment commentary swipe position: relative!important ">
				<div class="ball"></div>
				<div class="row">
					<div class="body">Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor Lorem ipsum dolor</div>
				</div>
				<div class="row">
					<div class="date">Friday, May 3rd, 2014 - 11:34am</div>
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
		</li>
	</ul>
</script>
