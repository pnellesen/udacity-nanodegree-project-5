/* May not need this file - these functions moved into locationViewModel in app.js


(function ($) {// Load map when page loads. 
	console.log("Map-view JS loaded");
	function initialize() {
		console.log("Map initialized");
	    var mapOptions = {
	      center: { lat: -34.397, lng: 150.644},
	      zoom: 8
	    };
	    var map = new google.maps.Map(document.getElementById('mainMap'), mapOptions);
	    google.maps.event.addListener(map, 'click', function(event) {
	    	// Is this the right place to put handler to add the marker information to the locationMod
	    	
	    	
	    	
	    	console.log("Click: ");
	    	var marker = new google.maps.Marker({position: event.latLng, map: map});
	     });

	}
	initialize();
	
	
})(jQuery);

*/



