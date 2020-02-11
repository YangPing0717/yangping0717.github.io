
//_name是包含此文件的<script>的id值
var v = document.getElementById("visits_js");
//下面的name是url中的参数名
var cmsURL = getUrlParameterAdv("cmsURL",v.getAttribute('src'));
var siteID = getUrlParameterAdv("siteId",v.getAttribute('src'));
var messageID = getUrlParameterAdv("messageId",v.getAttribute('src'));

/**
 * 访问统计
 * Created by zab
 */
$(function(){
	
	$.ajax({
		url: cmsURL + "/sysVisitorLogController/visit.do",  
		dataType:'jsonp',
		data:{
			'siteId' : siteID,
			'messageId' : messageID
			}, 
		success:function(result) {  
			if(result.success){
				$('#visitcount').text(result.count);
				var ht = '';
				if(result.backMsgTitle){
					if(siteID=='596d3c98-b016-43dc-89a5-4ff2b7674f8b'){
						ht += '<span>Previous：</span>';
					}else{
						ht += '<span>上一条：</span>';
					}
					
					ht += '<a title="'+result.backMsgTitle+'" href="'+result.backMsgUrl+'">'+result.backMsgTitle.substring(0,35)+'</a>';
					ht += '<br>';
				}
				if(result.nextMsgTitle){
					if(siteID == '596d3c98-b016-43dc-89a5-4ff2b7674f8b'){
						ht += '<span>Next：</span>';
					}else{
						ht += '<span>下一条：</span>';
					}
					
					ht += '<a title="'+result.nextMsgTitle+'" href="'+result.nextMsgUrl+'">'+result.nextMsgTitle.substring(0,35)+'</a>';
				}
				if(ht != ''){
					//console.log(ht);
					$(".art-cpage").html(ht);
				}
			}
		}, 
		timeout:3000  
	}); 
				
			
});
