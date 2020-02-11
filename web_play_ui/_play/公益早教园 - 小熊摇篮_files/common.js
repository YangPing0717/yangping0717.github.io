//para asName String:要得到的参数名
//para lsURL String:要处理的URL值
//这个函数是在html传参数函数基础上改的
function getUrlParameterAdv(asName,lsURL){

 loU = lsURL.split("?");
 if (loU.length>1){

  var loallPm = loU[1].split("&");

  for (var i=0; i<loallPm.length; i++){
   var loPm = loallPm[i].split("=");
   if (loPm[0]==asName){
    if (loPm.length>1){
     return loPm[1];
    }else{
     return "";
    }
   }
  }
 }
 return null;
}

//_name是包含此文件的<script>的id值
var v = document.getElementById("common_js");
//下面的name是url中的参数名
var siteURL = getUrlParameterAdv("siteURL", v.getAttribute('src'));

!window.jQuery && document.write("<script src=\""+siteURL+"/resource/js/jquery-1.9.1.min.js\">"+"</scr"+"ipt>");