$(function() {
  $( ".draggable" ).draggable({
    revert: "invalid",
    start: function(event, ui) {
      $(this).css("z-index", 9999);
      $('.droppable').css({"overflow":""});
    },
    stop: function( event, ui ) {
      $(this).css("z-index", 0);
      $(this).css({"top":"0px","left":"0px","width":""});
      $('.droppable').css({"overflow":""});
    }
  });
  $( ".droppable:not(.options)" ).css({"min-height":"60px","overflow":"","padding":"5px"});
  $( ".droppable.options" ).css({"min-height":"120px","overflow":"auto"});
  $( ".droppable" ).droppable({
    accept: function(d) {
      if($(this).hasClass('options')) {
        return true;
      }
      else
      {
        return $(this).find('input').length === 0;
      }
    },
    over: function( event, ui ) {
      $(this).css({"background-color":"#f1e9ff"});
    },
    out: function( event, ui ) {
      $(this).css({"background-color":""});
    },
    drop: function( event, ui ) {
      var index = $(this).attr('group_index');
      var checked = !$(this).hasClass('options');

      $(ui.draggable).find('input[type=radio],input[type=checkbox]').prop('checked',checked).attr('name','answer['+index+'][]');
      $(ui.draggable).appendTo($(this)).css({"top":"0px","left":"0px","width":""});

      if($(this).hasClass('options'))
      {
        $(this).css({"min-height":"120px","overflow":"auto"});
      }
      $(this).css({"background-color":"","padding":"5px"});
      if(typeof choiceAnswerCallback == 'function')
      {
        choiceAnswerCallback();
      }
    }
  });
});