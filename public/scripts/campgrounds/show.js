$(document).ready(function () {

  let mapboxPublicToken = 'pk.eyJ1IjoiYWtpbGluYyIsImEiOiJja2JxcnMxM3EwYWRxMnZudGw1bzlwcW0xIn0.VJg6gJT9Jov9kBVI0qdCVg';

  mapboxgl.accessToken = mapboxPublicToken;

  let loc = JSON.parse($("#campground-location").val());

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [loc.lng, loc.lat], // starting position [lng, lat]
    zoom: 9 // starting zoom
  });

  let marker = new mapboxgl.Marker();
  marker.setLngLat(loc).addTo(map);

  $("#delete-btn").on("click", function(e){

    var result = confirm("Are you sure to delete this campground ?");

    if (!result) {
      e.preventDefault();
    }
  });

  $("#star-1").hover(function() {

    // mouse enter
    fillStarTill(1);

  }, function() {
    // mouse leave
    fillStarTill(Number($("#rating-input").val()));
  });

  $("#star-2").hover(function() {

    // mouse enter
    fillStarTill(2);

  }, function() {
    // mouse leave
    fillStarTill(Number($("#rating-input").val()));
  });

  $("#star-3").hover(function() {

    // mouse enter
    fillStarTill(3);

  }, function() {
    // mouse leave
    fillStarTill(Number($("#rating-input").val()));
  });

  $("#star-4").hover(function() {

    // mouse enter
    fillStarTill(4);

  }, function() {
    // mouse leave
    fillStarTill(Number($("#rating-input").val()));
  });

  $("#star-5").hover(function() {

    // mouse enter
    fillStarTill(5);

  }, function() {
    // mouse leave
    fillStarTill(Number($("#rating-input").val()));
  });

  $("#star-1").on("click", function(){
    
    $("#rating-input").val(1);
    fillStarTill(1);
  });

  $("#star-2").on("click", function(){

    $("#rating-input").val(2);
    fillStarTill(2);
  });

  $("#star-3").on("click", function(){

    $("#rating-input").val(3);
    fillStarTill(3);
  });

  $("#star-4").on("click", function(){

    $("#rating-input").val(4);
    fillStarTill(4);
  });

  $("#star-5").on("click", function(){

    $("#rating-input").val(5);
    fillStarTill(5);
  });

  function fillStarTill(star)
  {
    for(var i=1; i<=star; i++)
    { 
      $("#star-" + i).removeClass("far");
      $("#star-" + i).addClass("fas");
    }
    for(var k = star+1; k<=5; k++)
    {
      $("#star-" + k).removeClass("fas");
      $("#star-" + k).addClass("far");
    }
  }

  $("#add-review-btn").on("click", function()
  {
    $("#comment-form-container").slideToggle();
  });

  $("#edit-review-btn").on("click", function()
  {
    $("#comment-form-container").slideToggle();
  });
});
