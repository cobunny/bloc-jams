/* Method V1:
var pointsArray = document.getElementsByClassName('point');
var animatePoints = function(points) {
                 for(var i=0; i<= points.length; i++){
                     var revealPoint = function(index) {
                         points[i].style.opacity = 1;
                         points[i].style.transform = "scaleX(1) translateY(0)";
                         points[i].style.msTransform = "scaleX(1) translateY(0)";
                         points[i].style.WebkitTransform = "scaleX(1) translateY(0)"; 
                     }
                     revealPoint();
                 }
 
             }; */


/* Method V2:
var pointsArray = document.getElementsByClassName('point');

function myCallback(element) {
    element.style.opacity = 1;
    element.style.transform = "scaleX(1) translateY(0)";
    element.style.msTransform = "scaleX(1) translateY(0)";
    element.style.WebkitTransform = "scaleX(1) translateY(0)";
}*/


$(window).load(function () {
   /* var sellingPoints = document.getElementsByClassName('selling-points')[0];
    var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;

    // Automatically animate the points on a tall screen where scrolling can't trigger the animation
    if (window.innerHeight > 950) {
        animatePoints(pointsArray);
    }

    window.addEventListener('scroll', function (event) {
        if (document.body.scrollTop >= scrollDistance) {
            animatePoints(pointsArray);
        }
    });*/
    
    if ($(window).height() > 950) {
        animatePoints();
    }
    
    var scrollDistance =$('.selling-points').offset().top - $(window).height() + 200;
    
    $(window).scroll(function(event) {
        
        if ($(window).scrollTop() >= scrollDistance) {
            animatePoints();
        }
    });
});


var animatePoints = function () {
    /*forEach(points, myCallback);*/
    //Animates points  
    var revealPoint = function() {
        $(this).css({
            'opacity': '1',
            'transform': 'scaleX(1) translateY(0)'
        });
    };
    $.each($('.point'), revealPoint);
};

/*
var animatePoints = function() {
    var points = document.getElementsByClassName('point');

    var revealFirstPoint = function() {
        points[0].style.opacity = 1;
        points[0].style.transform = "scaleX(1) translateY(0)";
        points[0].style.msTransform = "scaleX(1) translateY(0)";
        points[0].style.WebkitTransform = "scaleX(1) translateY(0)";   
    };

    var revealSecondPoint = function() {
        points[1].style.opacity = 1;
        points[1].style.transform = "scaleX(1) translateY(0)";
        points[1].style.msTransform = "scaleX(1) translateY(0)";
        points[1].style.WebkitTransform = "scaleX(1) translateY(0)";   
    };

    var revealThirdPoint = function() {
        points[2].style.opacity = 1;
        points[2].style.transform = "scaleX(1) translateY(0)";
        points[2].style.msTransform = "scaleX(1) translateY(0)";
        points[2].style.WebkitTransform = "scaleX(1) translateY(0)";   
    };

    revealFirstPoint();
    revealSecondPoint();
    revealThirdPoint();
};
*/