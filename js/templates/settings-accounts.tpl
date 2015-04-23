<script type="text/x-handlebars-template" id="settings-accounts-template">
	<div class="box-violet">
		<ul>
			{{#each accounts}}
				<li class="wrapper-label" data-key="{{@key}}"{{#unless this.is_active}} data-swipe="1"{{/unless}}>
					<div class="label account swipe">
						<div class="radiobutton{{#if this.is_active}} active{{/if}}"></div>
						<div class="row">
							<div class="name">{{this.name}}</div>
						</div>
						<div class="row">
							<div class="balance">{{#money this.balance}}{{/money}}</div>
						</div>
						{{#unless this.is_active}}
							<div class="swipe-triangle"></div>
						{{/unless}}
					</div>
					{{#unless this.is_active}}
						<div class="wrapper-swipe">
							<div class="swipe-buttons">
								<ul>
									<li class="button-swipe delete" data-id="{{this.id}}"></li>
								</ul>
							</div>
						</div>
					{{/unless}}
				</li>
			{{/each}}
		</ul>
	</div>
</script>
