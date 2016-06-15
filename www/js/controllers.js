angular.module('controllers',[])
// .controller('homeCtrl',[  function(){

// }])
.controller('deliverCtrl',['$scope',  function($scope){
  $scope.places=[
  {imgUrl:'http://10.12.43.35:8003/../../Content/image/OR.jpg',name:'手术室',num:0,action:'OperationRoom'},
  {imgUrl:'http://10.12.43.35:8003/../../Content/image/ICU.jpg',name:'ICU',num:0,action:'ICURoom'},
  {imgUrl:'http://10.12.43.35:8003/../../Content/image/commonWard.jpg',name:'普通病房',num:0,action:'CommonRoom'},
  {imgUrl:'http://10.12.43.35:8003/../../Content/image/burnWard.jpg',name:'烧伤病房',num:0,action:'BurnRoom'},
  {imgUrl:'http://10.12.43.35:8003/../../Content/image/zhongshangWard.jpg',name:'重伤病房',num:0,action:'SeriousInjuredRoom'},
  {imgUrl:'http://10.12.43.35:8003/../../Content/image/outPatient.jpg',name:'门诊',num:0,action:'OutPatientRoom'},
  //{imgUrl:'http://10.12.43.35:8003/../../Content/image/RescueStaffDistribution.jpg',name:'救治人员',num:0,action:'RescueStaffDistribution'},
  ];
}])
.controller('deliverRoomCtrl',['$scope','$stateParams','$state',  function($scope,$stateParams,$state){
  $scope.room=$stateParams.place;
}])
.controller('deliverRescueStaffDistributionCtrl',['$scope',  function($scope){
  
}])

.controller('analysisCtrl',['$scope', function($scope){

}])