angular.module('services',['ngResource'])
.factory('Storage', ['$window', function ($window) { 
	return {
    set: function(key, value) {
    	$window.localStorage.setItem(key, value);
    },
    get: function(key) {
    	return $window.localStorage.getItem(key);
    },
    rm: function(key) {
    	$window.localStorage.removeItem(key);
    },
    clear: function() {
    	$window.localStorage.clear();
    }
	};
}])
.constant('CONFIG', {
  makeUrl: 'http://121.43.107.106:57772/csp/outp/_DeepSee.UserPortal.DashboardViewer.zen?NOTITLE=1&NOMODIFY=1&DASHBOARD=HZDashboards/',
  baseUrl: 'http://121.43.107.106:9090/Api/v1/',  
  socketUrl: 'ws://121.43.107.106:4141'
})
.factory('Data', ['$resource', '$q','$interval' ,'CONFIG','Storage' , function($resource,$q,$interval ,CONFIG,Storage){ 
	var serve={};
	var abort = $q.defer;

  // 张桠童
  var deckInfoDetail = function(){
    return $resource(CONFIG.baseUrl + ':route/:id',{},{
      deckInfoDetail:{method:'GET', params:{route: 'deckInfoDetail', id:'@id'}, timeout: 100000},
    });
  };

  var Info = function(){
    return $resource(CONFIG.baseUrl + ':route',{},{
      PatientBios:{method:'GET', params:{route: 'PatientBios', PId:'@PId'}, timeout: 100000},
      PatientDetails:{method:'GET', params:{route: 'PatientDetails', PId:'@PId'}, timeout: 100000},
    });
  };
  
  //DeliverInfo

  //DeckInfo
  var DeckInfo = function(){
    return $resource(CONFIG.baseUrl + ':route',{
      
    },{
      GetDeckInfo:{method:'GET',params:{route:'deckInfo'},timeout:10000},
    });
  };
  //Deliver
  var Deliver = function(){
    return $resource(CONFIG.baseUrl+":route",{},{
      InjuryInfoByToPlace:{method:'GET',params:{route:'InjuryInfoByToPlace',ToPlace:'@ToPlace'},timeout:10000},
      BedsByDept:{method:'GET',params:{route:'BedsByDept',DeptCode:'@DeptCode'},timeout:10000},
      DeliverWays:{method:'GET',params:{route:'DeliverWays',DeptCode:'@DeptCode'},timeout:10000},
      InjuryStatus:{method:'GET',params:{route:'InjuryStatus'},timeout:10000},
      InjuryPeople:{method:'GET',params:{route:'InjuryPeople'},timeout:10000},
      Savors:{method:'GET',params:{route:'Savors'},timeout:10000},
      InjuryStat:{method:'GET',params:{route:'InjuryStat'},timeout:10000},
      PatientsInfo:{method:'GET',params:{route:'PatientsInfo',Status:'@Status',Place:'@Place'},timeout:10000},
      DeliWayStat:{method:'GET',params:{route:'DeliWayStat'},timeout:10000},
      DeptCodeStat:{method:'GET',params:{route:'DeptCodeStat'},timeout:10000},
      RecuredStat:{method:'GET',params:{route:'RecuredStat'},timeout:10000},
      RecuredInfoByInjury:{method:'GET',params:{route:'RecuredInfoByInjury',InjuryType:'@InjuryType'},timeout:10000},
      PatientsByDept:{method:'GET',params:{route:'PatientsByDept',DeptCode:'@DeptCode'},timeout:10000},
      PatientsByWay:{method:'GET',params:{route:'PatientsByWay',DeliverWay:'@DeliverWay'},timeout:10000},
      PbyDI:{method:'GET',params:{route:'PbyDI',DeptCode:'@DeptCode',InjuryType:'@InjuryType'},timeout:10000},
      BedPlace:{method:'GET',params:{route:'BedPlace'},timeout:10000},
      rescueLoc:{method:'GET',params:{route:'rescue/location'},timeout:10000}
    })
  }
  var MstUser = function(){
    return $resource(CONFIG.baseUrl + ':path/:route',{
      path:'MstUser',
    },{
      GetDoctorsInfo:{method:'GET',params:{route:'DoctorsInfo',DoctorId:'@DoctorId',Affiliation:'@Affiliation',Status:'@Status',DoctorName:'@DoctorName',Position:'@Position'},timeout:10000},
      // 张桠童添加
      DoctorInfoDetail:{method:'GET',params:{route:'DoctorInfoDetail',DoctorId:'@DoctorId'},timeout:10000},
    });
  };
  //PsTrnOutpatient
  var TrnOrderingSurgery = function(){
    return $resource(CONFIG.baseUrl + ':path/:route',{
      path:'TrnOrderingSurgery',
    },{
      GetSurgeriesInfo:{method:'GET',params:{route:'SurgeriesInfo',SurgeryRoom1:'@SurgeryRoom1',SurgeryRoom2:'@SurgeryRoom2',SurgeryDateTime:'@SurgeryDateTime',SurgeryDeptCode:'@SurgeryDeptCode'},timeout:10000},
      // 张桠童添加
      SurgeriesInfoDetail:{method:'GET',params:{route:'SurgeriesInfoDetail', RoomId:'@RoomId'},timeout:10000},
    });
  };
  var orderings = function(){
    return $resource(CONFIG.baseUrl + ':route',{
    },{
      Getorderings:{method:'GET',params:{route:'orderings',DepartmentCode:'@DepartmentCode',Status:'@Status',ClinicDate:'@ClinicDate',PatientName:'@PatientName'},timeout:10000},
    });
  };
  var KeyPatientsInfo = function(){
    return $resource(CONFIG.baseUrl + ':path/:route',{
      path:'KeyPatientsInfo',
    },{
      GetKeyPatientsInfobyInjury:{method:'GET',params:{route:'Injury',type:'@type'},timeout:10000},
      GetKeyPatientsInfobyJob:{method:'GET',params:{route:'Job',type:'@type'},timeout:10000},
    });
  };
  var DeliverInfo=function()
  {
    return $resource(CONFIG.baseUrl+'Num',{},{
      GetDeliverInfoNum: {method:'GET'}, timeout:100000}
    );
  };
  var PatientsByDB = function(){
    return $resource(CONFIG.baseUrl + ':route',{
    },{
      GetPatientsByDB:{method:'GET',params:{route:'PatientsByDB',DeptCode:'@DeptCode',Type:'@Type'},timeout:10000},
    });
  };
  var PatientDeptDeliver = function(){
    return $resource(CONFIG.baseUrl + ':route',{
    },{
      GetPatientDeptDeliver:{method:'GET',params:{route:'PatientDeptDeliver',DeptCode:'@DeptCode',DeliverWay:'@DeliverWay'},timeout:10000},
    });
  };


	serve.abort = function($scope){
			abort.resolve();
	        $interval(function () {
	        abort = $q.defer();
          serve.deckInfoDetail = deckInfoDetail();
          serve.Info = Info();
	        serve.DeckInfo = DeckInfo();
          serve.MstUser = MstUser();
          serve.TrnOrderingSurgery = TrnOrderingSurgery();
          serve.orderings = orderings();
          serve.KeyPatientsInfo = KeyPatientsInfo();
          serve.PatientsByDB = PatientsByDB();
          serve.PatientDeptDeliver = PatientDeptDeliver();
          serve.DeliverInfo = DeliverInfo();
          serve.Deliver = Deliver();
	    },0,1);
	}
   serve.deckInfoDetail = deckInfoDetail();
   serve.Info = Info();  
	 serve.DeckInfo = DeckInfo();
   serve.MstUser = MstUser();
   serve.TrnOrderingSurgery = TrnOrderingSurgery();
   serve.orderings = orderings();
   serve.KeyPatientsInfo = KeyPatientsInfo();
   serve.DeliverInfo = DeliverInfo(); 
   serve.PatientsByDB = PatientsByDB();
   serve.PatientDeptDeliver = PatientDeptDeliver();
   serve.Deliver = Deliver();
	 return serve;
}])

//-------甲板信息、医生详细信息、手术室信息详情、生理生化信息-------- [张桠童]
.factory('deckInfoDetail', ['$q', '$http', 'Data', function( $q, $http, Data ){
  var self = this;
  self.GetdeckInfoDetail = function(id){
    var deferred = $q.defer();
    Data.deckInfoDetail.deckInfoDetail({id:id}, function(data, headers){
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };
  return self;
}])

.factory('Info', ['$q', '$http', 'Data', function( $q, $http, Data ){
  var self = this;
  self.GetPatientBios = function(PId){
    var deferred = $q.defer();
    Data.Info.PatientBios({PId:PId}, function(data, headers){
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.GetPatientDetails = function(PId){
    var deferred = $q.defer();
    Data.Info.PatientDetails({PId:PId}, function(data, headers){
      deferred.resolve(data);
    }, function(err){
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.renderBios=function(data){
    var bios=['血清钾', '血清钠', '血清钙', '血液PH值', '碳酸氢根', '氯离子', '二氧化碳分压', '葡萄糖', '血红蛋白', '乳酸'];
    var ans=[];
    if(Array.isArray(data)){
      for(var i in data){
        ans.push({type:data[i].des,value:data[i].val});
        bios.splice(bios.indexOf(data[i].des),1);
      }
    }
    for(var i in bios){
      ans.push({type:bios[i],value:''});
    }
    return ans;
  }

  return self;
}])

.factory('DeckInfo', ['$q', '$http', 'Data','Storage','$resource','CONFIG',function ($q, $http, Data,Storage,$resource,CONFIG) { 
  var self = this;
  self.GetDeckInfo = function(){
  	var deferred = $q.defer();
  	Data.DeckInfo.GetDeckInfo(function (data,headers) {
  		deferred.resolve(data);
  	},function (err) {
  		deferred.reject(err);
  	});
  	return deferred.promise;
  };
  return self;
}])
.factory('MstUser',['$q', '$http', 'Data','Storage','$resource','CONFIG',function ($q, $http, Data,Storage,$resource,CONFIG) {
  var self = this;
  self.GetDoctorsInfo = function(obj){
    var deferred = $q.defer();
    Data.MstUser.GetDoctorsInfo(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  // 张桠童添加
  self.GetDoctorInfoDetail = function(DoctorId){
    var deferred = $q.defer();
    Data.MstUser.DoctorInfoDetail({DoctorId:DoctorId},function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
   return self;
}])
.factory('TrnOrderingSurgery',['$q', '$http', 'Data','Storage','$resource','CONFIG',function ($q, $http, Data,Storage,$resource,CONFIG) {
  var self = this;
  self.GetSurgeriesInfo = function(obj){
    var deferred = $q.defer();
    Data.TrnOrderingSurgery.GetSurgeriesInfo(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  // 张桠童添加
  self.GetSurgeriesInfoDetail = function(RoomId,OrderNo){
    var deferred = $q.defer();
    Data.TrnOrderingSurgery.SurgeriesInfoDetail({PatientId:RoomId,OrderNo:OrderNo},function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
   return self;
}])
.factory('orderings',['$q', '$http', 'Data','Storage','$resource','CONFIG',function ($q, $http, Data,Storage,$resource,CONFIG) {
  var self = this;
  self.Getorderings = function(obj){
    var deferred = $q.defer();
    Data.orderings.Getorderings(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
   return self;
}])
.factory('KeyPatientsInfo',['$q', '$http', 'Data','Storage','$resource','CONFIG',function ($q, $http, Data,Storage,$resource,CONFIG) {
  var self = this;
  self.GetKeyPatientsInfobyInjury = function(obj){
    var deferred = $q.defer();
    Data.KeyPatientsInfo.GetKeyPatientsInfobyInjury(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  self.GetKeyPatientsInfobyJob = function(obj){
    var deferred = $q.defer();
    Data.KeyPatientsInfo.GetKeyPatientsInfobyJob(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
   return self;
}])
//赵艳霞
.factory('DeliverInfo', ['$q','$http', 'Data', function($q,$http, Data){
  var self = this;

  self.GetDeliverInfoNum = function(){
    var deferred = $q.defer();
    Data.DeliverInfo.GetDeliverInfoNum(
      function(data, headers){
        deferred.resolve(data);
      },function(err){
        deferred.reject(err);
      });
    return deferred.promise;
  };
  return self;
}])
.factory('PatientsByDB',['$q','$http','Data','Storage','$resource','CONFIG',function ($q, $http, Data,Storage,$resource,CONFIG){
  var self = this;
  self.GetPatientsByDB = function(obj){
     var deferred = $q.defer();
    Data.PatientsByDB.GetPatientsByDB(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  return self;
}])
.factory('PatientDeptDeliver',['$q','$http','Data','Storage','$resource','CONFIG',function ($q, $http, Data,Storage,$resource,CONFIG){
  var self = this;
  self.GetPatientDeptDeliver = function(obj){
     var deferred = $q.defer();
    Data.PatientDeptDeliver.GetPatientDeptDeliver(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  return self;
}])

.factory('Deliver',['$q','$http','Data','Storage','$resource','CONFIG',function ($q, $http, Data,Storage,$resource,CONFIG){
  var serve = {};
  serve.InjuryInfoByToPlace = function(obj){
     var deferred = $q.defer();
    Data.Deliver.InjuryInfoByToPlace(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.BedsByDept = function(obj){
     var deferred = $q.defer();
    Data.Deliver.BedsByDept(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.DeliverWays = function(obj){
     var deferred = $q.defer();
    Data.Deliver.DeliverWays(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.InjuryStatus = function(){
     var deferred = $q.defer();
    Data.Deliver.InjuryStatus({},function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.Savors = function(){
     var deferred = $q.defer();
    Data.Deliver.Savors({},function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.InjuryPeople = function(){
     var deferred = $q.defer();
    Data.Deliver.InjuryPeople({},function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.InjuryStat = function(){
     var deferred = $q.defer();
    Data.Deliver.InjuryStat({},function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.PatientsInfo = function(obj){
     var deferred = $q.defer();
    Data.Deliver.PatientsInfo(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.DeptCodeStat = function(){
     var deferred = $q.defer();
    Data.Deliver.DeptCodeStat({},function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.DeliWayStat = function(){
     var deferred = $q.defer();
    Data.Deliver.DeliWayStat({},function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.RecuredInfoByInjury = function(obj){
     var deferred = $q.defer();
    Data.Deliver.RecuredInfoByInjury(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.RecuredStat = function(){
     var deferred = $q.defer();
    Data.Deliver.RecuredStat({},function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.PbyDI = function(obj){
     var deferred = $q.defer();
    Data.Deliver.PbyDI(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.PatientsByDept = function(obj){
     var deferred = $q.defer();
    Data.Deliver.PatientsByDept(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.PatientsByWay = function(obj){
     var deferred = $q.defer();
    Data.Deliver.PatientsByWay(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.BedPlace = function(obj){
    var deferred = $q.defer();
    Data.Deliver.BedPlace(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  serve.rescueLoc = function(obj){
    var deferred = $q.defer();
    Data.Deliver.rescueLoc(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  return serve;
}])
.factory('getLoc',['Deliver',function(Deliver){
  var cDict=['等待手术','术后观察','状态平稳'];
  // function randomCondition(){
  //   var bed = arguments[0];
  //   if(bed==='03' || bed==='05' || bed==='08'){
  //     return '状态平稳';
  //   }else{
  //     return cDict[Math.floor(Math.random()*3)];
  //   }
  // }
  function bedNumber(bedstr){
    if(bedstr.length>6){
      if(bedstr.substr(0,3)=='500')
        return bedstr.slice(6);
      if(bedstr.length>8 && bedstr.substr(0,6)=='221701')
        return bedstr.slice(8);
      return 0;
    }
    return 0;
  }
  return function(arr,dept){
    if(dept=='OutPatientRoom')
      return arr;
    // if(dept=='Dept01'){
    //   arr.map(function(patient,index){
    //     patient.Loc='手术室'+index;
    //     patinet.Condition = 
    //   })
    // }
    arr.map(function(patient){
      Deliver.BedPlace({PatientId:patient.PId,DeptCode:dept})
      .then(function(data){
        // console.log(data);
        var loca='';
        var d=data.toJSON();
        for(var key in d){
          loca=loca.concat(d[key]);
        }
        // console.log(d);
        var bedN=bedNumber(loca);
        if(bedN===0){
          patient.Loc='待床';
        }else{
          patient.Loc=bedN+'床';
        }
        if(bedN==='03' || bedN==='05' || bedN==='08'){
          patient.Condition = '状态平稳';
        }else{
          patient.Condition = cDict[patient.Age%3];
        }
        // patient.Condition=randomCondition(bedN);
        return patient;
      },function(err){
        patient.Condition=cDict[patient.Age%3];
        patient.Loc='获取失败';
        return patient;
      });
    });
    return arr;
  }
}])
.factory('getLoc2',['Deliver',function(Deliver){
  var loc_dict={
    5001 : '普通病房',
    5002 : '重伤病房',
    5003 : '烧伤病房',
    5004 : '手术室',
    5006 : '门诊',
    5007 : '检伤分流区',
    221701 : 'ICU'
  };
  return function(arr){
    arr.map(function(patient){
      Deliver.rescueLoc({PatientId:patient.PId})
      .then(function(data){
        var d=data.toJSON();
        var loca='';
        for(var key in d){
          loca=loca.concat(d[key]);
        }
        if(loca=='NA'||loca==''){
          loca='正在运送途中...';
        }else{
          loca=loc_dict[loca] || loca;
        }
        patient.Loc=loca;
        return patient;
      },function(err){
        patient.Loc='获取失败';
        return patient;
      });
    });
    return arr;
  }
}])
.factory('chartTool',['CONFIG',function(CONFIG){
  var serve={};
  serve.initBar = function(seriesName){
    return {
      title : {
        text : '',
        left:'center'
      }, 
      tooltip : {
        trigger : 'axis',
        axisPointer : {
          type : 'shadow'
        },
        formatter:"{b} : {c}"
      },
      toolbox : {
        feature : {
          dataView : {readOnly : true },
          magicType : {type : ['line', 'bar'] },
          restore : {},
          saveAsImage : {}
        }
      },
      xAxis : [{
          type : 'category',
          data : []
        }
      ],
      yAxis : [{
          type : 'value',
          splitArea : {
            show : true
          }
        }
      ],
      series : [{
          name : seriesName,
          type : 'bar',
          label : {
            normal:{
              show : true,
              position : 'top',
              textStyle:{fontSize:26 }           
            }
          },   
          // itemStyle : {
          //   normal : {
          //     label : {
          //       show : true,
          //       position : 'inside'
          //     }
          //   }
          // },
          data : [0,0]
        }
      ]
    }
  }

  serve.initPie = function(seriesName){
    return {
      title : {
        text : '',
        left:'center'
      },        
      tooltip:{
        trigger : 'item',
        formatter : "{a} <br/>{b} : {c} ({d}%)"
      },
      legend : {
        bottom : 'bottom',
        textStyle:{
          fontSize:15
        },
        data : []
      },
      toolbox : {
        orient : 'vertical',
        left : 'left',
        top : 'top',
        feature : {
          dataView : {
            readOnly : true
          },
          restore : {},
          saveAsImage : {}
        }
      },
      series : [
        {
          name : seriesName,
          type : 'pie',
          radius : [0, '60%'],
          center : ['50%', '50%'],
          selectedMode:'single',
          label: {
              normal: {
                  show:false
              },
          },          
          data : []
        }
      ]        
    }
  }
  function labelOnData(percentage){
    return {
      normal:{
        show : true,
        position : 'top',
        formatter: '{c} ('+ percentage+'%)',
        textStyle:{fontSize:26 }         
      }
    };
  }
  function getLabel(data,type){
    if(!type)
      return data;
    var sum=data[0].value+data[2].value;
    data[0].label=labelOnData(parseInt((data[0].value/sum)*100));
    data[2].label=labelOnData(parseInt((data[2].value/sum)*100));
    return data;
  }
  serve.getOptionBar = function(data,type){
    return {
      title : {text : data.title },
      xAxis : {data : data.data.map(function(d){return {value:d.name,textStyle:{color:'#456',fontSize:18}}})},
      series : [{data : getLabel(data.data,type)}]
    }
  }

  serve.getOptionPie = function(data){
    return {
      title : {text : data.title },
      legend : {data : data.data.map(function(d){return d.name}) },
      series : [{data : data.data}]
    }
  }
  serve.dataPie = [
    {title : '伤势统计', data : [{value : 0, name : '轻伤',code:"轻伤"}, {value : 0, name : '中度伤',code:"中度伤"}, {value : 0, name : '重伤',code:"重伤"}, {value : 0, name : '危重伤',code:"危重伤"}] },
    {title : '伤部统计', data : [{value : 0, name : '头部',code:"001"}, {value : 0, name : '面部',code:"002"}, {value : 0, name : '颈部',code:"003"}, {value : 0, name : '胸（背）部',code:"004"}, {value : 0, name : '  腹（腰）部及盆骨（会阴）',code:"005"}, {value : 0, name : '脊柱脊髓',code:"006"}, {value : 0, name : '上肢',code:"007"}, {value : 0, name : '下肢',code:"008"}, {value : 0, name : '多发伤',code:"009"}, {value : 0, name : '其他',code:"010"}] },
    {title : '伤类统计', data : [{value : 0, name : '炸伤',code:"001"}, {value : 0, name : '枪弹伤',code:"002"}, {value : 0, name : '刃器伤',code:"003"}, {value : 0, name : '挤压伤',code:"004"}, {value : 0, name : '冲击伤',code:"005"}, {value : 0, name : '撞击伤',code:"006"}, {value : 0, name : '烧伤',code:"007"}, {value : 0, name : '冻伤',code:"008"}, {value : 0, name : '毒剂伤',code:"009"}, {value : 0, name : '电离辐射伤',code:"010"}, {value : 0, name : '生物武器伤',code:"011"}, {value : 0, name : '激光损伤',code:"012"}, {value : 0, name : '微博损伤',code:"013"}, {value : 0, name : '复合伤',code:"014"}, {value : 0, name : '海水浸泡伤',code:"015"}, {value : 0, name : '长航疲劳',code:"016"}, {value : 0, name : '其他',code:"017"}] },
    {title : '伤型统计', data : [{value : 0, name : '贯穿伤',code:"001"}, {value : 0, name : '穿透伤  ',code:"002"}, {value : 0, name : '盲管伤',code:"003"}, {value : 0, name : '切线伤',code:"004"},{value : 0, name : '皮肤及软组织伤（擦伤）',code:"005"}, {value : 0, name : '皮肤及软组织伤（挫伤）',code:"006"}, {value : 0, name : '皮肤及软组织伤（撕裂）',code:"007"}, {value : 0, name : '皮肤及软组织伤（撕脱）',code:"008"}, {value : 0, name : '骨折',code:"009"}, {value : 0, name : '断肢和断指（趾）',code:"010"}, {value : 0, name : '其他',code:"011"}] },
    {title : '并发症统计', data : [{value : 0, name : '大出血',code:"001"}, {value : 0, name : '窒息',code:"002"}, {value : 0, name : '休克',code:"003"}, {value : 0, name : '抽搐',code:"004"}, {value : 0, name : '气胸',code:"005"}, {value : 0, name : '截瘫',code:"006"}, {value : 0, name : '气性坏疽',code:"007"}, {value : 0, name : '低温',code:"008"}, {value : 0, name : '其他',code:"009"}] }
  ]
  return serve;
}])
// .factory('GIS',function(){
//   var serve={};
//   serve.gis=window.open("/haizong/haizong-webgis/gis.html","","",true);
//   return serve;
// })