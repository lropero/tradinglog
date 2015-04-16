<script type="text/x-handlebars-template" id="settings-add-account-template">
	<div class="box-violet" id="isolate">
		<div class="button-primary" id="done">Done</div>
	</div>
	<div id="complete">
		<div class="box-violet">
			<form>
				<div class="wrapper-input isolate">
					<input id="name" type="text" placeholder="Account name">
					<span class="help-block">For example, 'Demo', 'Real', etc.</span>
				</div>
				<div class="wrapper-input isolate">
					<div class="input-icon price">
						<input id="balance" type="number" placeholder="Initial balance">
					</div>
					<span class="help-block">You need to have sufficient funds in order to add trades. You'll be able to deposit or withdraw money at any time.</span>
				</div>
			</form>
			<div class="wrapper-checkbox">
				<div class="checkbox active" id="is_active"></div>
				<span>Use this account</span>
			</div>
		</div>
	</div>
</script>
