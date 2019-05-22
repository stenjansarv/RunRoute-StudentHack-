var circle;
var circlePoints;
var length;
var customURL;

jQuery.validator.setDefaults({
    debug: true,
    success: "valid"
    });
    $( "#myform" ).validate({
    rules: {
        field: {
            required: true,
            digits: true
        }
    },
    messages: {
        field: {
            required: "Please enter a distance in KM.",
            digits: "You need to enter a distance in KM."
        }
    }   
    });


var distanceField = document.getElementById("field");
distanceField.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
      validate(e);
  }
});

var waypointsArray;

function validate(e)
{
  var distance = e.target.value;

  if (isNaN(distance)) 
  {
      return false;
  } else {
      initMap();
      var center = [pos.lat, pos.lng];
      // var diameter = distance / Math.PI;
      // var sideLength = diameter / Math.PI;
      var min = Math.ceil(-180);
      var max = Math.floor(180);
      // var initialAngle = Math.floor(Math.random() * (max - min + 1) + min);

      // let currentPoint = turf.point(center);
      // let pointOpposite = turf.destination(currentPoint, diameter, initialAngle).geometry.coordinates;
      // let pointRight = turf.destination(currentPoint, sideLength, initialAngle + 90).geometry.coordinates;
      // let pointLeft = turf.destination(currentPoint, sideLength, initialAngle - 90).geometry.coordinates;

      // var coord1 = {lat: pointOpposite[0], lng: pointOpposite[1]};
      // var coord2 = {lat: pointRi[============================================================2-ght[0], lng: pointRight[1]};
      // var coord2 = {lat: pointRight[0], lng: pointRight[1]};
      // var coord3 = {lat: pointLeft[0], lng: pointLeft[1]};
      // console.log(pointOpposite[0]);
      // console.log(pointRight[0]);
      // console.log(pointLeft[0]);


      // waypointsArray = [
      //   coord1,
      //   coord2,
      //   coord3
      // ];
      document.getElementById('customButton').style.display = 'block';

      var radius = (distance - 0.5) / (2 * Math.PI);
      console.log(radius);
      var randomAngle = Math.floor(Math.random() * (max - min + 1) + min);
      var options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
      center = turf.destination(center, radius, randomAngle)
      circle = turf.circle(center, radius, options);
      console.log(circle);


      waypointsArray = new Array();

      for (var index = 0; index < 10; index++) {
        let currentArray = [circle.geometry.coordinates[0][index][0], circle.geometry.coordinates[0][index][1]];
        waypointsArray.push(currentArray);
      }

      waypointsArray.pop();
      waypointsArray.splice(0, 1);
      console.log(waypointsArray);
      
      calculateAndDisplayRoute(directionsService, directionsDisplay, waypointsArray);
  }
}



/*
MAP STARTS HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
*/


// Initialize and add the map
var pos;
var map;
var directionsService;
var directionsDisplay;

function initMap() {

    var manchester = {lat: 53.4808, lng: 2.2426};
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 14, 
      center: manchester,
      disableDefaultUI: true
    });

    infoWindow = new google.maps.InfoWindow;
    directionsService = new google.maps.DirectionsService;
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});

    directionsDisplay.setMap(map);

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        console.log(pos);

        infoWindow.setPosition(pos);
        infoWindow.setContent('You are here');
        infoWindow.open(map);
        map.setCenter(pos);

        }, () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
      console.log("can access currentLocation with HTML5");
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }

}


function calculateAndDisplayRoute(directionsService, directionsDisplay, waypointsArray) {
  var waypts = [];
  
  for (var i = 0; i < waypointsArray.length; i++)
  {
    waypts.push({
      location: { lat: waypointsArray[i][0], lng: waypointsArray[i][1] }
    })
  }

  directionsService.route({
    origin: pos,
    destination: pos,
    travelMode: 'WALKING',
    waypoints: waypts,
    optimizeWaypoints: true,
    provideRouteAlternatives: true,
    avoidHighways: true

  }, (res, stat) => {
    if (stat == 'OK') {
      directionsDisplay.setDirections(res);
      console.log(res);
      length = 0;
      for (var index = 0; index < 9; index++) {
        let currentLength = res.routes[0].legs[index].distance.text;
        if (currentLength.slice(-2) === ' m') {
          length += parseFloat(currentLength) / 1000;
        }
        else {
          length += parseFloat(currentLength);
        }

      }
      initCounter(length.toFixed(1));

      customURL = "https://www.google.com/maps/dir/?api=1&origin=" + pos.lat + "," + pos.lng + "&destination=" +
                      pos.lat + "," + pos.lng + "&travelmode=walking&waypoints=";
      for (let i = 0; i < waypts.length; i++) {
        customURL += "" + waypts[i].location.lat + "," + waypts[i].location.lng;
        if (i != waypts.length -1)
          customURL += "|";
      }

      console.log(customURL);


    } else {
      window.alert('Directions error ' + stat);
    }
  })
}

function redirect() {
  console.log('TESTINGIASHACS');
  console.log(customURL);
  location.href = customURL;
};


function initCounter(length) {

  document.querySelector('.counter').textContent = 0;
  $('.counter').each(function() {
    var $this = $(this),
        countTo = length;
    
    $({ countNum: $this.text()}).animate({
      countNum: countTo
    },
    {
  
      duration: 2000,
      easing:'swing',
      step: function() {
        $this.text(Math.floor(this.countNum));
      },
      complete: function() {
        $this.text(this.countNum);
      }
    });  
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Error: The Geolocation service failed.' :
                        'Error: Your browser doesn\'t support geolocation.');
  infoWindow.open(map);
}

// function newCircle(currentLocation, distance) {

//   var diameter = distance / Math.PI;
//   var sideLength = diameter / Math.PI;
//   min = Math.ceil(-180);
//   max = Math.floor(180);
//   var initialAngle = Math.floor(Math.random() * (max - min + 1) + min);

//   let currentPoint = turf.point(currentLocation);
//   let pointOpposite = turf.destination(currentPoint, diameter, initialAngle).geometry.coordinates;
//   let pointRight = turf.destination(currentPoint, sideLength, initialAngle + 90).geometry.coordinates;
//   let pointLeft = turf.destination(currentPoint, sideLength, initialAngle - 90).geometry.coordinates;

//   var coord1 = {lat: pointOpposite[0], lng: pointOpposite[1]};
//   var coord2 = {lat: pointRight[0], lng: pointRight[1]};
//   var coord3 = {lat: pointLeft[0], lng: pointLeft[1]};


// }
// }
// }
function newCircle(currentLocation, distance) {

  var diameter = distance / Math.PI;
  var sideLength = diameter / Math.PI;
  min = Math.ceil(-180);
  max = Math.floor(180);
  var initialAngle = Math.floor(Math.random() * (max - min + 1) + min);

  let currentPoint = turf.point(currentLocation);
  let pointOpposite = turf.destination(currentPoint, diameter, initialAngle).geometry.coordinates;
  let pointRight = turf.destination(currentPoint, sideLength, initialAngle + 90).geometry.coordinates;
  let pointLeft = turf.destination(currentPoint, sideLength, initialAngle - 90).geometry.coordinates;

  var coord1 = {lat: pointOpposite[0], lng: pointOpposite[1]};
  var coord2 = {lat: pointRight[0], lng: pointRight[1]};
  var coord3 = {lat: pointLeft[0], lng: pointLeft[1]};


}