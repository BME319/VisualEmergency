angular.module('directives',[])
.directive('myOrderingstatus',function(){
  return {
    restrict: 'A',
    
    link: function(scope, element, attrs){
      switch(attrs.myOrderingstatus){
        case '1':element[0].innerHTML='已保存';break;   
        case '2':element[0].innerHTML='已提交';break;
        case '3':element[0].innerHTML='已确认';break;
        case '4':element[0].innerHTML='已执行';break;
        case '10':element[0].innerHTML='作废';break;
        default:element[0].innerHTML=attrs.myOrderingstatus;
      }
    }
  };
})
.directive('myOrderingdept',function(){
  return {
    restrict: 'A',
    
    link: function(scope, element, attrs){
      switch(attrs.myOrderingdept){
        case 'DEPT01':element[0].innerHTML='手术室';break;   
        case 'DEPT02':element[0].innerHTML='重伤病房';break;
        case 'DEPT03':element[0].innerHTML='ICU';break;
        case 'DEPT04':element[0].innerHTML='烧伤病房';break;
        case 'DEPT05':element[0].innerHTML='普通病房';break;
        default:element[0].innerHTML=attrs.myOrderingdept;
      }
    }
  };
})