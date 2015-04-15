<script type="text/x-handlebars-template" id="settings-instruments-template">
	<div class="box-violet">
		<ul>
			{{#each instruments}}
				<li class="wrapper-label" data-key="{{@key}}" data-swipe="2">
					<div class="label instrument swipe">
						<div class="ball">
							<span class="group">{{this.group}}</span>
						</div>
						<div class="row">
							<div class="name">{{this.name}}</div>
						</div>
						<div class="row">
							<div class="type">{{this.typeName}}</div>
							{{#equal this.type 1}}
								<div class="commission">{{#money this.commission}}{{/money}}</div>
							{{/equal}}
						</div>
					</div>
					<div class="wrapper-swipe">
						<div class="swipe-buttons">
							<ul>
								<li class="button-swipe delete" data-id="{{this.id}}"></li>
								<li class="button-swipe group" data-id="{{this.id}}"><span>{{this.group}}</span></li>
							</ul>
						</div>
					</div>
				</li>
			{{/each}}
		</ul>
	</div>
</script>
