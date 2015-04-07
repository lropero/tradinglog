<script type="text/x-handlebars-template" id="main-drag-template">
	<div class="drag-account">
		<div class="account">Account: <span>{{this.account}}</span></div>
		<div class="balance">Balance: <span>{{#money this.balance}}{{/money}}</span></div>
		<div class="peeking"></div>
	</div>
</script>
