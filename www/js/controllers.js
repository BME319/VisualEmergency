angular.module('controllers',['ngResource','services'])
.controller('homeCtrl',[ '$scope', function($scope){
  $scope.home={'imgUrl1':'image/866index.jpg',
               'imgUrl2':'image/OR.jpg',
               'imgUrl3':'image/ICU.jpg'
  }
}])
.controller('deliverCtrl',['$scope','DeliverInfo',  function($scope,DeliverInfo){
  $scope.places=[
  {imgUrl:'image/OR.jpg',name:'手术室',action:'OperationRoom'},
  {imgUrl:'image/ICU.jpg',name:'ICU',action:'ICURoom'},
  {imgUrl:'image/commonWard.jpg',name:'普通病房',action:'CommonRoom'},
  {imgUrl:'image/burnWard.jpg',name:'烧伤病房',action:'BurnRoom'},
  {imgUrl:'image/zhongshangWard.jpg',name:'重伤病房',action:'SeriousInjuredRoom'},
  {imgUrl:'image/outPatient.jpg',name:'门诊救治人员',action:'OutPatientRoom'},
  //{imgUrl:'http://10.12.43.35:8003/../../Content/image/RescueStaffDistribution.jpg',name:'救治人员',num:0,action:'RescueStaffDistribution'},
  ];
  $scope.p= {'imgUrl':'image/RescueStaffDistribution.jpg',name:'救治人员',action:'OutPatientRoom'};  
  var promise_Num = DeliverInfo.GetDeliverInfoNum();
    promise_Num.then(function(data)
    { 
     $scope.AllNum = data.AllNum;
       $scope.SurgNum = data.SurgNum;
       $scope.BurnNum = data.BurnNum;
       $scope.SeriNum = data.SeriNum;
       $scope.ICUNum = data.ICUNum;
       $scope.NormNum = data.NormNum;
       $scope.OutPNum = data.OutPNum;
     },function(err) {   
   });

}])
.controller('deliverRoomCtrl',['$scope','$stateParams','$state','chartTool',  function($scope,$stateParams,$state,chartTool){
  $scope.room=$stateParams.place;
  $scope.renderCharts=[false,true,true,true,true,true,true,true];
  //更新TABLE的函数，（可以先把table画好,table上加一个关闭的按钮，绑定再说）
  function updateTable(i,params){
    $scope.$apply(function(){
      $scope.table={index:i,name:params.name,value:params.value};
    });
  }

  var tableIndex=-1,paramsData=null;
  function showTable(i,params){
    if(tableIndex==i && params.data==paramsData){
      tableIndex=-1,paramsData=null;
      $scope.$apply(function(){
        $scope.renderCharts=[false,true,true,true,true,true,true,true];
      })
      return;
    }
    tableIndex=i,paramsData=params.data;
    $scope.$apply(function(){
      if(i<3){
        $('#table').removeClass('col-xs-8').addClass('col-xs-12');
        $scope.renderCharts=[true,true,true,false,false,false,false,false];
      }else{
        $('#table').removeClass('col-xs-12').addClass('col-xs-8');
        for(j=3;j<8;++j){
          if(j!=i)
            $scope.renderCharts[j]=false;
        }
        $scope.renderCharts[0]=true;
      }
    });
    return updateTable(i,params);
  }
  function listenChart(chart){
      chart.on('click',function(params){
        return showTable(parseInt(chart._dom.id[5]),params);
      });      
  }
  function listenChartsClick(){
    for(var i in arguments){
      if(arguments[i]._chartsMap instanceof Object){
        listenChart(arguments[i]);
      }
    }
  }

  var myChart1 = echarts.init(document.getElementById('chart1'));
  var data1={
    title:'手术状态统计',
    data:[{
            value : 10,
            name : '手术中'
          }, {
            value : 20,
            name : '手术完成'
          }
        ]
  }
  myChart1.setOption(chartTool.initBar('手术状态统计'));
  myChart1.setOption(chartTool.getOptionBar(data1));

  myChart2 = echarts.init(document.getElementById('chart2'));
  var data2={
    title:'后送方式',
    data:[{
            value : 10,
            name : '急救船'
          }, {
            value : 20,
            name : '直升机'
          }, {
            value : 30,
            name : '甲板1'
          }, {
            value : 40,
            name : '甲板2'
          }
        ]
  }  
  myChart2.setOption(chartTool.initBar('后送方式'));
  myChart2.setOption(chartTool.getOptionBar(data2));


  myChart3 = echarts.init(document.getElementById('chart3'));
  myChart4 = echarts.init(document.getElementById('chart4'));
  myChart5 = echarts.init(document.getElementById('chart5'));
  myChart6 = echarts.init(document.getElementById('chart6'));
  myChart7 = echarts.init(document.getElementById('chart7'));
  
  myChart3.setOption(chartTool.initPie('伤员数量'));
  myChart4.setOption(chartTool.initPie('伤员数量'));
  myChart5.setOption(chartTool.initPie('伤员数量'));
  myChart6.setOption(chartTool.initPie('伤员数量'));
  myChart7.setOption(chartTool.initPie('伤员数量'));
  
  var option3 = {
    title : '伤部统计',
    data : [{
        value : 10,
        name : '上肢'
      }, {
        value : 5,
        name : '脊柱脊髓'
      }, {
        value : 15,
        name : '面部'
      }, {
        value : 25,
        name : '颈部'
      }, {
        value : 20,
        name : '腰部及盆骨'
      }
    ]
  };
  myChart3.setOption(chartTool.getOptionPie(option3));

  var option4 = {
    title :'伤型统计',
    data : [{
        value : 10,
        name : '皮肤及软组织挫伤'
      }, {
        value : 5,
        name : '皮肤及软组织撕裂'
      }, {
        value : 15,
        name : '盲管伤'
      }, {
        value : 25,
        name : '穿透伤'
      }
    ]
  };
  myChart4.setOption(chartTool.getOptionPie(option4));

  var option5 = {
    title : '伤类统计',
    data : [{
        value : 3,
        name : '刃器伤'
      }, {
        value : 18,
        name : '枪弹伤'
      }, {
        value : 15,
        name : '撞击伤'
      }, {
        value : 25,
        name : '烧伤'
      }
    ]
  };
  myChart5.setOption(chartTool.getOptionPie(option5));

  var option6 = {
    title : '伤势统计',
    data : [{
        value : 3,
        name : '危重伤'
      }, {
        value : 18,
        name : '轻伤'
      }, {
        value : 25,
        name : '重伤'
      }
    ]
  };
  myChart6.setOption(chartTool.getOptionPie(option6));

  var option7 = {
    title : '并发症统计',
    data : [{
        value : 3,
        name : '大出血'
      }, {
        value : 18,
        name : '气性坏疽'
      }, {
        value : 15,
        name : '截瘫'
      }, {
        value : 25,
        name : '窒息'
      }
    ]
  };    
  myChart7.setOption(chartTool.getOptionPie(option7));

  $(window).on("resize.doResize", function (){
      $scope.$apply(function(){
          myChart1.resize();
          myChart2.resize();
          myChart3.resize();
          myChart4.resize();
          myChart5.resize();
          myChart6.resize();
          myChart7.resize();
      });
  });
  $scope.$on("$destroy",function (){
      $(window).off("resize.doResize"); //remove the handler added earlier
  });

  listenChartsClick(myChart1,myChart2,myChart3,myChart4,myChart5,myChart6,myChart7); 
}])
.controller('deliverRescueStaffDistributionCtrl',['$scope','chartTool',  function($scope,chartTool){
  $scope.renderCharts=[false,true,true,true,true,true,true,true];
  //更新TABLE的函数，（table上加一个关闭的按钮，绑定再说）
  function updateTable(i,params){
    $scope.$apply(function(){
      $scope.table={index:i,name:params.name,value:params.value};
    });
  }

  var tableIndex=-1,paramsData=null;
  function showTable(i,params){
    if(tableIndex==i && params.data==paramsData){
      tableIndex=-1,paramsData=null;
      $scope.$apply(function(){
        $scope.renderCharts=[false,true,true,true,true,true,true,true];
      })
      return;
    }
    tableIndex=i,paramsData=params.data;
    $scope.$apply(function(){
      if(i<3){
        $('#table').removeClass('col-xs-8').addClass('col-xs-12');
        $scope.renderCharts=[true,true,true,false,false,false,false,false];
      }else{
        $('#table').removeClass('col-xs-12').addClass('col-xs-8');
        for(j=3;j<8;++j){
          if(j!=i)
            $scope.renderCharts[j]=false;
        }
        $scope.renderCharts[0]=true;
      }
    });
    return updateTable(i,params);
  }
  function listenChart(chart){
      chart.on('click',function(params){
        return showTable(parseInt(chart._dom.id[5]),params);
      });      
  }
  function listenChartsClick(){
    for(var i in arguments){
      if(arguments[i]._chartsMap instanceof Object){
        listenChart(arguments[i]);
      }
    }
  }

  var myChart1 = echarts.init(document.getElementById('chart1'));
  var data1={
    title:'手术状态统计',
    data:[{
            value : 10,
            name : '手术中'
          }, {
            value : 20,
            name : '手术完成'
          }
        ]
  }
  myChart1.setOption(chartTool.initBar('手术状态统计'));
  myChart1.setOption(chartTool.getOptionBar(data1));

  myChart2 = echarts.init(document.getElementById('chart2'));
  var data2={
    title:'后送方式',
    data:[{
            value : 10,
            name : '急救船'
          }, {
            value : 20,
            name : '直升机'
          }, {
            value : 30,
            name : '甲板1'
          }, {
            value : 40,
            name : '甲板2'
          }
        ]
  }  
  myChart2.setOption(chartTool.initPie('后送方式'));
  myChart2.setOption(chartTool.getOptionPie(data2));


  myChart3 = echarts.init(document.getElementById('chart3'));
  myChart4 = echarts.init(document.getElementById('chart4'));
  myChart5 = echarts.init(document.getElementById('chart5'));
  myChart6 = echarts.init(document.getElementById('chart6'));
  myChart7 = echarts.init(document.getElementById('chart7'));
  
  myChart3.setOption(chartTool.initPie('伤员数量'));
  myChart4.setOption(chartTool.initPie('伤员数量'));
  myChart5.setOption(chartTool.initPie('伤员数量'));
  myChart6.setOption(chartTool.initPie('伤员数量'));
  myChart7.setOption(chartTool.initPie('伤员数量'));
  
  var option3 = {
    title : '伤部统计',
    data : [{
        value : 10,
        name : '上肢'
      }, {
        value : 5,
        name : '脊柱脊髓'
      }, {
        value : 15,
        name : '面部'
      }, {
        value : 25,
        name : '颈部'
      }, {
        value : 20,
        name : '腰部及盆骨'
      }
    ]
  };
  myChart3.setOption(chartTool.getOptionPie(option3));

  var option4 = {
    title :'伤型统计',
    data : [{
        value : 10,
        name : '皮肤及软组织挫伤'
      }, {
        value : 5,
        name : '皮肤及软组织撕裂'
      }, {
        value : 15,
        name : '盲管伤'
      }, {
        value : 25,
        name : '穿透伤'
      }
    ]
  };
  myChart4.setOption(chartTool.getOptionPie(option4));

  var option5 = {
    title : '伤类统计',
    data : [{
        value : 3,
        name : '刃器伤'
      }, {
        value : 18,
        name : '枪弹伤'
      }, {
        value : 15,
        name : '撞击伤'
      }, {
        value : 25,
        name : '烧伤'
      }
    ]
  };
  myChart5.setOption(chartTool.getOptionPie(option5));

  var option6 = {
    title : '伤势统计',
    data : [{
        value : 3,
        name : '危重伤'
      }, {
        value : 18,
        name : '轻伤'
      }, {
        value : 25,
        name : '重伤'
      }
    ]
  };
  myChart6.setOption(chartTool.getOptionPie(option6));

  var option7 = {
    title : '并发症统计',
    data : [{
        value : 3,
        name : '大出血'
      }, {
        value : 18,
        name : '气性坏疽'
      }, {
        value : 15,
        name : '截瘫'
      }, {
        value : 25,
        name : '窒息'
      }
    ]
  };    
  myChart7.setOption(chartTool.getOptionPie(option7));

  $(window).on("resize.doResize", function (){
      $scope.$apply(function(){
          myChart1.resize();
          myChart2.resize();
          myChart3.resize();
          myChart4.resize();
          myChart5.resize();
          myChart6.resize();
          myChart7.resize();
      });
  });
  $scope.$on("$destroy",function (){
      $(window).off("resize.doResize"); //remove the handler added earlier
  });

  listenChartsClick(myChart1,myChart2,myChart3,myChart4,myChart5,myChart6,myChart7);   
}])

.controller('analysisCtrl',['$scope','$sce', 'CONFIG', function($scope,$sce,CONFIG){
 
}])

//门诊分析
.controller('DateCtrl',['$scope', '$sce', 'CONFIG',function($scope, $sce,CONFIG){
  $scope.template=CONFIG.makeUrl+"ClinicInfo_Date.dashboard";
  $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);
  
}])
.controller('DepartmentCtrl',['$scope','$sce', 'CONFIG',  function($scope,$sce,CONFIG){
  $scope.template=CONFIG.makeUrl+"ClinicInfo_Dept.dashboard";
  $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);

}])
.controller('NationalityCtrl',['$scope','$sce', 'CONFIG',  function($scope,$sce,CONFIG){
  $scope.template=CONFIG.makeUrl+"ClinicInfo_Country.dashboard";
  $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);

}])

//住院分析
.controller('InpatientDateCtrl',['$scope','$sce', 'CONFIG',  function($scope,$sce,CONFIG){
  $scope.template=CONFIG.makeUrl+"WardFlowCount.dashboard";
  $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);

}])
.controller('InpatientWardCtrl',['$scope','$sce', 'CONFIG',  function($scope,$sce,CONFIG){
  $scope.template=CONFIG.makeUrl+"WardFlowAnalysis.dashboard";
  $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);

}])
.controller('InpatientDoctorCtrl',['$scope','$sce', 'CONFIG',  function($scope,$sce,CONFIG){
  $scope.template=CONFIG.makeUrl+"WardFlowAnalysis_Doctor.dashboard";
  $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);

}])
.controller('InpatientAverageDayCtrl',['$scope','$sce', 'CONFIG',  function($scope,$sce,CONFIG){
  $scope.template=CONFIG.makeUrl+"AVGLOS.dashboard";
  $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);

}])
.controller('OccupancyRateCtrl',['$scope','$sce', 'CONFIG',  function($scope,$sce,CONFIG){
  $scope.template=CONFIG.makeUrl+"InBedPercentage.dashboard";
  $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);

}])

//手术分析
.controller('OperationStatusGradeCtrl',['$scope','$sce', 'CONFIG',  function($scope,$sce,CONFIG){
  $scope.template=CONFIG.makeUrl+"SurOrderInfo.dashboard";
  $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);

}])

//诊断分析
.controller('DiagnosisScaleCtrl',['$scope','$sce', 'CONFIG',  function($scope,$sce,CONFIG){
  $scope.template=CONFIG.makeUrl+"DiseaseInfo.dashboard";
  $scope.activeTemplate = $sce.trustAsResourceUrl($scope.template);
}])

//信息查询
.controller('InquiryCtrl',['$scope'  ,function($scope){
  $scope.Info=[
  {imgUrl:'image/doctor.jpg',name:'医生信息',action:'Doctor'},
  {imgUrl:'image/Operation.jpg',name:'手术室信息',action:'OperationRoom'},
  {imgUrl:'image/Assist.jpg',name:'辅助信息',action:'Assist'},
  {imgUrl:'image/deck.jpg',name:'甲板信息',action:'Deck'},
  {imgUrl:'image/InjuriedPatient.jpg',name:'重伤患者信息详情',action:'InjuriedPatient'},
  {imgUrl:'image/OutPatient.jpg',name:'重要身份患者细信息详情',action:'IndentityPatient'},
  ];
   
}])
.controller('DoctorInfoCtrl',['$scope','$stateParams','$state',  function($scope,$stateParams,$state){
 
}])
.controller('OperationRoomInfoCtrl',['$scope','$stateParams','$state',  function($scope,$stateParams,$state){

}])
.controller('AssistInfoCtrl',['$scope',  function($scope){
  
}])
.controller('DeckInfoCtrl',['$scope','$stateParams','$state',  function($scope,$stateParams,$state){

}])
.controller('InjuriedPatientInfoCtrl',['$scope','$stateParams','$state',  function($scope,$stateParams,$state){

}])
.controller('IndentityPatientInfoCtrl',['$scope','$stateParams','$state',  function($scope,$stateParams,$state){
  $scope.Info=$stateParams.Info;
}])