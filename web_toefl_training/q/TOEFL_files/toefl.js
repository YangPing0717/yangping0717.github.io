var bUnitStarted = false;
window.onbeforeunload = function () { return "alert" };
$( document ).ready(function() {

	$('.question_index').hide();
	$('.nextSection').hide();
	$('#timeicon').hide();
	if($('#environment_setup').length > 0)
	{
		$('.section_intro').hide();
	}
	else
	{
		startSectionIntro();
	}

  var re = /([^&=]+)=?([^&]*)/g;
  var decode = function(str) {
      return decodeURIComponent(str.replace(/\+/g, ' '));
  };
  $.parseParams = function(query) {
      var params = {}, e;
      if (query) {
          if (query.substr(0, 1) == '?') {
              query = query.substr(1);
          }

          while (e = re.exec(query)) {
              var k = decode(e[1]);
              var v = decode(e[2]);
              if (params[k] !== undefined) {
                  if (!$.isArray(params[k])) {
                      params[k] = [params[k]];
                  }
                  params[k].push(v);
              } else {
                  params[k] = v;
              }
          }
      }
      return params;
  };

  $('#timeicon').click(function () {
  	$('#time-disp').fadeToggle( "slow" );
  });

  $('iframe').load(function(){
  	if(typeof iframeLoadCallback == 'function')
	  {
	  	iframeLoadCallback();
	  }
	  // var json = $.parseJSON($($(this)).contents().text());
	  // console.log(json);
	})
});

function goNextUnit(section)
{
	window.onbeforeunload = null;
	$('.question').hide();
	$('.nextSection').show();
	var url = window.location.href
	var queryObject = $.parseParams( url.split('?')[1] || '' ); // object { ferko: 'suska', ee: 'huu' }
	queryObject['step'] = "save";
	queryObject['section'] = section;
	location.href = '?'+$.param(queryObject);
}

function setTimer(seconds)
{
	var settings = {
		seconds:seconds,
		frequency:timerFrequency,
		heartbeatCallback: typeof heartbeatCallback == 'function' ? heartbeatCallback : null,
		timesupCallback: typeof timesupCallback == 'function' ? timesupCallback : null,
	}

	$('#time-disp').countdown(settings);
}

function startTimer()
{
	$('#time-disp').countdown('start');
}

function pauseTimer()
{
	$('#time-disp').countdown('pause');
}

function fadeEffect(element,show)
{
	show = typeof show == 'undefined' ? true : show;
	element.addClass('disabled');
	element.fadeOut( 500, function() {
		if(show)
		{
			$(this).fadeIn(function () {
				$(this).removeClass('disabled');
			});
		}
		else
		{
			$(this).removeClass('disabled');
		}
  });
}

function startSectionIntro()
{
	if($('.section_intro').length > 0)
	{
		$('.section_intro').show();
		checkSectionIntro();
		$('#confirm').show();
		$('#confirm').click( function () {
			nextSectionIntro();
		});
	}
	else
	{
		nextSectionIntro();
	}
}

function nextSectionIntro()
{
	$('.section_intro').find('.intro').first().remove();
	if($('.section_intro').find('.intro').length > 0)
	{
		checkSectionIntro();
	}
	else
	{
		$('.section_intro').remove();
		$('.question_index').show();
		$('#timeicon').show();
		$('#time-disp').show();
		bUnitStarted = true;
		startUnit();
		$('#confirm').hide();
	}
}

function checkSectionIntro()
{
	if($('.section_intro').find('.intro').attr('audio') != '')
	{
		$('.section_intro').find('.intro').first().show();
		jplayerPlay('toefl/files/'+$('.section_intro').find('.intro').attr('audio'));
	}
}

function hideCurrentQuestionIndex()
{
	$('.question_index').hide();
}

function updateCurrentQuestionIndex()
{
	$('.question_index').show();
	$('.current_index').html($('.current').find('form').find('input[name=q_num]').val());
}

var ctrlPressed = false;
$(window).keydown(function(evt) {
  if (evt.which == 16) { // shift
    ctrlPressed = true;
  }
}).keyup(function(evt) {
  if (evt.which == 16) { // shift
    ctrlPressed = false;
  }
});

function iconClicked()
{
	if (ctrlPressed)
	{
		$('#mp3player').jPlayer('playHead',100);
	}
}