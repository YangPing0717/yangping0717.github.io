function IsEmail(email) {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	return regex.test(email);
}
function validInput(input) {
	input.parents('.form-group').children('.form-control-feedback').remove();
	if (input.is('input')) {
		$('<span></span>').addClass('glyphicon glyphicon-ok form-control-feedback').attr('aria-hidden', true).appendTo(input.parents('.form-group'));
	}
	input.parents('.form-group').removeClass('has-error').addClass('has-success has-feedback');
}
function invalidInput(input) {
	input.parents('.form-group').children('.form-control-feedback').remove();
	if (input.is('input')) {
		$('<span></span>').addClass('glyphicon glyphicon-remove form-control-feedback').attr('aria-hidden', true).appendTo(input.parents('.form-group'));
	}
	input.parents('.form-group').removeClass('has-success').addClass('has-error has-feedback');
}
$('#bugModal input.valid-email').on('blur', function() {
	if ($(this).val().length > 0 && IsEmail($(this).val())) {
		validInput($(this));
	} else {
		invalidInput($(this));
	}
});
$('#bugModal input.valid-empty, #bugModal textarea.valid-empty').on('blur', function() {
	if ($(this).val().length > 0) {
		validInput($(this));
	} else {
		invalidInput($(this));
	}
});
$('#bugModal input.valid-length[data-valid-length], #bugModal textarea.valid-length[data-valid-length]').on('blur', function() {
	if ($(this).val().length == $(this).attr('data-valid-length')) {
		validInput($(this));
	} else {
		invalidInput($(this));
	}
});
$('#bugSubmit').click(function() {
	showLoading();
	$('#bugForm').submit();
	$('#bugModal').modal('hide');
	setTimeout(function() {
		hideLoading();
		$.msgDialog({
			'title': $('#bugSuccess').val(),
			'content': $('#bugSuccessNotice').val(),
			'confirmTxt': $('#bugSuccessOK').val()
		});
	}, (Math.random() * (5000 - 2000) + 2000));
});
$('#bugModal').on('show.bs.modal', function() {
	if ($('#wordId').val() == '') {
		$('#reportItem').hide();
	}
});