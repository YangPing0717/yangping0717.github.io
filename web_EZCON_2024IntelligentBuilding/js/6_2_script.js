$(document).ready(function() {
  var bubbleList = $('.bubble-container');
  const bubbleCount = bubbleList.length;
  const degStep = 200 / (bubbleCount - 1);
 
  $('.bubble-container').each((index) => {
   const deg = index * degStep;
   const invertDeg = deg * -1;    

    $(bubbleList[index]).css('transform', `rotate(${deg}deg)`);
    $(bubbleList[index]).css('opacity', `1`);
    $(bubbleList[index]).find('.bubble').css('transform', `rotate(${invertDeg}deg)`);
  }) 
})