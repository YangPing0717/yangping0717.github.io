$(document).on('dblclick', 'pre.debug', function() {
	$(this).css('max-height', ($(this).css('max-height') != 'none' ? 'none' : '200px'));
});