function dialogIsOpen() {
	var wordcardIsOpen = typeof window['wordcardDialog'] != 'undefined' ? $(window['wordcardDialog'].$modal).is(':visible') : false;
	var bugReportIsOpen = typeof window['bugReportDialog'] != 'undefined' ? $(window['bugReportDialog'].$modal).is(':visible') : false;
	var examIsOpen = typeof window['examDialog'] != 'undefined' ? $(window['examDialog'].$modal).is(':visible') : false;
	return (wordcardIsOpen || bugReportIsOpen || examIsOpen);
}

function callFromApp() {
	var wordcardIsOpen = typeof window['wordcardDialog'] != 'undefined' ? $(window['wordcardDialog'].$modal).is(':visible') : false;
	var bugReportIsOpen = typeof window['bugReportDialog'] != 'undefined' ? $(window['bugReportDialog'].$modal).is(':visible') : false;
	var examIsOpen = typeof window['examDialog'] != 'undefined' ? $(window['examDialog'].$modal).is(':visible') : false;
	if (wordcardIsOpen) {//關閉字卡
		window['wordcardDialog'].close();
	} else if (bugReportIsOpen) {//關閉錯誤回報
		window['bugReportDialog'].close();
	} else if (examIsOpen) {
		if ($('#exam-abort').length == 1) {//放棄測驗
			$('#exam-abort').trigger('click');
		} else {//關閉測驗確認視窗
			window['examDialog'].close();
		}
	} else if (JSInterface) {
		var fname = (window.location.href.split('?')[0]).match(/([^\/]+)(\.\w+$)/) !== null ? ((window.location.href.split('?')[0]).match(/([^\/]+)(\.\w+$)/))[0] : '';
		var action = '';
		var dontLoading = false;
		switch (fname) {
			case '':
			case 'index.php':
				dontLoading = true;
				action = function() {
					JSInterface.callFromWeb('shutdown');
				};
			break;
			case 'score.php':
				action = function() {
					if($('#go-learning').length != 0) {
						$('#go-learning').eq(0).trigger('click');
					}
				};
			break;
			default:
				action = function() {
					if($('.navbar-brand').length != 0) {
						$('.navbar-brand').eq(0).trigger('click');
					}
				};
			break;
		}
		if (typeof action == 'function') {
			if (!dontLoading) {
				showLoading();
			}
			action();
		}
	}
}

function appDrawerOpen() {
	if ($('#wrapper').hasClass('toggled') && !dialogIsOpen()) {
		$('#menu-toggle').trigger('click');
		$('#page-content-wrapper').css({
			'left': '0'
		});
	}
}

function appDrawClose() {
	if (!$('#wrapper').hasClass('toggled') && !dialogIsOpen()) {
		$('#menu-toggle').trigger('click');
		$('#page-content-wrapper').css({
			'left': '0'
		});
	}
}

$(document).on('click', 'a:not([href^="#"])', function(e) {
	e.preventDefault();
	showLoading();
	window.location.href = $(this).attr('href');
});