(function () {
  'use strict';
  angular.module('CrudApp', ["ngRoute"]).config(function ($routeProvider) {
    $routeProvider
    .when('/home', {
      templateUrl: 'static/partials//home.html',
      controller: 'LoginController'
    })
    .when('/logout', {
      templateUrl : 'static/partials/logout.html',
    })
    .otherwise({
      redirectTo: '/'
    });
  });

  angular.module('CrudApp', []).controller('LoginController', ['$scope', '$location','$log','$http',function($scope,$location,$log,$http) {
    $scope.logout=function () {
      window.location.href='static/partials/logout.html';
    };
    $scope.login = function() {
      var end_point ='/auth';
      var api_url="http://127.0.0.1:5000"+end_point
      var headers ={'Content-Type': "application/json"};
      var data ={"username":$scope.name,"password":$scope.password};
      $http({method: 'POST',
      url: api_url,
      headers: headers,
      data:data
    }).then(function successCallback(response) {
      var jsonResult = angular.fromJson(response.data);
      var access_token = jsonResult.access_token;
      var headers ={"Authorization":"JWT "+access_token}
      console.log(access_token);
      if (access_token!=undefined){
        var api_url="home"
        $http({method : "GET",
        url : api_url,
        headers: headers
      }).then(function mySuccess(response) {
        if (response.status == 200){
          var jsonResult = angular.fromJson(response.data);
          if (jsonResult.success){
            window.location='static/partials//home.html';
            console.log('request successCallback');
          }
          else{
            alert("Soory buddy Invalid username/password try again");
            console.log('Error in creds');
          }
        }
      }, function myError(response) {
        window.location.href='/';
      });
    }

  },function errorCallback(response) {
    if (response.status == 401){
      console.log('Invalid credentials');
      window.location.href='/';
      alert('Sorry buddy Invalid username/password');
      window.location.reload();

    }
    else{
      console.log('unhandled exception');
      console.log(response);
    }
  });

};}]).controller('HomeController', ['$scope', '$log','$http',function($scope, $log,$http) {

}]).controller('LogoutController', ['$scope', '$log','$http',function($scope, $log,$http) {
}]);

}());
