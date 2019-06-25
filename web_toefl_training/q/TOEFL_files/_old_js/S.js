var step = 0;
var stepPause = false;
function startUnit()
{
	$('#previous').click( function () {
		previousQuestion();
	});
	$('#confirm').click( function () {

	});
	$('#next').click( function () {
		runQuestion();
	});
	$('.current').show();
	runQuestion();
}

function runQuestion()
{
	if(stepPause == true)
	{
		return;
	}
	updateCurrentQuestionIndex();
	jplayerStop();
	if($('.current').find('input[name=q_type]').val() == 7)
	{
		var steps = ["listen","prepareSound","prepare","speak","record","save","wait_save"];
		switch(steps[step])
		{
			case 'listen':
				$('.convert').hide();
				$('.readyToAnswer').hide();
				$('.prepare').hide();
				$('.progress').hide();
				if($('.current').attr('audio') != '')
				{
					pauseTimer();
					jplayerPlay('files/'+$('.current').attr('audio'));
					$('.current').attr('audio','');
				}
			break;
			case 'prepareSound':
				pauseTimer();
				setTimer(15);
				$('.readyToAnswer').show();
				jplayerPlay('toefl/files/may_prepare_response.mp3');
			break;
			case 'prepare':
				$('.readyToAnswer').hide();
				$('.prepare').show();
				$('.progress').show();
				$('.current').find('.preparation>.seconds').html(15);
				$('.current').find('.response>.seconds').html(45);
				$('.current').find('.flag').css({"background-color":""});
				$('.current').find('.preparation>.flag').css({"background-color":"yellow"});
				startTimer();
			break;
			case 'speak':
				pauseTimer();
				setTimer(45);
				$('.progress').hide();
				jplayerPlay('toefl/files/pls_begin_response.mp3');
				$('.current').find('form').show();
			break;
			case 'record':
				startRecording('temp.mp3');
				$('.progress').show();
				$('.current').find('.flag').css({"background-color":""});
				$('.current').find('.response>.flag').css({"background-color":"yellow"});
				startTimer();
			break;
			case 'save':
				$('.progress').hide();
				$('.convert').show();
				stopRecording();
			break;
			case 'wait_save':
				stepPause = true;
			break;
		}
	}
	else if($('.current').find('input[name=q_type]').val() == 8)
	{
		var steps = ["read","listen_q_main","listen","prepareSound","prepare","speak","record","save","wait_save"];
		switch(steps[step])
		{
			case 'read':
				$('.convert').hide();
				$('.q_main').hide();
				$('.subtitles').hide();
				$('.prepare').hide();
				$('.readyToAnswer').hide();
				$('.progress').show();
				$('.article').show();
				pauseTimer();
				setTimer(45);
				startTimer();
			break;
			case 'listen_q_main':
				$('.article').hide();
				var q_main = $('.current').find('.q_main');
				q_main.show();
				if(q_main.length > 0 && q_main.attr('audio') != '')
				{
					pauseTimer();
					jplayerPlay('files/'+q_main.attr('audio'));
					q_main.attr('audio','');
				}
			break;
			case 'listen':
				$('.q_main').hide();
				$('.subtitles').show();
				if($('.current').attr('audio') != '')
				{
					pauseTimer();
					jplayerPlay('files/'+$('.current').attr('audio'));
					$('.current').attr('audio','');
				}
			break;
			case 'prepareSound':
				pauseTimer();
				setTimer(30);
				$('.readyToAnswer').show();
				jplayerPlay('toefl/files/may_prepare_response.mp3');
			break;
			case 'prepare':
				$('.prepare').show();
				$('.progress').show();
				$('.current').find('.preparation>.seconds').html(30);
				$('.current').find('.response>.seconds').html(60);
				$('.current').find('.flag').css({"background-color":""});
				$('.current').find('.preparation>.flag').css({"background-color":"yellow"});
				startTimer();
			break;
			case 'speak':
				pauseTimer();
				setTimer(60);
				$('.progress').hide();
				jplayerPlay('toefl/files/pls_begin_response.mp3');
				$('.current').find('form').show();
			break;
			case 'record':
				startRecording('temp.mp3');
				$('.progress').show();
				$('.current').find('.flag').css({"background-color":""});
				$('.current').find('.response>.flag').css({"background-color":"yellow"});
				startTimer();
			break;
			case 'save':
				$('.progress').hide();
				$('.convert').show();
				stopRecording();
			break;
			case 'wait_save':
				stepPause = true;
			break;
		}
	}
	else if($('.current').find('input[name=q_type]').val() == 9)
	{
		var steps = ["listen_q_main","listen","prepareSound","prepare","speak","record","save","wait_save"];
		switch(steps[step])
		{
			case 'listen_q_main':
				$('.convert').hide();
				$('.subtitles').hide();
				$('.prepare').hide();
				$('.readyToAnswer').hide();
				$('.progress').show();
				$('.article').hide();
				var q_main = $('.current').find('.q_main');
				q_main.show();
				if(q_main.length > 0 && q_main.attr('audio') != '')
				{
					pauseTimer();
					jplayerPlay('files/'+q_main.attr('audio'));
					q_main.attr('audio','');
				}
			break;
			case 'listen':
				$('.q_main').hide();
				$('.subtitles').show();
				$('.progress').hide();
				if($('.current').attr('audio') != '')
				{
					pauseTimer();
					jplayerPlay('files/'+$('.current').attr('audio'));
					$('.current').attr('audio','');
				}
			break;
			case 'prepareSound':
				pauseTimer();
				setTimer(20);
				$('.readyToAnswer').show();
				jplayerPlay('toefl/files/may_prepare_response.mp3');
			break;
			case 'prepare':
				$('.readyToAnswer').hide();
				$('.prepare').show();
				$('.progress').show();
				$('.current').find('.preparation>.seconds').html(20);
				$('.current').find('.response>.seconds').html(60);
				$('.current').find('.flag').css({"background-color":""});
				$('.current').find('.preparation>.flag').css({"background-color":"yellow"});
				startTimer();
			break;
			case 'speak':
				pauseTimer();
				setTimer(60);
				$('.progress').hide();
				jplayerPlay('toefl/files/pls_begin_response.mp3');
				$('.current').find('form').show();
			break;
			case 'record':
				startRecording('temp.mp3');
				$('.progress').show();
				$('.current').find('.flag').css({"background-color":""});
				$('.current').find('.response>.flag').css({"background-color":"yellow"});
				startTimer();
			break;
			case 'save':
				$('.progress').hide();
				$('.convert').show();
				stopRecording();
			break;
			case 'wait_save':
				stepPause = true;
			break;
		}
	}

	console.log(step+'=>'+steps[step]);
	step++;
	if(!steps[step])
	{
		step = 0;
		runQuestion();
		return;
	}
}

function goNextQuestion()
{
	var target = $('.current').next('.question');
	if(target.length > 0)
	{
		$('.current').removeClass('current').hide();
		target.show().addClass('current');
	}
	else
	{
		goNextUnit();
	}
}

function nextQuestion()
{
	runQuestion();
}

function choiceAnswerCallback()
{
	var form = $('.current').find('form');
	form.submit();
	goNextQuestion();
}

function endedPlayCallback()
{
	runQuestion();
}

function timesupCallback()
{
	runQuestion();
}

function heartbeatCallback(status)
{
	var html = '';
	switch(step)
	{
		case 'speak':
			html = 'Prepare your response '+status.seconds+' sec';
		break;
		case 'next':
			html = 'Recording... '+status.seconds+' sec';
		break;
		default:
		break;
	}
	$('.progress-bar:visible').css({width:status.percent+'%'}).html(html);
}

function timeupdateCallback(percent)
{
	$('.progress-bar:visible').css({width:percent+'%'});
}

function stopRecordingCallback(mp3Data)
{
	var reader = new FileReader();
	reader.onload = function(event){
		var fd = new FormData();
		var form = $('.current').find('form');
		form.find('input[name=mp3]').val(event.target.result);
		choiceAnswerCallback();
		console.log('saved mp3');
		// console.log(event.target.result);
		stepPause = false;
	};
	reader.readAsDataURL(mp3Data);
}
