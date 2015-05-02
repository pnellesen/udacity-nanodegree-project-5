# udacity-nanodegree-project-5
Create a neighborhood map utilizing Google Maps API, as well as additional 3rd party APIs

Includes Weather Radar maps, if available for given latitude/longitude, from the Weather Underground Weather api (http://www.wunderground.com/weather/api/)

Basic usage:

Load the page in your web browser. Select a spot on the map and a marker will appear, along with a small weather radar map and basic information about the location, including current temperature.

Other features:

- Ability to save one or more (or all) markers to local storage. Saved markers will change to become a "floppy disk" icon to indicate their saved status.
- Ability to remove one or more (or all) markers from the map/storage.
- Ability to filter current markers via simple "live search" functionality
- Any markers that have been saved to storage will be automatically loaded when page is refreshed. The map will auto-center to the first marker on the list and open the radar map window for that location. 

Installation notes:

1. You will need a Google Map API key and a Weather Underground key to run this app. Update the following fields in "js/app.js" with each:

- "this.google_key"
- "this.wu_key"

2. Note that this version utilizes the development version of the Weather Underground API, a free API which has a limit of 10 calls/minute.

3. Copy the following to your webserver:

- index.html
- js/app.js
- images/icn_save_small.png
- css/styles.css
	
	
Some useful urls for this project:

- To add a Google Map to a Bootstrap page: http://tutsme-webdesign.info/add-a-google-map-to-a-bootstrap-3-contact-page/
- To make a google Map the background of a page: http://www.thechrisoshow.com/2013/05/07/use-a-google-map-as-the-background-of-your-webpage/
- To add a marker on-click: http://stackoverflow.com/questions/8550286/how-to-get-latitude-longitude-onclick-of-a-map-in-google-maps-api-v3-javascript
- To bind select change event to function in ViewModel: http://stackoverflow.com/questions/11078016/change-event-on-select-with-knockout-binding-how-can-i-know-if-its-a-real-chang
- observable array tips (including a filter): http://www.strathweb.com/2012/07/knockout-js-pro-tips-working-with-observable-arrays/
- Simple Live Search example, using ko's "ArrayFilter" method: http://stackoverflow.com/questions/23397975/knockout-live-search
- Overview of Knockout utility functions: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html 
- To bind click events in content loaded in a Google InfoWindow http://techcrawler.riedme.de/2012/09/14/google-maps-infowindow-with-knockout/
