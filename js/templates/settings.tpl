<script type="text/x-handlebars-template" id="settings-template">
	<control class="segmented">
		<ul>
			<li class="{{#equal section 'instruments'}}active{{/equal}}" data-section="instruments">Instruments</li>
			<li class="middle{{#equal section 'accounts'}} active{{/equal}}" data-section="accounts">Accounts</li>
			<li data-section="general">General</li>
		</ul>
	</control>
	<section id="content"></section>
</script>
