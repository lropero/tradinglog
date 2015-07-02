<div class="box-violet" id="isolate">
	<div class="button-primary" id="done">Done</div>
</div>
<div id="complete">
	<div class="box-violet">
		<form>
			<div class="wrapper-input isolate">
				<input id="name" type="text" placeholder="Account name" {{#if this.account}}value="{{this.account.name}}" {{/if}}disabled />
				<span class="help-block">For example, 'Demo', 'Real', etc.</span>
			</div>
			{{#unless this.account}}
				<div class="wrapper-input isolate">
					<div class="input-icon price">
						<input id="balance" type="text" placeholder="Initial balance" disabled />
					</div>
					<span class="help-block">You need to have sufficient funds in order to add trades. You'll be able to deposit or withdraw money at any time.</span>
				</div>
			{{/unless}}
		</form>
		{{#unless this.account}}
			<div class="wrapper-checkbox">
				<div class="checkbox active" id="is_active"></div>
				<span>Use this account</span>
			</div>
		{{/unless}}
	</div>
</div>
