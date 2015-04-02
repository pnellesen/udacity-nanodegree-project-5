(function ($) {// Load map when page loads. 
	console.log("Map-view JS loaded");

	
	
})(jQuery);

function initialize() {
	console.log("Map initialized");
    var mapOptions = {
      center: { lat: -34.397, lng: 150.644},
      zoom: 8
    };
    var map = new google.maps.Map(document.getElementById('mainMap'),
        mapOptions);
  }
  google.maps.event.addDomListener(window, 'load', initialize);

