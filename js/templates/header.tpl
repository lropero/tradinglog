<bar class="navigation">
	<button class="left" id="button-left"></button>
	<div class="logo"><div onclick="if($('section#settings').is(':visible')) { app.databaseController.reset(); app.init(); } else { $('header button').hide(); app.view.addRandomTrade(); }" style="height: 100%; margin: auto; width: 20%;">&nbsp;</div></div>
	<button class="right" id="button-right"></button>
</bar>
