var microphone_OK = false;
var headphones_OK = false;
var environment_OK = false;
var WORKER_PATH = '../../web/js/recorder/recorderWorker.js';
var encoderWorker = new Worker('../../web/js/recorder/mp3Worker.js');
function __log(e, data) {
	console.log(e);
}
var wavesurfer = Object.create(WaveSurfer);
wavesurfer.init({
	container     : '#waveform',
	waveColor     : 'black',
	interact      : true,
	cursorWidth   : 0
});
var audio_context;
var recorder;
var myTimerID;
var secondRecording = 5;
function waveYes()
{
	microphone_OK = true;
	$('#microphoneConfirm').hide();
	$('#microphoneRecording').show();
	startRecording("test.mp3")
	$('#leftSecond').html(secondRecording);
	myTimerID=setInterval(function () {testRecording()}, 1000);
}
function waveNo()
{
	$('#microphoneAllow').hide();
	$("#microphoneConfirm").hide();
	$("#microphoneTroubleshooting").show();
}
function testRecording()
{
	secondRecording--;
	$('#leftSecond').html(secondRecording);
	$('#leftSecondProgressBar').css('width', secondRecording*(100/5)+'%');
	if(secondRecording<=0)
	{
		$('#step_headphones').removeClass('disabled');
		$('#step_headphones').addClass('active');
		$('#microphoneRecording').hide();
		$('#microphoneConvertToMP3').show();
		clearInterval(myTimerID);
		stopRecording();

	}
}

function settingMicrophone()
{
	try {
		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		navigator.getUserMedia = ( navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.msGetUserMedia);
		window.URL = window.URL || window.webkitURL;
		audio_context = new AudioContext;
	} catch (e) {
		waveNo();
	}
	context = new AudioContext();
	navigator.getUserMedia({
		audio: true
	},
	function(stream) {
		window.source = context.createMediaStreamSource(stream);
		source.connect(context.destination);
		recorder = new Recorder(source, { numChannels: 1,wavesurfer:wavesurfer });
		$('#microphoneAllow').hide();
		$('#microphoneConfirm').show();
		$('#step_microphone').removeClass('active');
		$('#step_microphone').addClass('complete');
		microphoneReady = true;
	}
	,function(e) {
		waveNo();
		microphoneReady = false;
	});
}

function playbackYes()
{
	$('audio').each(function(){
		this.pause(); // Stop playing
		this.currentTime = 0; // Reset time
	});
	headphones_OK = true;
	$("#headphonesPlayback").hide();
	$("#test_finish").show();
	$('#step_finish').removeClass('disabled');
	$('#step_finish').addClass('active');
}

function playbackNo()
{
	$("#headphonesPlayback").hide();
	$("#headphonesTroubleshooting").show();
}

function endEnvironmentSetup()
{
	environment_OK = true;
	$('#environment_setup').remove();
	startSectionIntro();
}

function startRecording(fileName)
{
	recorder && recorder.record(fileName);
	$('#waveform').show();
}

function stopRecording()
{
	$('#waveform').hide();
	__log('Stopped recording.');
	recorder && recorder.stop();
	recorder && recorder.exportWAV(function(blob) {
		if(environment_OK)
		{
			if(typeof stopRecordingCallback == 'function')
			{
				stopRecordingCallback(blob);
			}
		}
		else
		{
			$('#step_headphones').removeClass('active');
			$('#step_headphones').addClass('complete');
			$('#test_microphone').hide();
			$('#test_headphones').show();
		}
	});
	recorder.clear();
}