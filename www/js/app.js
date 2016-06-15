'use strict';

angular.module('VisualEmergency',['ui.router','controllers','services','filters','directives'])

.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise("/home");
  $stateProvider
    .state('home',{
      url:"/home",
      templateUrl:"templates/home.html",
      //controller:"homeCtrl"
    })
    .state('deliver',{
      url:"/deliver",
      templateUrl:"templates/deliver.html",
      controller:"deliverCtrl"
    })
    .state('analysis',{
      url:"/analysis",
      templateUrl:"templates/analysis.html",
      controller:"analysisCtrl"
    })

    .state('deliverRoom',{
      url:"/deliver/:place",
      //templateUrl:"templates/deliverRoomDetail.html",
      templateUrl:function($stateParams){
        if($stateParams.place!='RescueStaffDistribution')
          return "templates/deliverRoomDetail.html";
        else
          return "templates/deliverRescueStaffDistribution.html";
      },
      //controller:"deliverRoomCtrl",
      controllerProvider:function($stateParams){
        if($stateParams.place!='RescueStaffDistribution')
          return 'deliverRoomCtrl';
        else
          return 'deliverRescueStaffDistributionCtrl';
      }
    })
    // .state('deliverRescueStaffDistribution',{
    //   url:"/deliverRescueStaffDistribution",
    //   templateUrl:"templates/deliverRescueStaffDistribution.html",
    //   //controller:"deliverRescueStaffDistributionCtrl"
    // })    
}])
.run(['$rootScope','$stateParams',function($rootScope,$stateParams){
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
    // do something
    var subHeader_dict={
      OperationRoom:'手术室实时情况',
      ICURoom:'ICU实时情况',
      CommonRoom:'普通病房实时情况',
      BurnRoom:'烧伤病房实时情况',
      SeriousInjuredRoom:'重伤病房实时情况',
      OutPatientRoom:'门诊实时情况',
      RescueStaffDistribution:'救治人员分布实时情况'
    }
    switch(toState.name){
      case 'analysis':$rootScope.subHeader='数据分析';break;
      case 'deliver':$rootScope.subHeader='分流信息';break;
      case 'deliverRoom':$rootScope.subHeader=subHeader_dict[$stateParams.place];break;
      default:$rootScope.subHeader='';break;
    }
  })
}])