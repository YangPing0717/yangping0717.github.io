$( document ).ready(function() {
	$("#mp3player").jPlayer({
		ready: function() {
		},
		ended: function() {
			if(typeof endedPlayCallback == 'function')
		  {
		    endedPlayCallback();
		  }
		},
		timeupdate: function(event) { // 4Hz
			if(typeof timeupdateCallback == 'function')
		  {
		  	var percent = Math.floor( event.jPlayer.status.currentPercentAbsolute );
		    timeupdateCallback(percent);
		  }
    },
		solution:"html,flash",
		supplied:"mp3",
		// cssSelectorAncestor: "#cp_container",
		swfPath: "../../web/js/jplayer/dist/jplayer",
		wmode: "window",
		smoothPlayBar: true,
		keyEnabled: false,
		remainingDuration: true,
		toggleDuration: true
	});
});

function jplayerPlay(file)
{
	$("#mp3player").jPlayer("setMedia",{mp3:file});
	$("#mp3player").jPlayer("play");
	console.log('jplayer play : '+file);
}

function jplayerStop(file)
{
	$("#mp3player").jPlayer("stop");
}