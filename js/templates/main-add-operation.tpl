<script type="text/x-handlebars-template" id="main-add-operation-template">
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
		<div class="wrapper-input">
			<div class="input-icon price">
				<input id="amount" type="number" pattern="\d*" placeholder="Amount" />
			</div>
			<span class="help-block">Total amount.</span>
		</div>
		<div class="wrapper-comment">
			<textarea id="description" rows="5" placeholder="Description"></textarea>
			<span class="help-block">Optional comment in which you can describe the reasons for this operation. For example, 'Monthly contribution', 'Balance adjustment', etc.</span>
		</div>
	</form>
</script>
