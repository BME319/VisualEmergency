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
  baseUrl: 'http://121.43.107.106:9090/Api/v1/',  //RESTful 服务器  121.43.107.106:9000
})
.factory('Data', ['$resource', '$q','$interval' ,'CONFIG','Storage' , function($resource,$q,$interval ,CONFIG,Storage){ 
	var serve={};
	var abort = $q.defer;

  //李泽南
	var DeckInfo = function(){
		return $resource(CONFIG.baseUrl + ':route',{
			
		},{
			GetDeckInfo:{method:'GET',params:{route:'deckInfo'},timeout:10000},
		});
	};
  var MstUser = function(){
    return $resource(CONFIG.baseUrl + ':path/:route',{
      path:'MstUser',
    },{
      GetDoctorsInfo:{method:'GET',params:{route:'DoctorsInfo',DoctorId:'@DoctorId',Affiliation:'@Affiliation',Status:'@Status',DoctorName:'@DoctorName',Position:'@Position'},timeout:10000},
    });
  };
  var TrnOrderingSurgery = function(){
    return $resource(CONFIG.baseUrl + ':path/:route',{
      path:'TrnOrderingSurgery',
    },{
      GetSurgeriesInfo:{method:'GET',params:{route:'SurgeriesInfo',SurgeryRoom1:'@SurgeryRoom1',SurgeryRoom2:'@SurgeryRoom2',SurgeryDateTime:'@SurgeryDateTime',SurgeryDeptCode:'@SurgeryDeptCode'},timeout:10000},
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
    return $resource(CONFIG.baseUrl+':path/:route',{path:'DeliverInfo',},{
      GetDeliverInfoNum: {method:'GET',params:{route: 'Num'}, timeout:100000},
    });
  };

  //赵艳霞

	serve.abort = function($scope){
			abort.resolve();
	        $interval(function () {
	        abort = $q.defer();
	        serve.DeckInfo = DeckInfo();
          serve.MstUser = MstUser();
          serve.TrnOrderingSurgery = TrnOrderingSurgery();
          serve.orderings = orderings();
          serve.KeyPatientsInfo = KeyPatientsInfo();
          serve.DeliverInfo = DeliverInfo();
	    },0,1);
	}
	 serve.DeckInfo = DeckInfo();
   serve.MstUser = MstUser();
   serve.TrnOrderingSurgery = TrnOrderingSurgery();
   serve.orderings = orderings();
   serve.KeyPatientsInfo = KeyPatientsInfo();
   serve.DeliverInfo = DeliverInfo(); 
	 return serve;
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