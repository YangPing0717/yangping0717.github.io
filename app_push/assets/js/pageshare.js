function shareFacebook(url)
{
	void(window.open('http://www.facebook.com/share.php?u=' + encodeURIComponent(url)));
}
function sharePlurk(url, title)
{
	void(window.open('http://www.plurk.com/?qualifier=shares&status=' + encodeURIComponent(url) + ' (' + encodeURIComponent(title) + ')'));
}
function shareTwitter(url, title)
{
	void(window.open('http://twitter.com/home/?status=' + encodeURIComponent(title) + ' ' + encodeURIComponent(url)));
}