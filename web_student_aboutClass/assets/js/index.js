$(document).ready(function(){
  
//$('#audio_control').trigger( "click" );
});

var audioId		=	document.getElementById('audio_player');


$('#audio_control').click(function(e) {						
  e.preventDefault();	
  var audioRf = $('#audio_player');
  $(this).toggleClass('active');
	if (audioRf.prop('paused') == false) {						
    audioRf.get(0).pause();
		$(this).addClass('pause').removeClass('play');
	} 
	else 
	{
		audioRf.get(0).play();
	  $(this).addClass('play').removeClass('pause');
    $('.audioprogress').removeClass('ease-none');
	}
});

function audioProgressBar() {
  
  var duration	=	audioId.duration,
      preTime		=	audioId.currentTime,
      audioTimer, percent,
      bar_offset = -502, 
      percent = (preTime / duration) * 100,
      dashoffset = percent * (bar_offset / 100),
      finalofst = bar_offset + dashoffset;

  $('#bar').css({
    'stroke-dashoffset' : finalofst + 'px'
  });
  
  if(duration == preTime) {
    $('#audio_control').removeClass('active');
    $('#bar').removeAttr('style');
    $('.audioprogress').addClass('ease-none');
  }
  
  $('#dashoffset').html('Duration: ' + duration + '<br>Current Time: ' + preTime);
  
}


/*
audioId.ontimeupdate  = function() {
    audioProgressBar();
};

*/


/*

  audioTimer = setInterval(function(){
    preTime		=	audioId.currentTime;
    audioProgress(preTime);
  }, 1000);

if(preTime > duration) {
      clearInterval(audioTimer);
    }
    else {
      
    }

*/