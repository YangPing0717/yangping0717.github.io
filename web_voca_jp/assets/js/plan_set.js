function checkDate() {
	var err;
	if ($('#estimated-date').val().match(/^\d{4}\-\d{2}\-\d{2}$/) == null) {
		err = '您沒有選擇預計完成日，請重新設定。';
	} else {
		err = '';
	}
	return err;
}
function checkSubmit() {
	var dateErr = checkDate(), targetErr = $('[name="plan-target[]"]:checked').length == 0 ? '您沒有選擇考試目標，請重新設定。' : '', err;
	if (targetErr != '') {
		err = targetErr;
	} else if (dateErr != '') {
		err = dateErr;
	} else {
		err = '';
	}
	return err;
}
$('.btn_plan_create').click(function() {
	var msg = checkSubmit();
	if (msg != '') {
		$.msgDialog(msg);
	} else {
		showLoading();
		var planTargets = [];
		$('[name="plan-target[]"]:checked').each(function() {
			planTargets.push($(this).val());
		});
		$.post('index.php?_c=plan_update', {
			'plan_target': planTargets,
			'estimated_date': $('#estimated-date').val()
		}, function(res) {
			hideLoading();
			if (res.needConfirm == 'true') {
				$.ynDialog({
					title: '確認計畫內容',
					content: res.message,
					yesTxt: '繼續建立',
					sayYes: function(_dialog) {
						showLoading();
						_dialog.close();
						$.post('index.php?_c=plan_update', {
							'plan_target': planTargets,
							'estimated_date': $('#estimated-date').val(),
							'confirm': true
						}, function(res2) {
							if (res2 == '') {
								$('input, select, button').prop('disabled', true);
								window.location.href = 'index.php';
							} else {
								hideLoading();
								$.msgDialog(res2);
							}
						});
					},
					sayNo: function() {
						$('input, select, button').prop('disabled', false);
					}
				});
			} else {
				$.msgDialog(res);
			}
		});
	}
});
$('.reset-plan').click(function() {
	$.ynDialog({
		title: '重設計畫書',
		content: '確定要重新設定考試目標及預計完成日嗎？（背過的單字記錄不會被刪除）',
		//btnReverse: true,
		sayYes: function(_dialog) {
			showLoading();
			$.post('index.php?_c=plan_reset', function(ajaxResp) {
				if (ajaxResp != '') {
					hideLoading();
					$.msgDialog(ajaxResp);
				} else {
					window.location.reload();
				}
			});
		}
	});
});