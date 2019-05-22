var circle;

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
            required: "Please enter a distance.",
            digits: "You need to enter a digit."
        }
    }   
    });


var distanceField = document.getElementById("field");
distanceField.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
      validate(e);
  }
});

function validate(e)
{
  var distance = e.target.value;

  if (isNaN(distance)) 
  {
      return false;
  } else {
      var center = [53.4746886, -2.2334728];
      var radius = distance / (2 * Math.PI);
      console.log(radius);
      var options = {steps: 10, units: 'kilometers', properties: {foo: 'bar'}};
      circle = turf.circle(center, radius, options);
      console.log(circle);
      console.log(circle.geometry.coordinates);
      
      console.log(circle.geometry.coordinates[0][1]);
  }
}
