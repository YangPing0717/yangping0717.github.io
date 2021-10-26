$( document ).ready(function() {
	$('textarea[name=answer]').on('change keyup paste',function () {
		if(typeof essayWritingCallback == 'function')
	  {
	    essayWritingCallback(wordCount($(this).val()));
	  }
	});
});

function wordCount( val ){
  var wom = val.match(/\S+/g);
  return {
    charactersNoSpaces : val.replace(/\s+/g, '').length,
    characters         : val.length,
    words              : wom ? wom.length : 0,
    lines              : val.split(/\r*\n/).length
  };
}