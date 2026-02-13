

// $(document).ready(function() {
//   var bubbleList = $('.bubble-container');
//   const bubbleCount = bubbleList.length;
//   const degStep = 200 / (bubbleCount - 1);
 
//   $('.bubble-container').each((index) => {
//    const deg = index * degStep;
//    const invertDeg = deg * -1;    

//     $(bubbleList[index]).css('transform', `rotate(${deg}deg)`);
//     $(bubbleList[index]).css('opacity', `1`);
//     $(bubbleList[index]).find('.bubble').css('transform', `rotate(${invertDeg}deg)`);
//   }) 
// })



$(document).ready(function() {
    // 1. 先將氣泡動畫邏輯封裝成一個函式
    function startBubbleAnimation() {
        var bubbleList = $('.bubble-container');
        const bubbleCount = bubbleList.length;
        const degStep = 200 / (bubbleCount - 1);

        bubbleList.each(function(index) {
            const deg = index * degStep;
            const invertDeg = deg * -1;

            $(this).css({
                'transform': `rotate(${deg}deg)`,
                'opacity': '1',
                'transition': 'all 0.8s ease-out' // 讓氣泡旋轉過程也有平滑動畫
            });
            
            $(this).find('.bubble').css({
                'transform': `rotate(${invertDeg}deg)`,
                'transition': 'all 0.8s ease-out'
            });
        });
    }

    // 2. 初始化 WOW.js 並設定 callback
    var wow = new WOW({
        callback: function(box) {
            // 檢查觸發的元素是否為包含氣泡的區塊 (假設該區塊 id 為 bubble-section)
            if (box.id === 'bubble-section' || $(box).hasClass('trigger-bubble')) {
                
                // 設定延遲時間，確保 fadeInRight 先跑完 (通常 WOW 預設動畫為 1s)
                setTimeout(function() {
                    startBubbleAnimation();
                }, 800); // 800ms 後跑氣泡動畫，可依需求調整
            }
        }
    });
    
    wow.init();
});