angular.module('controllers',['ngResource','services'])
.controller('deliverCtrl',['$scope','DeliverInfo',  function($scope,DeliverInfo){
  $scope.places=[
  {imgUrl:'image/OR.jpg',name:'手术室',action:'OperationRoom'},
  {imgUrl:'image/ICU.jpg',name:'ICU',action:'ICURoom'},
  {imgUrl:'image/commonWard.jpg',name:'普通病房',action:'CommonRoom'},
  {imgUrl:'image/burnWard.jpg',name:'烧伤病房',action:'BurnRoom'},
  {imgUrl:'image/zhongshangWard.jpg',name:'重伤病房',action:'SeriousInjuredRoom'},
  {imgUrl:'image/outPatient.jpg',name:'门诊救治人员',action:'OutPatientRoom'},
  ];
  $scope.p= {'imgUrl':'image/RescueStaffDistribution.jpg',name:'救治人员',action:'OutPatientRoom'};  
  var promise_Num = DeliverInfo.GetDeliverInfoNum();
    promise_Num.then(function(data)
    { 
      $scope.p.ALLNum = data.AllNum;
       $scope.places[0].Num = data.SurgNum;
       $scope.places[1].Num = data.ICUNum;
       $scope.places[2].Num = data.NormNum;
       $scope.places[3].Num = data.BurnNum;
       $scope.places[4].Num = data.SeriNum;
       $scope.places[5].Num = data.OutPNum;
     },function(err) {   
   });

}])

.controller('deliverRoomCtrl',['$scope','$rootScope','$stateParams','$state','$interval','chartTool','PatientsByDB','PatientDeptDeliver','Deliver','Info',  function($scope,$rootScope,$stateParams,$state,$interval,chartTool,PatientsByDB,PatientDeptDeliver,Deliver,Info){
  // $scope.getChartSize=function(){
  $scope.chartHeight='height:'+(window.innerHeight-$('.page-header').height())/2+'px';
  console.log($scope.chartHeight);
    console.log($('.page-header'));
  // }
  $scope.renderCharts=[false,true,true,true,true,true,true,true];
  $scope.patients={};
  //更新TABLE的函数
  function gettable1(dept,type){
    PatientsByDB.GetPatientsByDB({DeptCode:dept,Type:type})
    .then(function(data){
      $scope.patients=data.data;
    },function(e){
        console.log(e)
    });
  }
  function gettable2(dept,way){
    PatientDeptDeliver.GetPatientDeptDeliver({DeptCode:dept,DeliverWay:way})
    .then(function(data){
      $scope.patients=data.data;
    },function(e){
        console.log(e)
    });    
  }
  function updateTable(i,params){
    if(i==1){
      gettable1($stateParams.place,params.data.type);
    }
    if(i==2){
      gettable2($stateParams.place,params.data.way);
    }
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
        // $('#table').removeClass('col-xs-8').addClass('col-xs-12');
        $('#table').removeClass('col-lg-8').removeClass('col-md-8').removeClass('col-sm-6').addClass('col-xs-offset-1');
        $scope.renderCharts=[true,true,true,false,false,false,false,false];
      }else{
        // $('#table').removeClass('col-xs-12').addClass('col-xs-8');
        $('#table').addClass('col-lg-8').addClass('col-md-8').addClass('col-sm-6').removeClass('col-xs-offset-1');
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
        console.log(params);
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

  var myChart1 = echarts.init(document.getElementById('chart1'),'macarons');
  var data1={
    title:'床位信息统计',
    data:[
      {value : 0, name : '在床数', type: 1 },
      {value : 0, name : '待入床数', type: 0 }
    ]
  }
  myChart1.setOption(chartTool.initBar('手术状态统计'));
  myChart1.setOption(chartTool.getOptionBar(data1));

  myChart2 = echarts.init(document.getElementById('chart2'),'macarons');
  var data2 = {
    title:'后送方式',
    data:[
      {value : 0, name : '急救船', code : 'AmbulanceBoat', way:2 },
      {value : 0, name : '直升机', code:'Helicopter', way:1 }
    ]
  }
  myChart2.setOption(chartTool.initBar('后送方式'));
  myChart2.setOption(chartTool.getOptionBar(data2));


  myChart3 = echarts.init(document.getElementById('chart3'),'macarons');
  myChart4 = echarts.init(document.getElementById('chart4'),'shine');
  myChart5 = echarts.init(document.getElementById('chart5'),'roma');
  myChart6 = echarts.init(document.getElementById('chart6'),'infographic');
  myChart7 = echarts.init(document.getElementById('chart7'));
  
  myChart3.setOption(chartTool.initPie('伤员数量'));
  myChart4.setOption(chartTool.initPie('伤员数量'));
  myChart5.setOption(chartTool.initPie('伤员数量'));
  myChart6.setOption(chartTool.initPie('伤员数量'));
  myChart7.setOption(chartTool.initPie('伤员数量'));
  
  var dataPie = [
    {title : '伤部统计', data : [{value : 10, name : '轻伤'}, {value : 5, name : '中度伤'}, {value : 15, name : '重伤'}, {value : 25, name : '危重伤'}] },
    {title : '伤型统计', data : [{value : 10, name : '头部'}, {value : 5, name : '面部'}, {value : 15, name : '颈部'}, {value : 25, name : '胸部'}, {value : 25, name : '背部'}, {value : 25, name : '腹部'}, {value : 25, name : '腰部'}, {value : 25, name : '盆骨'}, {value : 25, name : '脊柱脊髓'}, {value : 25, name : '上肢'}, {value : 25, name : '下肢'}, {value : 25, name : '多发伤'}, {value : 25, name : '其他'}] },
    {title : '伤类统计', data : [{value : 10, name : '贯通伤'}, {value : 5, name : '非贯通伤'}, {value : 15, name : '穿透伤'}, {value : 25, name : '切线伤'},{value : 10, name : '皮肤及软组织伤'}, {value : 5, name : '骨折'}, {value : 15, name : '断肢和断指（趾）'}, {value : 25, name : '其他'}] },
    {title : '伤势统计', data : [{value : 10, name : '炸伤'}, {value : 5, name : '枪弹伤'}, {value : 15, name : '刃器伤'}, {value : 25, name : '挤压伤'}, {value : 25, name : '冲击伤'}, {value : 25, name : '撞击伤'}, {value : 25, name : '烧伤'}, {value : 25, name : '冻伤'}, {value : 25, name : '毒剂伤'}, {value : 25, name : '电离辐射伤'}, {value : 25, name : '生物武器伤'}, {value : 25, name : '激光损伤'}, {value : 25, name : '微博损伤'}, {value : 25, name : '海水浸泡伤'}, {value : 25, name : '长航疲劳'}, {value : 25, name : '复合伤'}, {value : 25, name : '其他'}] },
    {title : '并发症统计', data : [{value : 10, name : '大出血'}, {value : 5, name : '窒息'}, {value : 15, name : '休克'}, {value : 25, name : '抽搐'}, {value : 25, name : '气胸'}, {value : 25, name : '截瘫'}, {value : 25, name : '气性坏疽'}, {value : 25, name : '低温'}, {value : 25, name : '昏迷'}, {value : 25, name : '其他'}]}
  ]
  function randerDataPie(res,i){
    var ans={title:dataPie[i].title,data:[]};
      for(var j=0;j<res.length;++j){
        if(res[j]){
          ans.data.push(dataPie[i].data[j]);
          ans.data[ans.data.length-1].value=res[j];
        }
      }
    return ans;
  }  
  // var option3 = {
    //   title : '伤部统计',
    //   data : [{
    //       value : 10,
    //       name : '上肢'
    //     }, {
    //       value : 5,
    //       name : '脊柱脊髓'
    //     }, {
    //       value : 15,
    //       name : '面部'
    //     }, {
    //       value : 25,
    //       name : '颈部'
    //     }, {
    //       value : 20,
    //       name : '腰部及盆骨'
    //     }
    //   ]
    // };
    // myChart3.setOption(chartTool.getOptionPie(option3));

    // var option4 = {
    //   title :'伤型统计',
    //   data : [{
    //       value : 10,
    //       name : '皮肤及软组织挫伤'
    //     }, {
    //       value : 5,
    //       name : '皮肤及软组织撕裂'
    //     }, {
    //       value : 15,
    //       name : '盲管伤'
    //     }, {
    //       value : 25,
    //       name : '穿透伤'
    //     }
    //   ]
    // };
    // myChart4.setOption(chartTool.getOptionPie(option4));

    // var option5 = {
    //   title : '伤类统计',
    //   data : [{
    //       value : 3,
    //       name : '刃器伤'
    //     }, {
    //       value : 18,
    //       name : '枪弹伤'
    //     }, {
    //       value : 15,
    //       name : '撞击伤'
    //     }, {
    //       value : 25,
    //       name : '烧伤'
    //     }
    //   ]
    // };
    // myChart5.setOption(chartTool.getOptionPie(option5));

    // var option6 = {
    //   title : '伤势统计',
    //   data : [{
    //       value : 3,
    //       name : '危重伤'
    //     }, {
    //       value : 18,
    //       name : '轻伤'
    //     }, {
    //       value : 25,
    //       name : '重伤'
    //     }
    //   ]
    // };
    // myChart6.setOption(chartTool.getOptionPie(option6));

    // var option7 = {
    //   title : '并发症统计',
    //   data : [{
    //       value : 3,
    //       name : '大出血'
    //     }, {
    //       value : 18,
    //       name : '气性坏疽'
    //     }, {
    //       value : 15,
    //       name : '截瘫'
    //     }, {
    //       value : 25,
    //       name : '窒息'
    //     }
    //   ]
    // };    
  // myChart7.setOption(chartTool.getOptionPie(option7));

  function loadData(Dept){
    Deliver.BedsByDept({DeptCode:Dept})
    .then(function(data){
      data1.data[0].value=data.data[0];
      data1.data[1].value=data.data[1];
      myChart1.setOption(chartTool.getOptionBar(data1));
    },function(err){

    });
    Deliver.DeliverWays({DeptCode:Dept})
    .then(function(data){
      data2.data[0].value=data.data[0].num;
      data2.data[1].value=data.data[1].num;
      myChart2.setOption(chartTool.getOptionBar(data2));
    },function(err){

    });
    Deliver.InjuryInfoByToPlace({ToPlace:Dept})
    .then(function(data){
      myChart3.setOption(chartTool.getOptionPie(randerDataPie(data.data[0],0)));
      myChart4.setOption(chartTool.getOptionPie(randerDataPie(data.data[1],1)));
      myChart5.setOption(chartTool.getOptionPie(randerDataPie(data.data[2],2)));
      myChart6.setOption(chartTool.getOptionPie(randerDataPie(data.data[3],3)));
      myChart7.setOption(chartTool.getOptionPie(randerDataPie(data.data[4],4)));
    },function(err){

    });
  }
  $scope.$watch('$stateParams.place',function(){
    $interval.cancel($rootScope.timer);
    $rootScope.timer=$interval(function(){loadData($stateParams.place)},5000);
  })
  loadData($stateParams.place);

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

  // 读入modal所需生理生化信息
  $scope.readPatientDetails = function(PatientId){
    // 读入生理参数
    $scope.PatientDetails = {};
    var promise = Info.GetPatientDetails(PatientId);
    promise.then(function(data){
      $scope.PatientDetails = data.data;
      // console.log(data);
    }, function(err){
      // 无错误读入处理
    });
  };
  $scope.readPatientBios = function(PatientId){
    // 读入生化参数
    var promise = Info.GetPatientBios(PatientId);
    promise.then(function(data){
      $scope.PatientBios = data.data;
      // console.log(data);
    }, function(err){
      // 无错误读入处理
    });
  };
}])
.controller('deliverRescueStaffDistributionCtrl',['$scope','chartTool','Deliver',  function($scope,chartTool,Deliver){
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

      if(i<4){
        $('#table').removeClass('col-md-8').removeClass('col-sm-6');
        // $('#table').removeClass('col-xs-8').addClass('col-xs-12');
        $scope.renderCharts=[true,true,true,false,false,false,false,false];
      }else{
        $('#table').addClass('col-md-8').addClass('col-sm-6');
        // $('#table').removeClass('col-xs-12').addClass('col-xs-8');
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
    title:'救治人员分布',
    data:[
      {
        name: "现场急救区",
        value: 0,
        code:''
      },
      {
        name: "检伤分流区-01甲板",
        value: 0,
        code:''
      },
      {
        name: "检伤分流区-02甲板",
        value: 0,
        code:''
      }
    ]
  }
  myChart1.setOption(chartTool.initBar('救治人员分布'));
  // myChart1.setOption(chartTool.getOptionBar(data1));

  var myChart2 = echarts.init(document.getElementById('chart2'));
  var data2={
    title:'患者状态统计',
    data:[
    {
            value : 0,
            name : '已接收',
            code:''
          }, {
            value : 0,
            name : '已后送',
            code:''
          },{
            value : 0,
            name: '已送达',
            code:''
          },{
            value : 0,
            name: '已分诊',
            code:''
          }
        ]
  }
  myChart2.setOption(chartTool.initBar('患者状态统计'));
  // myChart2.setOption(chartTool.getOptionBar(data2));

  myChart3 = echarts.init(document.getElementById('chart3'));
  var data3={
    title:'伤员分布',
    data:[
        {
          name: "现场急救区",
          value: 2,
          code:''
        },
        {
          name: "检伤分流区-01甲板",
          value: 3,
          code:''
        },
        {
          name: "检伤分流区-02甲板",
          value: 0,
          code:''
        }
      ]
  }  
  myChart3.setOption(chartTool.initBar('伤员分布'));
  // myChart3.setOption(chartTool.getOptionPie(data3));

  function loadData(){
    Deliver.Savors()
    .then(function(data){
      // data1.data=data.data;
      data1.data[0].value=data.data[0].num;
      data1.data[1].value=data.data[1].num;
      data1.data[2].value=data.data[2].num;
      myChart1.setOption(chartTool.getOptionBar(data1));
    },function(err){

    });
    Deliver.InjuryStatus()
    .then(function(data){
      // data2.data=data.data;
      data2.data[0].value=data.data[0].num;
      data2.data[1].value=data.data[1].num;
      data2.data[2].value=data.data[2].num;
      data2.data[3].value=data.data[3].num;
      myChart2.setOption(chartTool.getOptionBar(data2));
    },function(err){

    });
    Deliver.InjuryPeople()
    .then(function(data){
      // data3.data=data.data;
      data3.data[0].value=data.data[0].num;
      data3.data[1].value=data.data[1].num;
      data3.data[2].value=data.data[2].num;
      myChart3.setOption(chartTool.getOptionBar(data3));
    },function(err){

    });
  }
  loadData();

  myChart4 = echarts.init(document.getElementById('chart4'));
  myChart5 = echarts.init(document.getElementById('chart5'));
  myChart6 = echarts.init(document.getElementById('chart6'));
  myChart7 = echarts.init(document.getElementById('chart7'));
  myChart8 = echarts.init(document.getElementById('chart8'));
  
  myChart4.setOption(chartTool.initPie('伤员数量'));
  myChart5.setOption(chartTool.initPie('伤员数量'));
  myChart6.setOption(chartTool.initPie('伤员数量'));
  myChart7.setOption(chartTool.initPie('伤员数量'));
  myChart8.setOption(chartTool.initPie('伤员数量'));
  


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
  var option8 = {
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
  myChart8.setOption(chartTool.getOptionPie(option8));


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

  listenChartsClick(myChart1,myChart2,myChart3,myChart4,myChart5,myChart6,myChart7,myChart8);   
}])

.controller('analysisCtrl',['$scope','$sce', 'CONFIG', 'deckInfoDetail', 'Info', 'MstUser', 'TrnOrderingSurgery', 
  function($scope,$sce,CONFIG,deckInfoDetail,Info,MstUser,TrnOrderingSurgery){
 
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
.controller('DoctorInfoCtrl',['$scope','Storage','MstUser',function($scope,Storage,MstUser){
  $scope.DoctorInfos={};
  MstUser.GetDoctorsInfo({DoctorId:'',Affiliation:'',Status:'',DoctorName:'',Position:''}).then(
      function(data){
          $scope.DoctorInfos=data.data;
        
      },function(e){
          console.log(e)
      });
  // 读入医生信息详情
  $scope.readDoctorInfoDetail = function(DoctorId){
    var promise = MstUser.GetDoctorInfoDetail(DoctorId);
    promise.then(function(data){
      $scope.DoctorInfoDetail = data.data;
      // console.log($scope.DoctorInfoDetail);
    }, function(err){
      // 无错误读入处理
    });
  };
}])
.controller('OperationRoomInfoCtrl',['$scope','Storage','TrnOrderingSurgery','Info',
  function($scope,Storage,TrnOrderingSurgery,Info){
  $scope.SurgeryInfos={};
  TrnOrderingSurgery.GetSurgeriesInfo({SurgeryRoom1:'',SurgeryRoom2:'',SurgeryDateTime:'',SurgeryDeptCode:''}).then(
      function(data){
          $scope.SurgeryInfos=data.data;
         
      },function(e){
          console.log(e)
      });
  // 读入手术室详情信息
  $scope.readSurgeriesInfoDetail = function(RoomId){
    var promise = TrnOrderingSurgery.GetSurgeriesInfoDetail(RoomId);
    promise.then(function(data){
      $scope.SurgeriesInfoDetail = data.data;
      // console.log($scope.SurgeriesInfoDetail);
    }, function(err){
      // 无错误读入处理
    });
  };
  // 调整modal的尺寸
  $(".modal").on("show.bs.modal", function() {
    var height = $(window).height() - 200;
    $(this).find(".modal-body").css("max-height", height);
  });

}])
.controller('AssistInfoCtrl',['$scope','Storage','orderings','Info',function($scope,Storage,orderings,Info){
  $scope.orderings={};
  orderings.Getorderings({DepartmentCode:'DEPT05',Status:'',ClinicDate:'',PatientName:''}).then(
      function(data){
          $scope.orderings=data.data;
         
      },function(e){
          console.log(e)
      });
  $scope.Status="";
  $scope.values=["所有",1,2,3,4];
  $scope.changeStatus=function(){
    if($scope.Status=="所有"){
      orderings.Getorderings({DepartmentCode:'DEPT05',Status:'',ClinicDate:'',PatientName:''}).then(
      function(data){
          $scope.orderings=data.data;
         
      },function(e){
          console.log(e)
      });
    }
    else{
      orderings.Getorderings({DepartmentCode:'DEPT05',Status:$scope.Status,ClinicDate:'',PatientName:''}).then(
      function(data){
          $scope.orderings=data.data;
         
      },function(e){
          console.log(e)
      });

    }
  };
  // 读入modal所需生理生化信息
  $scope.readPatientDetails = function(PatientId){
    // 读入生理参数
    $scope.PatientDetails = {};
    var promise = Info.GetPatientDetails(PatientId);
    promise.then(function(data){
      $scope.PatientDetails = data.data;
      // console.log(data);
    }, function(err){
      // 无错误读入处理
    });
  };
  $scope.readPatientBios = function(PatientId){
    // 读入生化参数
    var promise = Info.GetPatientBios(PatientId);
    promise.then(function(data){
      $scope.PatientBios = data.data;
      // console.log(data);
    }, function(err){
      // 无错误读入处理
    });
  };
    
}])
.controller('DeckInfoCtrl',['$scope','Storage','DeckInfo','deckInfoDetail',function($scope,Storage,DeckInfo,deckInfoDetail){
  $scope.Decks={};
  
  DeckInfo.GetDeckInfo().then(
      function(data){
          $scope.Decks=data.data;
         
      },function(e){
          console.log(e)
      });
  // 读入甲板信息详情
  $scope.readDeckInfo = function(RoomId){
    var promise = deckInfoDetail.GetdeckInfoDetail(RoomId);
    promise.then(function(data){
      $scope.DeckInfoDetail = data.data;
      // console.log($scope.DeckInfoDetail);
    }, function(err){
      // 无错误读入处理
    });
  };
  // 调整modal尺寸
  $(".modal").on("show.bs.modal", function() {
    var height = $(window).height() - 200;
    $(this).find(".modal-body").css("max-height", height);
  });
}])
.controller('InjuriedPatientInfoCtrl',['$scope','Storage','KeyPatientsInfo','Info',function($scope,Storage,KeyPatientsInfo,Info){
  $scope.KeyPatientInfos={};
  KeyPatientsInfo.GetKeyPatientsInfobyInjury({type:'1'}).then(
      function(data){
          $scope.KeyPatientInfos=data.data;
         
      },function(e){
          console.log(e)
      });
  // 读入modal所需生理生化信息
  $scope.readPatientDetails = function(PatientId){
    // 读入生理参数
    $scope.PatientDetails = {};
    var promise = Info.GetPatientDetails(PatientId);
    promise.then(function(data){
      $scope.PatientDetails = data.data;
      // console.log(data);
    }, function(err){
      // 无错误读入处理
    });
  };
  $scope.readPatientBios = function(PatientId){
    // 读入生化参数
    var promise = Info.GetPatientBios(PatientId);
    promise.then(function(data){
      $scope.PatientBios = data.data;
      // console.log(data);
    }, function(err){
      // 无错误读入处理
    });
  };
}])
.controller('IndentityPatientInfoCtrl',['$scope','Storage','KeyPatientsInfo','Info',function($scope,Storage,KeyPatientsInfo,Info){
  $scope.KeyPatientInfos={};
  KeyPatientsInfo.GetKeyPatientsInfobyInjury({type:'1'}).then(
      function(data){
          $scope.KeyPatientInfos=data.data;
         
      },function(e){
          console.log(e)
      });
  // 读入modal所需生理生化信息
  $scope.readPatientDetails = function(PatientId){
    // 读入生理参数
    $scope.PatientDetails = {};
    var promise = Info.GetPatientDetails(PatientId);
    promise.then(function(data){
      $scope.PatientDetails = data.data;
      // console.log(data);
    }, function(err){
      // 无错误读入处理
    });
  };
  $scope.readPatientBios = function(PatientId){
    // 读入生化参数
    var promise = Info.GetPatientBios(PatientId);
    promise.then(function(data){
      $scope.PatientBios = data.data;
      // console.log(data);
    }, function(err){
      // 无错误读入处理
    });
  };
}])