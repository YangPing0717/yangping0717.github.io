function showLoading() {
	if ($('#loading-mask').length == 0)
	$('body').prepend('<div id="loading-mask"></div><div id="loading-img"><div class="pulse"></div></div>');
}
function hideLoading() {
	if ($('#loading-mask').length == 1)
	$('#loading-mask, #loading-img, #loading-message').remove();
}
function isLoading() {
	return ($('#loading-mask').length == 1) ? true : false;
}