<script type="text/x-handlebars-template" id="main-add-operation-template">
	<div id="isolate">
		<div class="button-primary" id="done">Done</div>
	</div>
	<div id="complete">
		<ul class="wrapper-radiobutton" id="type">
			<li class="group-radiobutton">
				<div class="radiobutton active" data-type="1"></div>
				<span>Deposit</span>
			</li>
			<li class="group-radiobutton">
				<div class="radiobutton" data-type="2"></div>
				<span>Withdraw</span>
			</li>
		</ul>
		<form>
			<div class="wrapper-input isolate">
				<div class="input-icon price">
					<input id="amount" type="number" placeholder="Amount" disabled />
				</div>
				<span class="help-block">Total amount.</span>
			</div>
			<div class="wrapper-comment isolate">
				<textarea id="description" rows="5" placeholder="Description" disabled></textarea>
				<span class="help-block">Optional comment in which you can describe the reasons for this operation. For example, 'Monthly contribution', 'Balance adjustment', etc.</span>
			</div>
		</form>
	</div>
</script>
