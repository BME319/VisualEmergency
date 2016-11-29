angular.module('controllers',['ngResource','services','ngDialog'])
.controller('deliverCtrl',['$scope','DeliverInfo','Deliver',  function($scope,DeliverInfo,Deliver){
  $scope.places=[
  {imgUrl:'image/OR.jpg',name:'手术室',action:'Dept01'},
  {imgUrl:'image/ICU.jpg',name:'ICU',action:'Dept03'},
  {imgUrl:'image/commonWard.jpg',name:'普通病房',action:'Dept05'},
  {imgUrl:'image/burnWard.jpg',name:'烧伤病房',action:'Dept04'},
  {imgUrl:'image/zhongshangWard.jpg',name:'重伤病房',action:'Dept02'},
  {imgUrl:'image/outPatient.jpg',name:'门诊救治人员',action:'OutPatientRoom'},
  ];
  $scope.p= {'imgUrl':'image/RescueStaffDistribution.jpg',name:'救治人员',Num:'',action:'OutPatientRoom'};
  Deliver.Savors()
  .then(function(data){
    var num=0;
    for(var i in data.data){
      num+=data.data[i].num;
    }
    $scope.p.Num = num;
  },function(err){

  });
  DeliverInfo.GetDeliverInfoNum()
  .then(function(data)
    { 
      $scope.places[0].Num = 6;
      $scope.places[1].Num = data.ICUNum;
      $scope.places[2].Num = data.NormNum;
      $scope.places[3].Num = data.BurnNum;
      $scope.places[4].Num = data.SeriNum;
      $scope.places[5].Num = data.OutPNum;
     },function(err) {   
   });

}])

.controller('deliverRoomCtrl',['$scope','$rootScope','$stateParams','$state','$interval','chartTool','PatientsByDB','PatientDeptDeliver','Deliver','Info','ngDialog','CONFIG','getLoc',  function($scope,$rootScope,$stateParams,$state,$interval,chartTool,PatientsByDB,PatientDeptDeliver,Deliver,Info,ngDialog,CONFIG,getLoc){
  $scope.renderCharts=[false,true,true,true,true,true,true,true];
  $scope.patients={};
  var dept011=new Object();
  var numleft=[1,2,3,4,5,6];
  function dept01oh(dd){
    PatientsByDB.GetPatientsByDB({DeptCode:'Dept01',Type:1})
          .then(function(data1){
            var d=data1.data
            if(dept011){
              for(var key in dept011){
                var flag=true;
                for(var j=0;j<d.length;++j){
                  if(d.PId==key){
                    d.splice(j,1)
                    flag=false;
                    break;
                  }
                }
                if(flag){
                  numleft.push(dept011[key]);
                  delete dept011[key];
                }
              }
              for(var j=0;j<d.length;++j){
                dept011[d[j].PId]=numleft[0];
                numleft.shift();
              }
            }
            dd.map(function(item){
              if(dept011[item.PId]){
                item.Loc='手术室'+dept011[item.PId]
                item.Condition='手术中';
              }else{
                item.Loc='';
                item.Condition=item.PId%2?'术后观察':'状态稳定';
              }
            })
            return $scope.patients=dd;
          },function(err){

          })
  }
  function gettable1(dept,type){
    if(dept=='OutPatientRoom'){
      Deliver.PatientsByDept({DeptCode:type})
      .then(function(data){
        // data.buttonColor = 'primary';
        angular.forEach(data.data,function(value,key){
          value.buttonColor = 'primary';
          if($scope.realtimedevice && $scope.realtimedevice.hasOwnProperty(value.PId))
          {
            value.buttonColor = 'btn-success';
          }
        })
        return $scope.patients=getLoc(data.data,dept);
      },function(e){
          console.log(e)
      });
    }else{
      PatientsByDB.GetPatientsByDB({DeptCode:dept,Type:type})
      .then(function(data){
        // data.buttonColor = 'primary';
        angular.forEach(data.data,function(value,key){
          value.buttonColor = 'primary';
          if($scope.realtimedevice && $scope.realtimedevice.hasOwnProperty(value.PId))
          {
            value.buttonColor = 'btn-success';
          }
        })
        if(dept=='Dept01'){
          return $scope.patients=dept01oh(data.data);
        }else{
          return $scope.patients=getLoc(data.data,dept);
        }
        
      },function(e){
          console.log(e)
      });
    }
  }
  function gettable2(dept,way){
    if(dept=='OutPatientRoom'){
      switch(way){
        case 1:way='Helicopter';break;
        case 2:way='AmbulanceBoat';break;
        default:break;
      }
      Deliver.PatientsByWay({DeliverWay:way})
      .then(function(data){
        // data.buttonColor = 'primary';
        angular.forEach(data.data,function(value,key){
          value.buttonColor = 'primary';
          if($scope.realtimedevice && $scope.realtimedevice.hasOwnProperty(value.PId))
          {
            value.buttonColor = 'btn-success';
          }
        })
        return $scope.patients=getLoc(data.data,dept);
      },function(e){
          console.log(e)
      });
    }else{
      PatientDeptDeliver.GetPatientDeptDeliver({DeptCode:dept,DeliverWay:way})
      .then(function(data){
        // data.buttonColor = 'primary';
        angular.forEach(data.data,function(value,key){
          value.buttonColor = 'primary';
          if($scope.realtimedevice && $scope.realtimedevice.hasOwnProperty(value.PId))
          {
            value.buttonColor = 'btn-success';
          }
        })
        if(dept=='Dept01'){
          return $scope.patients=dept01oh(data.data);
        }else{
          return $scope.patients=getLoc(data.data,dept);
        }
        // return $scope.patients=getLoc(data.data,dept);
      },function(e){
          console.log(e)
      });
    }
  }
  function gettable3To7(dept,injuryType){
    Deliver.PbyDI({DeptCode:dept,InjuryType:injuryType})
    .then(function(data){
      // data.buttonColor = 'primary';
      angular.forEach(data.data,function(value,key){
          value.buttonColor = 'primary';
          if($scope.realtimedevice && $scope.realtimedevice.hasOwnProperty(value.PId))
          {
            value.buttonColor = 'btn-success';
          }
      })
      if(dept=='Dept01'){
          return $scope.patients=dept01oh(data.data);
        }else{
          return $scope.patients=getLoc(data.data,dept);
        }
      // return $scope.patients=getLoc(data.data,dept);
    },function(err){

    });
  }
  function indexLengthFix(k){
    return k<10?'00'+k:'0'+k;
  }
  function updateTable(i,params){
    switch(i){
      case 1:return gettable1($stateParams.place,params.data.type);
      case 2:return gettable2($stateParams.place,params.data.way);
      case 3:return gettable3To7($stateParams.place,params.data.code);
      case 4:return gettable3To7($stateParams.place,'Site_'+params.data.code);
      case 5:return gettable3To7($stateParams.place,'Type_'+params.data.code);
      case 6:return gettable3To7($stateParams.place,'Class_'+params.data.code);
      case 7:return gettable3To7($stateParams.place,'Complications_'+params.data.code);
      default:return;
    }
  }
  $scope.closeTable = function(){
    $interval.cancel($rootScope.tableTimer);
    $('#leftMargin').removeClass('col-xs-1');
    tableIndex=null;
    $scope.renderCharts=[false,true,true,true,true,true,true,true,true];
  }
  var tableIndex=null,dataIndex=null;
  function showTable(i,params){
    $interval.cancel($rootScope.tableTimer);
    $scope.patients={};
    if((tableIndex==i && params.dataIndex==dataIndex) || (i==1 && params.data.type==2)){
      $('#leftMargin').removeClass('col-xs-1');
      tableIndex=null;
      $scope.$apply(function(){
        $scope.renderCharts=[false,true,true,true,true,true,true,true];
      })
      return;
    }
    tableIndex=i,dataIndex=params.dataIndex;
    $scope.$apply(function(){
      if(i<3){
        $scope.selectedchart={name:i==1?'床位信息统计':'后送方式统计',item:params.name}
        $('.Patients_scrollContent').addClass('Patients_scrollContent1').removeClass('Patients_scrollContent');
        $('.Patients_fixedHeader').addClass('Patients_fixedHeader1').removeClass('Patients_fixedHeader');
        $('#leftMargin').addClass('col-xs-1');
        $('#table').removeClass('my-table-pie').addClass('col-xs-9').css({"margin-left":"70px"});
        $scope.renderCharts=[true,true,true,false,false,false,false,false];
      }else{
        $scope.selectedchart={name:chartTool.dataPie[i-3].title,item:params.name}
        $('.Patients_scrollContent1').addClass('Patients_scrollContent').removeClass('Patients_scrollContent1');
        $('.Patients_fixedHeader1').addClass('Patients_fixedHeader').removeClass('Patients_fixedHeader1');
        $('#leftMargin').addClass('col-xs-1');
        $('#table').addClass('my-table-pie').removeClass('col-xs-9').css({"margin-left":""});
        for(j=3;j<8;++j){
          if(j!=i)
            $scope.renderCharts[j]=false;
        }
        $scope.renderCharts[0]=true;
      }
    });
    updateTable(i,params);
    return $rootScope.tableTimer=$interval(function(){updateTable(i,params)},5000);
  }
  function listenChart(chart){
      chart.on('click',function(params){
        return showTable(parseInt(chart._dom.id[5]),params);
      });      
  }
  function listenChartsClick(){
    for(var i in arguments){
      if((arguments[i] instanceof Object) && (arguments[i]._chartsMap instanceof Object)){
        listenChart(arguments[i]);
      }
    }
  }

  var data1={
    title:'床位信息统计',
    data:[
      {value : 0, name : '在床数', type: 1 },
      {value : 0, name : '待入床数', type: 0 },
      {value : 0, name : '剩余床位', type: 2 }
    ]
  }
  var beds_dict={
    'Dept02':31,
    'Dept03':20,
    'Dept04':41,
    'Dept05':50
  }
  var data1_Outpatient={
    title:'门诊科室统计',
    data:[]
  }
  function outPatientData(resData){
    resData.map(function(d){
      d.name=d.msg;
      d.value=d.code;
      d.type=d.data.trim();
      delete d.msg;
      delete d.code;
      delete d.data;
      return d;
    });
    return resData;
  }
  var data1_Dept01={
    title:'手术状态统计',
    data:[
      {value : 0, name : '手术中', type: 1 },
      {value : 0, name : '手术完成', type: 0 }
    ]
  }

  var data2 = {
    title:'后送方式',
    data:[
      {value : 0, name : '急救船', way:2 },
      {value : 0, name : '直升机', way:1 }
    ]
  }
  var myChart1,myChart2,myChart3,myChart4,myChart5,myChart6,myChart7;
  var theme_dict={
    Dept01:['blue','blue'],
    Dept02:['shine','shine'],
    Dept03:['roma','roma'],
    Dept04:['red','infographic'],
    Dept05:['green','green'],
    OutPatientRoom:['infographic','infographic']
  }
  function initcharts(){
    if(myChart1 instanceof Object){
      myChart1.dispose();
      myChart2.dispose();
      myChart3.dispose();
      myChart4.dispose();
      myChart5.dispose();
      myChart6.dispose();
      myChart7.dispose();
    }

    myChart1 = echarts.init(document.getElementById('chart1'),arguments[0][0]);
    myChart2 = echarts.init(document.getElementById('chart2'),arguments[0][0]);
    myChart3 = echarts.init(document.getElementById('chart3'),arguments[0][1]);
    myChart4 = echarts.init(document.getElementById('chart4'),arguments[0][1]);
    myChart5 = echarts.init(document.getElementById('chart5'),arguments[0][1]);
    myChart6 = echarts.init(document.getElementById('chart6'),arguments[0][1]);
    myChart7 = echarts.init(document.getElementById('chart7'),arguments[0][1]);
    
    myChart1.setOption(chartTool.initBar('状态统计'));
    myChart2.setOption(chartTool.initBar('后送方式'));
    myChart3.setOption(chartTool.initPie('伤员数量'));
    myChart4.setOption(chartTool.initPie('伤员数量'));
    myChart5.setOption(chartTool.initPie('伤员数量'));
    myChart6.setOption(chartTool.initPie('伤员数量'));
    myChart7.setOption(chartTool.initPie('伤员数量'));

    listenChartsClick(myChart1,myChart2,myChart3,myChart4,myChart5,myChart6,myChart7);
  }

  function randerDataPie(res,i){
    var ans={title:chartTool.dataPie[i].title,data:[]};
      for(var j=0;j<res.length;++j){
        if(res[j]){
          ans.data.push(chartTool.dataPie[i].data[j]);
          ans.data[ans.data.length-1].value=res[j];
        }
      }
    return ans;
  }

  function loadData(Dept){
    if(Dept=='OutPatientRoom'){
      Deliver.DeptCodeStat()
      .then(function(data){
	      if(Array.isArray(data.data) && data.data.length>0){
          data1_Outpatient.data = outPatientData(data.data);
        }
        myChart1.setOption(chartTool.getOptionBar(data1_Outpatient));
      },function(err){

      })
      Deliver.DeliWayStat()
      .then(function(data){
        data2.data[0].value=data.data[0];
        data2.data[1].value=data.data[1];
        myChart2.setOption(chartTool.getOptionBar(data2));
      },function(err){

      })
      Deliver.InjuryStat()
      .then(function(data){
        myChart3.setOption(chartTool.getOptionPie(randerDataPie(data.data[0],0)));
        myChart4.setOption(chartTool.getOptionPie(randerDataPie(data.data[1],1)));
        myChart5.setOption(chartTool.getOptionPie(randerDataPie(data.data[2],2)));
        myChart6.setOption(chartTool.getOptionPie(randerDataPie(data.data[3],3)));
        myChart7.setOption(chartTool.getOptionPie(randerDataPie(data.data[4],4)));
      },function(err){
        
      })
    }else{
      Deliver.BedsByDept({DeptCode:Dept})
      .then(function(data){
    		var d=data1;
        //Dept01手术室特殊处理
    		if(Dept=='Dept01'){
    			d=data1_Dept01;
    		}
        d.data[0].value=data.data[0];
        d.data[1].value=data.data[1];
        if(Dept!='Dept01'){
          d.data[2].value=beds_dict[Dept]-data.data[0];
          myChart1.setOption(chartTool.getOptionBar(d,true));
        }else{
          myChart1.setOption(chartTool.getOptionBar(d));
        }
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
  }
  $scope.$watch('$stateParams.place',function(){
    $scope.OutPatientRoomFlag = $stateParams.place=='OutPatientRoom'?true:false;
    initcharts(theme_dict[$stateParams.place]);
    $interval.cancel($rootScope.timer);
    $interval.cancel($rootScope.tableTimer);
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
    $scope.PatientBios=[]
    // 读入生化参数
    Info.GetPatientBios(PatientId)
    .then(function(data){
        $scope.PatientBios = Info.renderBios(data.data);
    }, function(err){
      // 无错误读入处理
    });
  };
  //位置信息 showLocation
  gisWnd=$rootScope.GIS;
  //alert(gisWnd);
  $scope.showLocation = function(Patient){
    Deliver.BedPlace({PatientId:Patient.PId,DeptCode:$stateParams.place})
   .then(function(data){
      var d=data.toJSON();
      var loca='';
      for(var key in d){
        loca=loca.concat(d[key]);
      }
      Patient.loc=loca;
      loca=$stateParams.place=='OutPatientRoom'?'5006':loca;
      var obj={id : loca ,pid:Patient.PId,floor: '',type: "patient" , name : Patient.PatientName , age : Patient.Age , fushangdidian : Patient.Location , qiuzhenyisheng : Patient.DoctorName ,zhanshangdengji:Patient.InjuryLevel,zhanshangjifen:Patient.InjuryScore    };
      //console.log(obj);
      btn_click(obj,"person");
      function btn_click(id,objType)
      {
          gisWnd.positionToObj(id,objType);
          //gisWnd.setShipBtnColor();
      }
//    },function(err){
  //    Patient.loc='';
    //  $scope.patientLoc=Patient;
   });
  }
  //心电显示
  ////////////////////////heart//////////////////////////////////////
  $scope.graphtitle = '历史纪录';

    window.localStorage['socketstatus']='false';

    //记录当前打开的弹窗，要根据打开的弹窗判断是否加载心电图图像
    var currentdialog = '';
    //记录当前选择的patientid
    var selectedpatientid = "";
    var rltflag = null;
    var zoomvalue = 155;
    var ymax = 5000;

    //打开实传界面
    $scope.openRealtimeGraph = function (PID) {
        selectedpatientid = PID;
        rltflag = true;
        currentdialog = ngDialog.open({
            name:"d1",
            width:900,
            template: 'templates/graph.html',
            scope:$scope,
            cache:false,
            trapFocus:false
        });
    };
    //打开历史记录
    $scope.openHistoryFile = function(PID)
    {
        // console.log("openFile");
        selectedpatientid = PID;
        rltflag = false;

        $scope.socket.emit('getfile', {deviceid:deviceID, devicename:deviceNAME, cmd:'gf'});

        var htmlstr =   '<div class="panel-group" id="accordion" style="margin-top:15px;width:650px;">'+
                            '<div class="panel panel-default">'+
                                '<div class="panel-heading">'+
                                    '<h4 class="panel-title">'+
                                        '<a style="font-size: 35px;;font-weight: bold" data-toggle="collapse" data-parent="#accordion" href="">'+
                                            '姓名:{{filedata.patientName}}-ID:{{filedata.patientID}}'+
                                        '</a>'+
                                    '</h4>'+
                                '</div>'+
                                '<div id="{{filedata.patientID}}" class="panel-collapse collapse.in">'+
                                    '<div class="panel-body">'+
                                        '<ul class="list-group" style="margin-bottom:0px;">'+
                                            '<li style="font-size: 35px;;font-weight: bold" class="list-group-item" ng-click="selectfromFile($index)" ng-repeat="item in filedata.record">'+
                                                '{{item.recordtime}}'+
                                            '</li>'+
                                        '</ul>'
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                        
        currentdialog = ngDialog.open({
            template: htmlstr,
            plain: true,
            scope:$scope,
            preserveFocus:false,
            trapFocus:false,
            showClose:false,
            width:700
        });

        //////////////////////////////////////////////
        $scope.selectfromFile = function(index)
        {
            // console.log($scope.filedata.record[index]);
            $scope.selectedindex = index;
            //加载数据在ngDialog.opened事件中完成
            //关闭选择窗口
            currentdialog.close();
            //打开图形窗口
            currentdialog = ngDialog.open({
                name:"d1",
                width:900,
                template: 'templates/graph.html',
                scope:$scope,
                cache:false,
                trapFocus:false
            });
        }
    }

    var alldata = [];//接收到的所有数据
    var cachedata = [];//缓存接收到的数据
    var alldatalength = 0;//所有数据的长度
    var xdata = [];//当前横轴数据
    var ydata=[];//y轴数据
    var otherdata = [];//存储接收到的数据中的心率等非图形数据
    var timet = "";//定时器，用来扫描缓存中的数据并显示
    var myChart = "";
    $scope.$on('ngDialog.opened', function (e, $dialog) {
        if(currentdialog.id=='d1 dialog')
        {
            // console.log(currentdialog);
            myChart = echarts.init(document.getElementById('main1'));
            alldata = [];//接收到的所有数据
            cachedata = [];//缓存接收到的数据
            alldatalength = 0;//所有数据的长度
            xdata = [];//当前横轴数据
            ydata=[];//y轴数据
            otherdata = [];//存储接收到的数据中的心率等非图形数据
            timet = "";//定时器，用来扫描缓存中的数据并显示
            
            $scope.showotherdata = ['-','-','-','-','-','-'];

            for (var i = 0; i <= zoomvalue; i++) {
                ydata.push('-');//先添加zoomvalue组空数据，否则横坐标空
                xdata.push(i)
            }

            var addData = function(rdata)
            {
                if(alldatalength<=zoomvalue)
                    ydata[alldatalength++]=rdata;//前zoomvalue组数据用来覆盖 “-”
                else
                {
                    ydata.push(rdata);//加入y轴数据
                    xdata.push(alldatalength++)//加入x轴数据
                }
            }
            option = {//显示的心电图图形配置
                title: {
                    text: ''
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    axisLabel: {
                        formatter: function (val) {return "";}
                    },
                    type: 'category',
                    boundaryGap: true,
                    data:xdata
                },
                yAxis: {
                    axisLabel: {
                        formatter: function (val) {return "";}
                    },
                    type: 'value',
                    max:ymax,
                    min:0,
                    interval:200
                },
                dataZoom: [
                    {
                        type: 'inside',
                        show: true,
                        xAxisIndex: [0],
                        startValue: 0,
                        endValue: zoomvalue
                    }
                ],
                series: [{
                    name: '',
                    type: 'line',
                    symbol:'none',
                    smooth: true,
                    data: ydata
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            // console.log(rltflag)
            if(rltflag==true)
            {
                //实传
                timet = setInterval(function () {
                    if(cachedata.length>0)
                    {
                        // console.log(cachedata.length);
                        for(var i=10;i!=0;i--)
                        {
                            var fdata = cachedata.shift();
                        }
                            var datazoom = [];
                            // console.log(cachedata.length);
                            alldata.push(fdata);//存储所有数据
                            addData(fdata);
                            if(alldatalength>zoomvalue)
                            {
                                datazoom = [{
                                    startValue: alldatalength-zoomvalue,
                                    endValue: alldatalength
                                }]
                            }else
                            {
                                datazoom = [{
                                    startValue: 0,
                                    endValue: zoomvalue
                                }]
                            }
                            myChart.setOption({
                                xAxis: {
                                    data: xdata
                                },
                                dataZoom: datazoom,
                                series: [{
                                    name:'',
                                    data: ydata
                                }]
                            });

                    }
                }, 20);
            }else{
                //历史
                // console.log("history");
                xdata = [];
                ydata = [];
                var datazoom = [{
                    startValue: 0,
                    endValue: zoomvalue*5
                }];
                var recorddata = $scope.filedata.record[$scope.selectedindex].recorddata;
                // console.log(recorddata);
                for(var ii=0;ii<recorddata.length;ii++)
                {
                    if(recorddata[ii][3]==49)
                    {
                        otherdata.push([]);
                        for(var i=0;i<6;i++)
                        {
                            otherdata[otherdata.length-1].push(recorddata[ii][6+i]);
                        }
                    }
                    if(recorddata[ii][3]==32)
                    {
                        for(var i=6;i<25;i+=2)
                        {
                            var edata = (-encodeheartgraph(recorddata[ii][i],recorddata[ii][i+1]))+2000;
                            if(alldatalength<=zoomvalue)
                                ydata[alldatalength++]=edata;//前101组数据用来覆盖 “-”
                            else
                            {
                                ydata.push(edata);//加入y轴数据
                                xdata.push(alldatalength++)//加入x轴数据
                            }
                        }
                    }
                }
                if(otherdata.length<2)
                  $scope.buttonswitch = {
                      button1:true,
                      button2:true,
                  }
                $rootScope.$apply(function(){
                    $scope.showotherdata = otherdata[0];
                })                   

                myChart.setOption({
                    xAxis: {
                        data: xdata
                    },
                    dataZoom: datazoom,
                    series: [{
                        data: ydata
                    }]
                });
            }
            

        }
    });
    $scope.$on('ngDialog.closing',function(e,$dialog){
        if(currentdialog.id=='d1 dialog')
        {
            // console.log("close dialog");
            selectedpatientid = "";
        }
    })
    var vitalindex = 0;
    $scope.buttonswitch = {
        button1:true,
        button2:false,
    }
    $scope.previous = function()
    {
        vitalindex--;
        if(vitalindex==0)
        {
            $scope.buttonswitch.button1=true;
        }
        else
            $scope.buttonswitch.button1=false;

        $scope.showotherdata = otherdata[vitalindex];
        $scope.buttonswitch.button2=false;
        // console.log(otherdata);
    }
    $scope.next = function()
    {
        vitalindex++;
        if(vitalindex==otherdata.length-1)
        {
            $scope.buttonswitch.button2=true;
        }
        else
            $scope.buttonswitch.button2=false;

        $scope.showotherdata = otherdata[vitalindex];
        $scope.buttonswitch.button1=false;
        // console.log(otherdata);
    }
    ////////////socket//////////////////////

        //variable for socket
    var deviceID = "testdeviceid";//用于设备标识
    var deviceNAME = "testdevicename"
    var wsServerIP = CONFIG.socketUrl;//这里需要写入socket服务器ip

    var SocketInit = function ()
    {
        $scope.socket = io.connect(wsServerIP);

        //告诉服务器有用户登陆
        $scope.socket.emit('login', {deviceid:deviceID, devicename:deviceNAME ,cmd:'rltlistener'});
          
        if(window.localStorage['socketstatus']!='true')
        {
            window.localStorage['socketstatus']='true';
            //监听其他用户登录
            $scope.socket.on('login', function(obj){
                // console.log(obj);
                $scope.realtimedevice = {};
                angular.forEach(obj.onlineDevices,function(value,key){
                    // console.log(value);
                    value.deviceid = key;
                    $scope.realtimedevice[value.patientid]=value;
                });
                angular.forEach($scope.patients,function(value,key){
                  if(obj.hasOwnProperty("loginuser"))
                  {
                    if(value.PId==obj.loginuser.patientid)
                    {
                      value.buttonColor='btn-success';
                    }
                  }
                });
            });

            //监听其他用户登出
            $scope.socket.on('logout', function(obj){
                $scope.realtimedevice = {};
                angular.forEach(obj.onlineDevices,function(value,key){
                    // console.log(value);
                    value.deviceid = key;
                    $scope.realtimedevice[value.patientid]=value;
                });
                angular.forEach($scope.patients,function(value,key){
                  if(obj.hasOwnProperty("logoutuser"))
                  {
                    if(value.PId==obj.logoutuser.patientid)
                    {
                      value.buttonColor='primary';
                    }
                  }
                });
            });

            //监听实传消息
            $scope.socket.on('realtimemessage', function(obj){
                if(obj.cmd=='rtm'&&obj.patientid==selectedpatientid)
                    handlesocketmessage(obj);
            });

            //监听获取文件--有人读取文件会有通知
            $scope.socket.on('getfile', function(obj){
                $rootScope.$apply(function(){
                    $scope.filedata = obj.getfile[selectedpatientid];
                })
            });
        }
    }
    SocketInit();
    ///////////////////////////
    //////////////////处理socket接收到的数据//////////////////////
    var handlesocketmessage = function(data)
    {
        if(data.content[3]==49)
        {
            otherdata.push([]);
            for(var i=0;i<6;i++)
            {
                otherdata[otherdata.length-1].push(data.content[6+i]);
            }
            $rootScope.$apply(function(){
                $scope.showotherdata = otherdata[otherdata.length-1];
            })
            // console.log($scope.showotherdata);
        }
        if(data.content[3]==32)
        {
            // console.log(data.content);
            for(var i=6;i<25;i+=2)
            {
                var edata = (-encodeheartgraph(data.content[i],data.content[i+1]))+2000;
                cachedata.push(edata);
            }
        }
    }
    var encodeheartgraph = function(d1,d2)
    {
        var d = (d1<<8)+d2;
        if(32768&d)
        {
            return -(~(d-1)&65535)
        }
        else
            return d;
    }
  ////////////////////////heart-end/////////////////////////////////
  $scope.buttonColor='btn-info';//primary|success|
  $scope.showHeartrate = function(PID){
    // console.log('123');
    if($scope.realtimedevice && $scope.realtimedevice.hasOwnProperty(PID))
      $scope.openRealtimeGraph(PID);
    else
      $scope.openHistoryFile(PID);
  }
}])
.controller('deliverRescueStaffDistributionCtrl',['$scope','$rootScope','$interval','chartTool','Deliver','Info','CONFIG','ngDialog','getLoc2',  function($scope,$rootScope,$interval,chartTool,Deliver,Info,CONFIG,ngDialog,getLoc2){
  $scope.renderCharts=[false,true,true,true,true,true,true,true,true];
  $scope.patients={};
  function gettable1and3(status,place){
    Deliver.PatientsInfo({Status:status,Place:place})
    .then(function(data){
      //data.data.push({
      //  'Age':17,
      //  'DoctorName':"mzb",
      //  'InjuryLevel':"危重伤",
      //  'InjuryScore':"0",
      //  'Location':"现场急救区",
      //  'PId':"P160913001",
      //  'PatientName':"t"
      //})
      angular.forEach(data.data,function(value,key){
          value.buttonColor = 'primary';
          if($scope.realtimedevice && $scope.realtimedevice.hasOwnProperty(value.PId))
          {
            value.buttonColor = 'btn-success';
          }
      })
      return $scope.patients=getLoc2(data.data);
    },function(err){

    });
  }
  function gettable4To8(code){
    Deliver.RecuredInfoByInjury({InjuryType:code})
    .then(function(data){
      angular.forEach(data.data,function(value,key){
          value.buttonColor = 'primary';
          if($scope.realtimedevice && $scope.realtimedevice.hasOwnProperty(value.PId))
          {
            value.buttonColor = 'btn-success';
          }
      })
      return $scope.patients=getLoc2(data.data);
    },function(err){

    })
  }
  function updateTable(i,params){
    switch(i){
	    case 1:return gettable1and3('',params.data.code);
      case 2:return gettable1and3(params.data.code,'');
      case 3:return gettable1and3('',params.data.code);
      case 4:return gettable4To8(params.data.code);
      case 5:return gettable4To8('Site_'+params.data.code);
      case 6:return gettable4To8('Type_'+params.data.code);
      case 7:return gettable4To8('Class_'+params.data.code);
      case 8:return gettable4To8('Complications_'+params.data.code);
      default:return;
    }
  }

  var tableIndex=null,dataIndex=null;
  function showTable(i,params){
    $interval.cancel($rootScope.tableTimer2);
    $scope.patients={};
    if(tableIndex==i && params.dataIndex==dataIndex){
      tableIndex=null;
      $('#leftMargin').removeClass('col-xs-1');
      $scope.$apply(function(){
        $scope.renderCharts=[false,true,true,true,true,true,true,true,true];
      })
      return;
    }
    tableIndex=i,dataIndex=params.dataIndex;
    $scope.$apply(function(){
      if(i<4){
        $scope.selectedchart={name:i==1?'伤员分布':i==2?'患者状态统计':'伤员分布',item:params.name}
        $('.Patients_scrollContent').addClass('Patients_scrollContent1').removeClass('Patients_scrollContent');
        $('.Patients_fixedHeader').addClass('Patients_fixedHeader1').removeClass('Patients_fixedHeader');
        $('#leftMargin').addClass('col-xs-1');
        $('#table').removeClass('my-table-pie').addClass('col-xs-9').css({"margin-left":"70px"});
        $scope.renderCharts=[true,true,true,true,false,false,false,false,false];
      }else{
        $scope.selectedchart={name:chartTool.dataPie[i-4].title,item:params.name}
        $('.Patients_scrollContent1').addClass('Patients_scrollContent').removeClass('Patients_scrollContent1');
        $('.Patients_fixedHeader1').addClass('Patients_fixedHeader').removeClass('Patients_fixedHeader1');
        $('#leftMargin').addClass('col-xs-1');
        $('#table').addClass('my-table-pie').removeClass('col-xs-9').css({"margin-left":""});
        for(j=4;j<9;++j){
          if(j!=i)
            $scope.renderCharts[j]=false;
        }
        $scope.renderCharts[0]=true;
      }
    });
    updateTable(i,params);
    return $rootScope.tableTimer2=$interval(function(){updateTable(i,params)},5000);
  }
  $scope.closeTable = function(){
    $interval.cancel($rootScope.tableTimer2);
    $scope.renderCharts=[false,true,true,true,true,true,true,true,true];
    tableIndex=null;
    $('#leftMargin').removeClass('col-xs-1');
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

  var data1={
    title:'救治人员分布',
    data:[
      {name: "现场急救区", value: 0, code:'PLACE|1'},
      {name: "检伤分流区-01甲板", value: 0, code:'PLACE|2'},
      {name: "检伤分流区-02甲板", value: 0, code:'PLACE|3'}
    ]
  }
  var data2={
    title:'患者状态统计',
    data:[
      {value : 0, name : '已接收', code:1 },
      {value : 0, name : '已后送', code:2 },
      {value : 0, name: '已送达', code:3 },
      {value : 0, name: '已分诊', code:4 }
    ]
  }
  var data3={
    title:'伤员分布',
    data:[
      {name: "现场急救区", value: 0, code:'PLACE|1'},
      {name: "检伤分流区-01甲板", value: 0, code:'PLACE|2'},
      {name: "检伤分流区-02甲板", value: 0, code:'PLACE|3'}
    ]
  }

  var myChart1 = echarts.init(document.getElementById('chart1'),'blue');
  var myChart2 = echarts.init(document.getElementById('chart2'),'green');
  var myChart3 = echarts.init(document.getElementById('chart3'),'gray');
  var myChart4 = echarts.init(document.getElementById('chart4'));
  var myChart5 = echarts.init(document.getElementById('chart5'));
  var myChart6 = echarts.init(document.getElementById('chart6'));
  var myChart7 = echarts.init(document.getElementById('chart7'));
  var myChart8 = echarts.init(document.getElementById('chart8'));
  
  myChart1.setOption(chartTool.initBar('救治人员分布'));
  myChart2.setOption(chartTool.initBar('患者状态统计'));
  myChart3.setOption(chartTool.initBar('伤员分布'));
  myChart4.setOption(chartTool.initPie('伤员数量'));
  myChart5.setOption(chartTool.initPie('伤员数量'));
  myChart6.setOption(chartTool.initPie('伤员数量'));
  myChart7.setOption(chartTool.initPie('伤员数量'));
  myChart8.setOption(chartTool.initPie('伤员数量'));
  
  function randerDataPie(res,i){
    var ans={title:chartTool.dataPie[i].title,data:[]};
      for(var j=0;j<res.length;++j){
        if(res[j]){
          ans.data.push(chartTool.dataPie[i].data[j]);
          ans.data[ans.data.length-1].value=res[j];
        }
      }
    return ans;
  }
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
    Deliver.RecuredStat()
    .then(function(data){
      myChart4.setOption(chartTool.getOptionPie(randerDataPie(data.data[0],0)));
      myChart5.setOption(chartTool.getOptionPie(randerDataPie(data.data[1],1)));
      myChart6.setOption(chartTool.getOptionPie(randerDataPie(data.data[2],2)));
      myChart7.setOption(chartTool.getOptionPie(randerDataPie(data.data[3],3)));
      myChart8.setOption(chartTool.getOptionPie(randerDataPie(data.data[4],4)));  
    },function(err){

    })
    //伤情信息
    
  }
  loadData();
  $rootScope.timer2=$interval(function(){loadData()},5000);
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
    $interval.cancel($rootScope.tableTimer2);
    $interval.cancel($rootScope.timer2);
  });

  listenChartsClick(myChart1,myChart2,myChart3,myChart4,myChart5,myChart6,myChart7,myChart8);
  // 读入modal所需生理生化信息
  $scope.readPatientDetails = function(PatientId){
    // 读入生理参数
    $scope.PatientDetails = {};
    Info.GetPatientDetails(PatientId)
    .then(function(data){
      $scope.PatientDetails = data.data;
      // console.log(data);
    }, function(err){
      // 无错误读入处理
    });
  };
  $scope.readPatientBios = function(PatientId){
    $scope.PatientBios=[]
    // 读入生化参数
    Info.GetPatientBios(PatientId)
    .then(function(data){
        $scope.PatientBios = Info.renderBios(data.data);
    }, function(err){
      // 无错误读入处理
    });
  };

  //位置信息 showLocation
  var gisWnd=$rootScope.GIS;
  //alert(gisWnd);
  // $scope.showLocation = function(Patient){
  //   Deliver.BedPlace({PatientId:Patient.PId,DeptCode:'Dept01'})
  //  .then(function(data){
  //     var d=data.toJSON();
  //     var loca='';
  //     for(var key in d){
  //       loca=loca.concat(d[key]);
  //     }
  //     var obj={id : loca ,pid:Patient.PId,floor: '',type: "patient" , name : Patient.PatientName , age : Patient.Age , fushangdidian : Patient.Location , qiuzhenyisheng : Patient.DoctorName ,zhanshangdengji:Patient.InjuryLevel,zhanshangjifen:Patient.InjuryScore    };
  //     btn_click(obj,"person");
  //     function btn_click(id,objType)
  //     {
  //         gisWnd.positionToObj(id,objType);
  //         //gisWnd.setShipBtnColor();
  //     }
  //  });
  // }
  $scope.showLocation = function(Patient){
    Deliver.rescueLoc({PatientId:Patient.PId})
   .then(function(data){
      var d=data.toJSON();
      var loca='';
      for(var key in d){
        loca=loca.concat(d[key]);
      }
      if(loca=='NA'||loca==''){
        return alert('正在运送途中');
      }
      else{
        var obj={id : loca ,pid:Patient.PId,floor: '',type: "patient" , name : Patient.PatientName , age : Patient.Age , fushangdidian : Patient.Location , qiuzhenyisheng : Patient.DoctorName ,zhanshangdengji:Patient.InjuryLevel,zhanshangjifen:Patient.InjuryScore    };
        btn_click(obj,"person");
        function btn_click(id,objType)
        {
          gisWnd.positionToObj(id,objType);
          //gisWnd.setShipBtnColor();
        }
      }
   });
  }
  //心电显示
  ////////////////////////heart//////////////////////////////////////
    $scope.graphtitle = '历史纪录';

    window.localStorage['socketstatus']='false';

    //记录当前打开的弹窗，要根据打开的弹窗判断是否加载心电图图像
    var currentdialog = '';
    //记录当前选择的patientid
    var selectedpatientid = "";
    var rltflag = null;
    var zoomvalue = 155;
    var ymax = 5000;

    //打开实传界面
    $scope.openRealtimeGraph = function (PID) {
        selectedpatientid = PID;
        rltflag = true;
        currentdialog = ngDialog.open({
            name:"d1",
            width:900,
            template: 'templates/graph.html',
            scope:$scope,
            cache:false,
            trapFocus:false
        });
    };
    //打开历史记录
    $scope.openHistoryFile = function(PID)
    {
        // console.log("openFile");
        selectedpatientid = PID;
        rltflag = false;

        $scope.socket.emit('getfile', {deviceid:deviceID, devicename:deviceNAME, cmd:'gf'});

        var htmlstr =   '<div class="panel-group" id="accordion" style="margin-top:15px;width:650px;">'+
                            '<div class="panel panel-default">'+
                                '<div class="panel-heading">'+
                                    '<h4 class="panel-title">'+
                                        '<a style="font-size: 35px;;font-weight: bold" data-toggle="collapse" data-parent="#accordion" href="">'+
                                            '姓名:{{filedata.patientName}}-ID:{{filedata.patientID}}'+
                                        '</a>'+
                                    '</h4>'+
                                '</div>'+
                                '<div id="{{filedata.patientID}}" class="panel-collapse collapse.in">'+
                                    '<div class="panel-body">'+
                                        '<ul class="list-group" style="margin-bottom:0px;">'+
                                            '<li style="font-size: 35px;;font-weight: bold" class="list-group-item" ng-click="selectfromFile($index)" ng-repeat="item in filedata.record">'+
                                                '{{item.recordtime}}'+
                                            '</li>'+
                                        '</ul>'
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                        '</div>';
                        
        currentdialog = ngDialog.open({
            template: htmlstr,
            plain: true,
            scope:$scope,
            preserveFocus:false,
            trapFocus:false,
            showClose:false,
            width: 700
        });

        //////////////////////////////////////////////
        $scope.selectfromFile = function(index)
        {
            // console.log($scope.filedata.record[index]);
            $scope.selectedindex = index;
            //加载数据在ngDialog.opened事件中完成
            //关闭选择窗口
            currentdialog.close();
            //打开图形窗口
            currentdialog = ngDialog.open({
                name:"d1",
                width:900,
                template: 'templates/graph.html',
                scope:$scope,
                cache:false,
                trapFocus:false
            });
        }
    }

    var alldata = [];//接收到的所有数据
    var cachedata = [];//缓存接收到的数据
    var alldatalength = 0;//所有数据的长度
    var xdata = [];//当前横轴数据
    var ydata=[];//y轴数据
    var otherdata = [];//存储接收到的数据中的心率等非图形数据
    var timet = "";//定时器，用来扫描缓存中的数据并显示
    var myChart = "";
    $scope.$on('ngDialog.opened', function (e, $dialog) {
        if(currentdialog.id=='d1 dialog')
        {
            // console.log(currentdialog);
            myChart = echarts.init(document.getElementById('main1'));
            alldata = [];//接收到的所有数据
            cachedata = [];//缓存接收到的数据
            alldatalength = 0;//所有数据的长度
            xdata = [];//当前横轴数据
            ydata=[];//y轴数据
            otherdata = [];//存储接收到的数据中的心率等非图形数据
            timet = "";//定时器，用来扫描缓存中的数据并显示
            
            $scope.showotherdata = ['-','-','-','-','-','-'];

            for (var i = 0; i <= zoomvalue; i++) {
                ydata.push('-');//先添加zoomvalue组空数据，否则横坐标空
                xdata.push(i)
            }

            var addData = function(rdata)
            {
                if(alldatalength<=zoomvalue)
                    ydata[alldatalength++]=rdata;//前zoomvalue组数据用来覆盖 “-”
                else
                {
                    ydata.push(rdata);//加入y轴数据
                    xdata.push(alldatalength++)//加入x轴数据
                }
            }
            option = {//显示的心电图图形配置
                title: {
                    text: '心电图'
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    axisLabel: {
                        formatter: function (val) {return "";}
                    },
                    type: 'category',
                    boundaryGap: true,
                    data:xdata
                },
                yAxis: {
                    axisLabel: {
                        formatter: function (val) {return "";}
                    },
                    type: 'value',
                    max:ymax,
                    min:0,
                    interval:200
                },
                dataZoom: [
                    {
                        type: 'inside',
                        show: true,
                        xAxisIndex: [0],
                        startValue: 0,
                        endValue: zoomvalue
                    }
                ],
                series: [{
                    name: '',
                    type: 'line',
                    symbol:'none',
                    smooth: true,
                    data: ydata
                }]
            };
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
            // console.log(rltflag)
            if(rltflag==true)
            {
                //实传
                timet = setInterval(function () {
                    if(cachedata.length>0)
                    {
                        // console.log(cachedata.length);
                        for(var i=10;i!=0;i--)
                        {
                            var fdata = cachedata.shift();
                        }
                            var datazoom = [];
                            // console.log(cachedata.length);
                            alldata.push(fdata);//存储所有数据
                            addData(fdata);
                            if(alldatalength>zoomvalue)
                            {
                                datazoom = [{
                                    startValue: alldatalength-zoomvalue,
                                    endValue: alldatalength
                                }]
                            }else
                            {
                                datazoom = [{
                                    startValue: 0,
                                    endValue: zoomvalue
                                }]
                            }
                            myChart.setOption({
                                xAxis: {
                                    data: xdata
                                },
                                dataZoom: datazoom,
                                series: [{
                                    name:'',
                                    data: ydata
                                }]
                            });

                    }
                }, 20);
            }else{
                //历史
                // console.log("history");
                xdata = [];
                ydata = [];
                var datazoom = [{
                    startValue: 0,
                    endValue: zoomvalue*5
                }];
                var recorddata = $scope.filedata.record[$scope.selectedindex].recorddata;
                // console.log(recorddata);
                for(var ii=0;ii<recorddata.length;ii++)
                {
                    if(recorddata[ii][3]==49)
                    {
                        otherdata.push([]);
                        for(var i=0;i<6;i++)
                        {
                            otherdata[otherdata.length-1].push(recorddata[ii][6+i]);
                        }
                    }
                    if(recorddata[ii][3]==32)
                    {
                        for(var i=6;i<25;i+=2)
                        {
                            var edata = (-encodeheartgraph(recorddata[ii][i],recorddata[ii][i+1]))+2000;
                            if(alldatalength<=zoomvalue)
                                ydata[alldatalength++]=edata;//前101组数据用来覆盖 “-”
                            else
                            {
                                ydata.push(edata);//加入y轴数据
                                xdata.push(alldatalength++)//加入x轴数据
                            }
                        }
                    }
                }
                if(otherdata.length<2)
                  $scope.buttonswitch = {
                      button1:true,
                      button2:true,
                  }
                $rootScope.$apply(function(){
                    $scope.showotherdata = otherdata[0];
                })                   

                myChart.setOption({
                    xAxis: {
                        data: xdata
                    },
                    dataZoom: datazoom,
                    series: [{
                        data: ydata
                    }]
                });
            }
            

        }
    });
    $scope.$on('ngDialog.closing',function(e,$dialog){
        if(currentdialog.id=='d1 dialog')
        {
            // console.log("close dialog");
            selectedpatientid = "";
        }
    })
    var vitalindex = 0;
    $scope.buttonswitch = {
        button1:true,
        button2:false,
    }
    $scope.previous = function()
    {
        vitalindex--;
        if(vitalindex==0)
        {
            $scope.buttonswitch.button1=true;
        }
        else
            $scope.buttonswitch.button1=false;

        $scope.showotherdata = otherdata[vitalindex];
        $scope.buttonswitch.button2=false;
        // console.log(otherdata);
    }
    $scope.next = function()
    {
        vitalindex++;
        if(vitalindex==otherdata.length-1)
        {
            $scope.buttonswitch.button2=true;
        }
        else
            $scope.buttonswitch.button2=false;

        $scope.showotherdata = otherdata[vitalindex];
        $scope.buttonswitch.button1=false;
        // console.log(otherdata);
    }
    ////////////socket//////////////////////

        //variable for socket
    var deviceID = "testdeviceid";//用于设备标识
    var deviceNAME = "testdevicename"
    var wsServerIP = CONFIG.socketUrl;//这里需要写入socket服务器ip

    var SocketInit = function ()
    {
        $scope.socket = io.connect(wsServerIP);

        //告诉服务器有用户登陆
        $scope.socket.emit('login', {deviceid:deviceID, devicename:deviceNAME ,cmd:'rltlistener'});
          
        if(window.localStorage['socketstatus']!='true')
        {
            window.localStorage['socketstatus']='true';
            //监听其他用户登录
            $scope.socket.on('login', function(obj){
                //console.log(obj);
                $scope.realtimedevice = {};
                angular.forEach(obj.onlineDevices,function(value,key){
                    // console.log(value);
                    value.deviceid = key;
                    $scope.realtimedevice[value.patientid]=value;
                });
                angular.forEach($scope.patients,function(value,key){
                  if(obj.hasOwnProperty("loginuser"))
                  {
                    if(value.PId==obj.loginuser.patientid)
                    {
                      $rootScope.$apply(function(){
                          value.buttonColor='btn-success';
                      })
                    }
                  }
                });
                // console.log($scope.patients);
                // console.log($scope.realtimedevice);
            });

            //监听其他用户登出
            $scope.socket.on('logout', function(obj){
                $scope.realtimedevice = {};
                angular.forEach(obj.onlineDevices,function(value,key){
                    // console.log(value);
                    value.deviceid = key;
                    $scope.realtimedevice[value.patientid]=value;
                });
                angular.forEach($scope.patients,function(value,key){
                  if(obj.hasOwnProperty("logoutuser"))
                  {
                    if(value.PId==obj.logoutuser.patientid)
                    {
                      $rootScope.$apply(function(){
                          value.buttonColor='primary';
                      })
                    }
                  }
                });
                // console.log($scope.patients);
                // console.log($scope.realtimedevice);
            });

            //监听实传消息
            $scope.socket.on('realtimemessage', function(obj){
                if(obj.cmd=='rtm'&&obj.patientid==selectedpatientid)
                    handlesocketmessage(obj);
            });

            //监听获取文件--有人读取文件会有通知
            $scope.socket.on('getfile', function(obj){
                $rootScope.$apply(function(){
                    $scope.filedata = obj.getfile[selectedpatientid];
                })
            });
        }
    }
    SocketInit();
    ///////////////////////////
    //////////////////处理socket接收到的数据//////////////////////
    var handlesocketmessage = function(data)
    {
        if(data.content[3]==49)
        {
            otherdata.push([]);
            for(var i=0;i<6;i++)
            {
                otherdata[otherdata.length-1].push(data.content[6+i]);
            }
            $rootScope.$apply(function(){
                $scope.showotherdata = otherdata[otherdata.length-1];
            })
            // console.log($scope.showotherdata);
        }
        if(data.content[3]==32)
        {
            // console.log(data.content);
            for(var i=6;i<25;i+=2)
            {
                var edata = (-encodeheartgraph(data.content[i],data.content[i+1]))+2000;
                cachedata.push(edata);
            }
        }
    }
    var encodeheartgraph = function(d1,d2)
    {
        var d = (d1<<8)+d2;
        if(32768&d)
        {
            return -(~(d-1)&65535)
        }
        else
            return d;
    }
  ////////////////////////heart-end/////////////////////////////////
  $scope.buttonColor='primary';//primary|success|
  $scope.showHeartrate = function(PID){
    // alert('不要点了，还没加');
    // console.log('456');
    if($scope.realtimedevice && $scope.realtimedevice.hasOwnProperty(PID))
      $scope.openRealtimeGraph(PID);
    else
      $scope.openHistoryFile(PID);
  }
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
  $scope.readSurgeriesInfoDetail = function(item){
    var promise = TrnOrderingSurgery.GetSurgeriesInfoDetail(item.PatientId,item.SurgeryRoomId);
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
  // orderings.Getorderings({DepartmentCode:'DEPT05',Status:'',ClinicDate:'',PatientName:''}).then(
  //     function(data){
  //         $scope.orderings=data.data;
         
  //     },function(e){
  //         console.log(e)
  //     });
  $scope.orderingsfilter = function(f,item){
    $scope.item=item;
     orderings.Getorderings({DepartmentCode:'DEPT05',Status:f,ClinicDate:'',PatientName:''}).then(
      function(data){
          $scope.orderings=data.data;
         
      },function(e){
          console.log(e)
      });
  };
  $scope.orderingsfilter('','全部');
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
    $scope.PatientBios=[]
    // 读入生化参数
    Info.GetPatientBios(PatientId)
    .then(function(data){
        $scope.PatientBios = Info.renderBios(data.data);
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
  KeyPatientsInfo.GetKeyPatientsInfobyInjury({type:''}).then(
      function(data){
          $scope.KeyPatientInfos=data.data;
         
      },function(e){
          console.log(e)
      });
  $scope.KeyPatientsfilter = function(f){
     KeyPatientsInfo.GetKeyPatientsInfobyInjury({type:f}).then(
      function(data){
          $scope.KeyPatientInfos=data.data;
         
      },function(e){
          console.log(e)
      });
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
    $scope.PatientBios=[]
    // 读入生化参数
    Info.GetPatientBios(PatientId)
    .then(function(data){
        $scope.PatientBios = Info.renderBios(data.data);
    }, function(err){
      // 无错误读入处理
    });
  };
}])
.controller('IndentityPatientInfoCtrl',['$scope','Storage','KeyPatientsInfo','Info',function($scope,Storage,KeyPatientsInfo,Info){
  $scope.KeyPatientInfos={};
  KeyPatientsInfo.GetKeyPatientsInfobyJob({type:''}).then(
      function(data){
          $scope.KeyPatientInfos=data.data;
         
      },function(e){
          console.log(e)
      });
  $scope.KeyPatientsfilter = function(f){
     KeyPatientsInfo.GetKeyPatientsInfobyJob({type:f}).then(
      function(data){
          $scope.KeyPatientInfos=data.data;
         
      },function(e){
          console.log(e)
      });
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
    $scope.PatientBios=[]
    // 读入生化参数
    Info.GetPatientBios(PatientId)
    .then(function(data){
        $scope.PatientBios = Info.renderBios(data.data);
    }, function(err){
      // 无错误读入处理
    });
  };
}])


.config(function (ngDialogProvider) {
    ngDialogProvider.setOpenOnePerName(true);
})