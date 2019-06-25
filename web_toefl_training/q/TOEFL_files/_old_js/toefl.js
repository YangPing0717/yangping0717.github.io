
$( document ).ready(function() {
	$('.question_index').hide();
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

  $('#showClock').click(function () {
  	$('#hideClock').show();
  	$(this).hide();
  });

  $('#hideClock').click(function () {
  	$('#showClock').show();
  	$(this).hide();
  });

  $('iframe').load(function(){
	  // var json = $.parseJSON($($(this)).contents().text());
	  // console.log(json);
	})
});

function goNextUnit()
{
	var url = window.location.href
	var queryObject = $.parseParams( url.split('?')[1] || '' ); // object { ferko: 'suska', ee: 'huu' }
	queryObject['step'] = "WhereToGo";
	location.href = '?'+$.param(queryObject);
}

function setTimer(seconds)
{
	var settings = {
		seconds:seconds,
		frequency:100,
		heartbeatCallback: typeof heartbeatCallback == 'function' ? heartbeatCallback : null,
		timesupCallback: typeof timesupCallback == 'function' ? timesupCallback : null,
	}

	$('#clock').countdown(settings);
}

function startTimer()
{
	$('#clock').countdown('start');
}

function pauseTimer()
{
	$('#clock').countdown('pause');
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