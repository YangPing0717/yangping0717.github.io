$(function() {
  $( ".draggable" ).draggable({
    revert: "invalid",
    start: function(event, ui) {
      $(this).css("z-index", 9999);
      $('.droppable').css({"overflow":''});
    },
    stop: function( event, ui ) {
      $(this).css("z-index", 0);
      $('.droppable').css({"overflow":'auto'});
    }
  });
  $( ".droppable" ).css({"min-height":"100px","overflow":"auto"});
  $( ".droppable" ).droppable({
    over: function( event, ui ) {
      $(this).css({"background-color":"#eae5f2"});
      var minHeight = $(this)[0].scrollHeight > 100 ? $(this)[0].scrollHeight : 100;
      $(this).css('min-height',minHeight);
    },
    out: function( event, ui ) {
      $(this).css({"background-color":""});
      var minHeight = $(this)[0].scrollHeight > 100 ? $(this)[0].scrollHeight : 100;
      $(this).css('min-height',minHeight);
    },
    drop: function( event, ui ) {
      var index = $('.current .droppable').index($(this));
      var checked = !$(this).hasClass('options');

      $(ui.draggable).find('input[type=radio],input[type=checkbox]').prop('checked',checked).attr('name','answer['+index+'][]');
      $(ui.draggable).appendTo($(this)).css({"top":"0px","left":"0px"});

      var minHeight = $(this)[0].scrollHeight > 100 ? $(this)[0].scrollHeight : 100;
      $(this).css('min-height',minHeight);

      $(this).css({"background-color":""});
      if(typeof choiceAnswerCallback == 'function')
      {
        choiceAnswerCallback();
      }
    }
  });
});