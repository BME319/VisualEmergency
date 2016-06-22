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
  makeUrl: 'http://10.12.43.35:57772/csp/outp/_DeepSee.UserPortal.DashboardViewer.zen?NOTITLE=1&NOMODIFY=1&DASHBOARD=HZDashboards/',
  baseUrl: 'http://10.12.43.35:9090/Api/v1/',  
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
      Savors:{method:'GET',params:{route:'Savors'},timeout:10000}
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
  self.GetSurgeriesInfoDetail = function(RoomId){
    var deferred = $q.defer();
    Data.TrnOrderingSurgery.SurgeriesInfoDetail({RoomId:RoomId},function (data,headers) {
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
  serve.InjuryPeople = function(obj){
     var deferred = $q.defer();
    Data.Deliver.InjuryPeople(obj,function (data,headers) {
      deferred.resolve(data);
    },function (err) {
      deferred.reject(err);
    });
    return deferred.promise;
  };
  return serve;
}])
.factory('chartTool',function(){
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
        }
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
          data : ['手术中', '手术完成']
        }
      ],
      yAxis : [{
          type : 'value',
          splitArea : {
            show : true
          }
        }
      ],
      // grid : {
      //   x2 : 40
      // },
      series : [{
          name : seriesName,
          type : 'bar',
          itemStyle : {
            normal : {
              label : {
                show : true,
                position : 'inside'
              }
            }
          },
          data : []
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
          radius : [15, '55%'],
          center : ['50%', '50%'],
          selectedMode:'single',
          roseType : 'radius',
          data : []
        }
      ]        
    }
  }

  serve.getOptionBar = function(data){
    return {
      title : {text : data.title },
      xAxis : {data : data.data.map(d =>d.name) },
      series : [{data : data.data}]
    }
  }

  serve.getOptionPie = function(data){
    return {
      title : {text : data.title },
      legend : {data : data.data.map(d =>d.name) },
      series : [{data : data.data}]
    }
  }

  return serve;
})