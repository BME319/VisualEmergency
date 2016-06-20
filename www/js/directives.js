angular.module('directives',[])
.directive("myDisplay", function(){
    return{
        restrict: "A",
        link: function(scope, element,attr){
            console.log(attr.myDisplay);
            scope.$watch(attr.myDisplay, function(){
              // if(!attr.mydisplay){
                console.log(element);
                element[0].style.display=attr.myDisplay?"inline":"none";
                // element[0].style.visibility = scope.visibilityFlag ? "visible" : "hidden";
              // }
            });
        }
    }
});