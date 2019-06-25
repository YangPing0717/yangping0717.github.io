function startUnit()
{
	$('#next').show();
	$('#previous').unbind().click( function () {
		if($(this).hasClass('disabled')) { return; }
		previousQuestion();
		fadeEffect($(this),$('.current').find('form').find('input[name=q_num]').val()!=1);
	});
	$('#next').unbind().click( function () {
	  if($(this).hasClass('disabled')) { return; }
	  nextQuestion();
		fadeEffect($(this));
	});

	$( ".article" ).scroll(function() {
		var scrollLeft = $(this)[0].scrollHeight - $(this).scrollTop() - $(this).height();
		if(scrollLeft < 100)
		{
			$(this).addClass('alreadyRead');
		}
	});

	setTimer(leftTime);
	startTimer();
	displayQuestionContent();
}

function nextPreviousControl()
{
	$('#previous').show();
	if($('.current').find('form').find('input[name=q_num]').val()==1)
	{
		$('#previous').hide();
	}
}

function previousQuestion()
{
	var target = $('.current').prev('.question');
	if(target.length > 0)
	{
		$('.current').removeClass('current').hide();
		target.addClass('current');
		displayQuestionContent();
	}
}

function nextQuestion()
{
	if($('.reading_article:visible').length > 0)
	{
		var articleObject = $('.reading_article:visible').find('.article');
		if(!articleObject.hasClass('alreadyRead'))
		{
			$('#modalCancel').hide();
			$('.modal-body').html('你需要先閱讀完整篇文章');
			$('.modal').modal('show');
			return;
		}
		else
		{
			$('.reading_article:visible').remove();
			displayQuestionContent();
			return;
		}
	}

	var target = $('.current').next('.question');
	if(target.length > 0)
	{
		$('.current').removeClass('current').hide();
		target.addClass('current');
		displayQuestionContent();
	}
	else
	{
		var nextElement = $('.current').next();
		if(nextElement.hasClass('reading_article'))
		{
			displayQuestionContent();
		}
		else
		{
			goNextUnit('R');
		}
	}
}

function displayQuestionContent()
{
	var main_group = $('.current').attr('main_group');
	var reading_article = $('.reading_article[main_group='+main_group+']');
	if(reading_article.length > 0)
	{
		reading_article.show();
		$('#previous').hide();
		return;
	}
	$('.current').show();
	updateCurrentQuestionIndex();
	nextPreviousControl();
	updateOptions();
	var articleObject = $('.current').find('.article');
	if(articleObject.find('.scrollToHere').length > 0)
	{
		var scrollto = articleObject.find('.scrollToHere').first().offset().top - articleObject.offset().top - 10;
		articleObject.animate({
        scrollTop: scrollto
    }, 1000);
		// console.log(scrollto);
	}
}

function updateOptions()
{
	if($('.current').find('input[name=q_type]').val() == 2)
	{
		var insertIndex = $('.current').find('.option').find('input[type=radio]:checked').val() - 1;
		var fragmentObject = $('.current').find('.q_fragment');
		var insertContent = $('.current').find('.q_content').html();
		fragmentObject.find('span.insertHere').html('');
		fragmentObject.find('span.insertHere:eq('+insertIndex+')').html(insertContent);
		// console.log(insertContent);
	}
}

function choiceAnswerCallback()
{
	var form = $('.current').find('form');
	updateOptions();
	form.submit();
	form.find('input[name=spent]').val(0);
}

function heartbeatCallback(status)
{
	var reserve_id = $('.current').find('form').find('input[name=reserve_id]').val();
	//增加計時
	if($('.current').is(':visible'))
	{
		$('.current').find('form').find('input[name=spent]').val($('.current').find('form').find('input[name=spent]').val()-0+1);
	}
	Cookies.set('LeftTime_'+reserve_id+'_R', status.seconds, { expires: 1 });
}

function timesupCallback()
{
	var reserve_id = $('.current').find('form').find('input[name=reserve_id]').val();
	Cookies.remove('LeftTime_'+reserve_id+'_R'); // removed!
	goNextUnit('R');
}

function modalConfirmCallback()
{
	$('.modal').modal('hide');
}