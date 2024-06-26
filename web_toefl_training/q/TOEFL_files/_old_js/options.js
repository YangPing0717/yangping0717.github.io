$('.option').click(function() {
	var obj = $(this).find('input');
	var checked = true;
	if(obj.attr('type') == 'checkbox')
	{
		var checked = !obj.prop('checked');
	}

  $(this).find('input[type=radio],input[type=checkbox]').prop('checked',checked);
  updateCheckedStatus($(this));
  $.each(obj.closest("form").find('input[name="'+$(this).find('input[type=radio],input[type=checkbox]').attr('name')+'"]'), function () {
    updateCheckedStatus($(this).parent());
  });

  if(typeof choiceAnswerCallback == 'function')
  {
    choiceAnswerCallback();
  }
});

function updateCheckedStatus(obj)
{
  var className = obj.find('input[type=radio],input[type=checkbox]').prop('checked') ? 'btn-primary' : 'btn-default';
  obj.removeClass('btn-default');
  obj.removeClass('btn-primary');
  obj.addClass(className);
}