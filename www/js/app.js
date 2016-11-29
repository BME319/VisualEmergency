'use strict';

angular.module('VisualEmergency',['ui.router','controllers','services','directives'])

.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
  $urlRouterProvider.otherwise("/home");
  $stateProvider
    .state('home',{
      url:"/home",
      templateUrl:"templates/home.html"
    })
    .state('deliver',{
      url:"/deliver",
      templateUrl:"templates/deliver.html",
      controller:"deliverCtrl"
    })
    .state('deliverRoom',{
      url:"/deliver/:place",
      templateUrl:function($stateParams){
        if($stateParams.place!='RescueStaffDistribution')
          return "templates/deliverRoomDetail.html";
        else
          return "templates/deliverRescueStaffDistribution.html";
      },
      controllerProvider:function($stateParams){
        if($stateParams.place!='RescueStaffDistribution')
          return 'deliverRoomCtrl';
        else
          return 'deliverRescueStaffDistributionCtrl';
      }
    })  

    .state('analysis',{
      url:"/analysis",
      templateUrl:"templates/analysis.html",
      controller:"analysisCtrl"
    })
    .state('Inquiry',{
      url:"/Inquiry",
      templateUrl:"templates/Inquiry.html",
      controller:"InquiryCtrl"
    })

    //门诊分析
    .state('analysis.ClinicDate',{
      url:"/ClinicDate",
      templateUrl:"templates/ClinicAnalysis/Date.html",
      controller:"DateCtrl"
    })
    .state('analysis.ClinicDepartment',{
      url:"/ClinicDepartment",
      templateUrl:"templates/ClinicAnalysis/Department.html",
      controller:"DepartmentCtrl"
    })
    .state('analysis.ClinicNationality',{
      url:"/ClinicNationality",
      templateUrl:"templates/ClinicAnalysis/Nationality.html",
      controller:"NationalityCtrl"
    })

     //住院分析
    .state('analysis.InpatientDate',{
      url:"/InpatientDate",
      templateUrl:"templates/InpatientAnalysis/InpatientDate.html",
      controller:"InpatientDateCtrl"
    })
    .state('analysis.InpatientWard',{
      url:"/InpatientWard",
      templateUrl:"templates/InpatientAnalysis/InpatientWard.html",
      controller:"InpatientWardCtrl"
    })
    .state('analysis.InpatientDoctor',{
      url:"/InpatientDoctor",
      templateUrl:"templates/InpatientAnalysis/InpatientDoctor.html",
      controller:"InpatientDoctorCtrl"
    })
    
    .state('analysis.InpatientAverageDay',{
      url:"/InpatientAverageDay",
      templateUrl:"templates/InpatientAnalysis/InpatientAverageDay.html",
      controller:"InpatientAverageDayCtrl"
    })
    .state('analysis.OccupancyRate',{
      url:"/OccupancyRate",
      templateUrl:"templates/InpatientAnalysis/OccupancyRate.html",
      controller:"OccupancyRateCtrl"
    })

    //手术分析
    .state('analysis.OperationStatusGrade',{
      url:"/OperationStatusGrade",
      templateUrl:"templates/OperationAnalysis/OperationStatusGrade.html",
      controller:"OperationStatusGradeCtrl"
    })
   
    //诊断分析
    .state('analysis.DiagnosisScale',{
      url:"/DiagnosisScale",
      templateUrl:"templates/DiagnosticAnalysis/DiagnosisScale.html",
      controller:"DiagnosisScaleCtrl"
    })
    .state('Information',{
      url:"/Inquiry/:Info",
      //templateUrl:"templates/deliverRoomDetail.html",
      templateUrl:function($stateParams){
      
        return "templates/Inquiry/"+$stateParams.Info+"Info.html";
      },
      //controller:"deliverRoomCtrl",
      controllerProvider:function($stateParams){
      
          return $stateParams.Info + 'InfoCtrl';
      }
    })


}])
.run(['$rootScope','$stateParams','$interval',function($rootScope,$stateParams,$interval){
  $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    $interval.cancel($rootScope.timer);
    $interval.cancel($rootScope.timer2);
    $interval.cancel($rootScope.tableTimer);
    $interval.cancel($rootScope.tableTimer2);
    $("ul.nav li").removeClass('active');
    switch(toState.url.substr(1,4)){
      case 'deli':$('li#deli').addClass('active');break;
      case 'anal':$('li#anal').addClass('active');break;
      case 'Inqu':$('li#Inqu').addClass('active');break;
      case 'home':$('li#home').addClass('active');break;
      default:$('li#anal').addClass('active');break;
    }
    var subHeader_dict={
      Dept01:'手术室实时情况',
      Dept03:'ICU实时情况',
      Dept05:'普通病房实时情况',
      Dept04:'烧伤病房实时情况',
      Dept02:'重伤病房实时情况',
      OutPatientRoom:'门诊实时情况',
      RescueStaffDistribution:'救治人员分布实时情况'
    }
    var subHeader_Info={
      Doctor:'医生信息',
      OperationRoom:'手术室信息',
      Assist:'辅助信息',
      Deck:'甲板信息',
      InjuriedPatient:'重伤患者信息详情',
      IndentityPatient:'重要身份患者信息详情'
    }    
    switch(toState.name){
      case 'analysis':$rootScope.subHeader='数据分析';break;
      case 'analysis.ClinicDate':$rootScope.subHeader='数据分析';break;
      case 'analysis.ClinicDepartment':$rootScope.subHeader='数据分析';break;
      case 'analysis.ClinicNationality':$rootScope.subHeader='数据分析';break;
      case 'analysis.InpatientDate':$rootScope.subHeader='数据分析';break;
      case 'analysis.InpatientWard':$rootScope.subHeader='数据分析';break;
      case 'analysis.InpatientAverageDay':$rootScope.subHeader='数据分析';break;
      case 'analysis.InpatientDoctor':$rootScope.subHeader='数据分析';break;
      case 'analysis.OccupancyRate':$rootScope.subHeader='数据分析';break;
      case 'analysis.OperationStatusGrade':$rootScope.subHeader='数据分析';break;
      case 'analysis.DiagnosisScale':$rootScope.subHeader='数据分析';break;
      case 'deliver':$rootScope.subHeader='分流信息';break;
      case 'deliverRoom':$rootScope.subHeader=subHeader_dict[$stateParams.place];break;
      case 'Inquiry':$rootScope.subHeader='信息查询';break;
      case 'Information':$rootScope.subHeader=subHeader_Info[$stateParams.Info];break;
      default:$rootScope.subHeader='';break;
    }
  })
  $rootScope.GIS=window.open("/haizong/haizong-webgis/gis.html","","",true);
}])