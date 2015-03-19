<script type="text/x-handlebars-template" id="main-template">
	<div class="drag-account">
		<div class="account">Account: <span>Real</span></div>
		<div class="balance">Balance: <span>$4,896.52</span></div>
	</div>
	<section id="content">
		<ul>
			{{#each trades}}
				<li class="wrapper-label" style="left: -80px; width: 400px;">
					<div class="label trade long active-swipe one-button-swipe" style="left: 80px; width: 320px;">
						<div class="ball">
							{{#if this.comments}}
								<div class="globe-comments">{{ this.comments }}</div>
							{{/if}}
							<div class="icon"></div>
						</div>
						<div class="row">
							<div class="instrument">{{ this.instrument }}</div>
							<div class="net positive">$ {{ this.net }}</div>
						</div>
						<div class="row">
							<div class="size-price">2 @ 1,853.50</div>
						</div>
					</div>
					<div class="wrapper-swipe" style="width: 320px;">
						<div class="swipe">
							<ul>
								<li class="button-swipe delete"></li>
							</ul>
						</div>
					</div>
				</li>
			{{/each}}
			{{#each trades}}
				<li class="wrapper-label" style="left: -80px; width: 400px;">
					<div class="label trade long open active-swipe one-button-swipe" style="left: 80px; width: 320px;">
						<div class="ball">
							{{#if this.comments}}
								<div class="globe-comments">{{ this.comments }}</div>
							{{/if}}
							<div class="icon"></div>
						</div>
						<div class="row">
							<div class="instrument">{{ this.instrument }}</div>
							<div class="net positive">$ {{ this.net }}</div>
						</div>
						<div class="row">
							<div class="size-price">2 @ 1,853.50</div>
						</div>
					</div>
					<div class="wrapper-swipe" style="width: 320px;">
						<div class="swipe">
							<ul>
								<li class="button-swipe delete"></li>
							</ul>
						</div>
					</div>
				</li>
			{{/each}}
			{{#each trades}}
				<li class="wrapper-label" style="left: -80px; width: 400px;">
					<div class="label trade long active-swipe one-button-swipe" style="left: 80px; width: 320px;">
						<div class="ball">
							{{#if this.comments}}
								<div class="globe-comments">{{ this.comments }}</div>
							{{/if}}
							<div class="icon"></div>
						</div>
						<div class="row">
							<div class="instrument">{{ this.instrument }}</div>
							<div class="net positive">$ {{ this.net }}</div>
						</div>
						<div class="row">
							<div class="size-price">2 @ 1,853.50</div>
						</div>
					</div>
					<div class="wrapper-swipe" style="width: 320px;">
						<div class="swipe">
							<ul>
								<li class="button-swipe delete"></li>
							</ul>
						</div>
					</div>
				</li>
			{{/each}}
		</ul>
	</section>
</script>
