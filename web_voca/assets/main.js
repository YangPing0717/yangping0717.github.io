$('#hideSideMenu').click(function() {
	$('.sidebar').fadeToggle(function() {
		if ($('.sidebar:visible').length == 0) {
			$('.main').removeClass('col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2');
			$('#hideSideMenu').html('<span class="glyphicon glyphicon-resize-full" aria-hidden="true"></span> 顯示選單');
		}
		else {
			$('.main').addClass('col-sm-9 col-sm-offset-3 col-md-10 col-md-offset-2');
			$('#hideSideMenu').html('<span class="glyphicon glyphicon-resize-small" aria-hidden="true"></span> 隱藏選單');
			$('html, body').scrollTop(0);
		}
		$('#navbar').removeClass('in').attr('aria-expanded', false);
	});
	return false;
});
$('#bugReport').click(function(e) {
	e.preventDefault();
	vocwordcard_stop();
	BootstrapDialog.show({
		size: BootstrapDialog.SIZE_WIDE,
		message: $('<div></div>').load('bug-report.php')
	});
});
$('.bugReport').click(function(e) {
	e.preventDefault();
	vocwordcard_stop();
	BootstrapDialog.show({
		size: BootstrapDialog.SIZE_WIDE,
		message: $('<div></div>').load('bug-report.php?word_id=' + $(this).attr('data-id'))
	});
	$(this).trigger('blur');
});
$('#sysLogOut').click(function() {
	BootstrapDialog.show({
		type: 'type-warning',
		title: '確定要登出系統？',
		message: '登出後將自動關閉本視窗！',
		buttons: [{
			label: '確定登出',
			cssClass: 'btn-warning',
			action: function(dialogItself){
				dialogItself.close();
				window.location.href = $('#sysLogOut').attr('href');
			}
		}, {
			label: '取消',
			action: function(dialogItself){
				dialogItself.close();
			}
		}],
		onhidden: function() {
		}
	});
	return false;
});
$('#vocWordCard').click(function() {
	window['vocId'] = new Array();
	$('h2[data-word-id]').each(function() {
		window['vocId'].push($(this).attr('data-word-id'));
	});
	window['vocPosition'] = 0;
	window['vocPlay'] = true;
	showWordCard();
});
$('.vocWordCard').click(function() {
	window['vocId'] = new Array();
	$('h2[data-word][data-word-id][data-checksum]').each(function() {
		window['vocId'].push($(this).attr('data-word-id'));
	});
	var word_id = $('tr').index($(this).parents('tr'));
	//console.log(word_id);
	window['vocPosition'] = word_id;
	window['vocPlay'] = true;
	showWordCard();
});
$('.myWordToggle').click(function() {
	//console.log($(this).attr('data-id'));
	var _this = $(this);
	$.post('word-status.php', {
		'id': $(this).attr('data-id'),
		'kind_id': $('#kind_id').val()
	}, function(responce) {
		var data = $.parseJSON(responce);
		chg_favorite_btn(data);
		$('#myWordNum').text(data.myWordNum);
		$('#learnedWordNum').text(data.learnedWordNum);
		$('#learningWordNum').text(data.learningWordNum);
		$('#word_category').effect('highlight', {}, 1000);
		if (_this.attr('data-remove') == 'true') {
			_this.parents('tr').remove();
		}
	});
});
$('.scoreDetailInquire[data-exam-token]').click(function(e) {
	e.stopPropagation();
	BootstrapDialog.show({
		size: BootstrapDialog.SIZE_WIDE,
		message: $('<div></div>').load('score-detail.php?student_id=' + $(this).attr('data-student-id') + '&exam_token=' + $(this).attr('data-exam-token'))
	});
});
function chg_favorite_btn(data) {
	var this_btn = $('.myWordToggle[data-id="' + data.id + '"]');
	var this_btn_span = $('.myWordToggle[data-id="' + data.id + '"] > span.glyphicon');
	if (data.myword == 'true') {
		this_btn_span.removeClass('glyphicon-star-empty').addClass('glyphicon-star');
	}
	else {
		if (data.myword == 'false') {
			this_btn_span.removeClass('glyphicon-star').addClass('glyphicon-star-empty');
		}
	}
	this_btn.attr('title', data.msg).tooltip({
		trigger: 'manual'
	}).tooltip('show');
	setTimeout(function() {
		this_btn.removeAttr('title').tooltip('destroy');
	}, 1500)
}
$('#vocExam').click(function() {
	soundManager.play('correctSound', { volume: 0 });
	soundManager.play('incorrectSound', { volume: 0 });
	soundManager.play('tickTockSound', { volume: 0 });
	showExam();
});
$(document).ready(function() {
	//抓字彙狀態個數
	$.post('word-status.php', {
		'kind_id': $('#kind_id').val()
	}, function(responce) {
		var data = $.parseJSON(responce);
		$('#myWordNum').text(data.myWordNum);
		$('#learnedWordNum').text(data.learnedWordNum);
		$('#learningWordNum').text(data.learningWordNum);
		$('#haveNotSeenWordNum').text(data.haveNotSeenWordNum);
	});
	file_preload();
	$('[data-toggle="tooltip"]').tooltip();
});
function showWordCard() {
	// 取得頁面寬度高度
	var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = w.innerWidth || e.clientWidth || g.clientWidth,
	y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	if (typeof(ignore_incomplete) == 'undefined') {
		ignore_incomplete = '';
	}
	window['wordcardDialog'] = BootstrapDialog.show({
		closable: false,
		message: function(dialogRef) {
			$message = $('<div></div>', {id: 'wordcardDialogContent'}).load('wordcard.php?id=' + window['vocId'][window['vocPosition']] + '&wb_key=' + window['wbKey'], function() {
				$('body').css({
					'overflow-y': 'hidden'
				});
				$('#wordcardDialogContent div.table-responsive').css({
					'max-height': (y * 0.5).toString() + 'px',
					'overflow-y': 'auto'
				});
				$(document).on('click', '#btn-lightbox-close', function(){
					window['wordcardDialog'].close();
				});
			});
			return $message;
		},
		onhide: function() {
			$('body').css({
				'overflow-y': 'auto'
			});
			vocwordcard_stop();
		}
	});
	window['wordcardDialog'].getModalHeader().hide();
	window['wordcardDialog'].getModalFooter().hide();
}
function vocwordcard_stop() {
	if (window['vocInterval']) {
		clearInterval(window['vocInterval']);
		window['vocTimerNum'] = window['vocTimerNumSet'];
	}
}
function showExam(ignore_incomplete) {
	// 取得頁面寬度高度
	var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = w.innerWidth || e.clientWidth || g.clientWidth,
	y = w.innerHeight|| e.clientHeight|| g.clientHeight;
	if (typeof(ignore_incomplete) == 'undefined') {
		ignore_incomplete = '';
	}
	window['vocId'] = new Array();
	$('h2[data-word][data-word-id][data-checksum]').each(function() {
		window['vocId'].push($(this).attr('data-word-id'));
	});
	//最少要有voc_num_min個字才能測驗
	if (window['vocId'].length >= voc_num_min || voc_num_min == 0) {
		vocwordcard_stop();
		window['examDialog'] = BootstrapDialog.show({
			closable: false,
			message: function(dialogRef) {
				$message = $('<div></div>', {id: 'examDialogContent'}).load('exam-create.php?exam_vocs=' + window['vocId'] + '&kind_id=' + $('#kind_id').val() + '&curr_round=' + $('#curr_round').val() + '&ignore_incomplete=' + ignore_incomplete, function() {
					$('body').css({
						'overflow-y': 'hidden'
					});
					$('#examDialogContent div.table-responsive').css({
						'max-height': (y * 0.5).toString() + 'px',
						'overflow-y': 'auto'
					});
					$(document).on('click', '#btn-lightbox-close', function(){
						window['examDialog'].close();
					});
				});
				return $message;
			},
			onshown: function() {
				if (typeof(exam_cd_initial) == 'function') {
					exam_cd_initial();
				}
			}
		});
		window['examDialog'].getModalHeader().hide();
		window['examDialog'].getModalFooter().hide();
	}
	else {
		message_dialog('至少要有' + voc_num_min + '個字才能進行測驗！');
	}
}
function file_preload() {
	var file_list = [
		{'type': 'image', 'file': 'include/img/headphone.png'}
	];
	$.each(file_list, function(k, v) {
		switch (v.type) {
			case 'image':
				$('<img>').attr('src', v.file);
			break;
		}
	});
}
(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);