var locationData = [{}];//This should hold location information for each marker, in a format compatible with Google Map API
var locationModel = function (location) { 

	
	

	/*  -- copied from CatClicker - KO for reference --
	this.name = ko.observable(catItem.name);
	this.url = ko.observable(catItem.url);
	this.levels= ko.observableArray(["Newborn","Infant","Kitten","Fullgrown"]);
	this.nicknames = ko.observableArray(catItem.nicknames);
	this.clickCount= ko.observable(catItem.clickCount);
	this.level = ko.computed(function() {
		var level;
		if (this.clickCount() < 10) {
			level = this.levels()[0];
		} else if (this.clickCount() < 15) {
			level = this.levels()[1];
		} else if (this.clickCount() < 20) {
			level = this.levels()[2];
		} else {
			level = this.levels()[3];
		}
		return level;
	}, this);
	-- end reference code -- */
}

var locationViewModel = function() {
	var self = this;
	this.locationList = ko.observableArray([]);
	locationData.forEach(function(thisLocation) {
		self.locationList.push(new locationModel(thisLocation));
	})
	//this.currentLocation = ko.observable(this.locationList()[0]);// Not sure about this, but keep for now
	
	
	/* -- copied from CatClicer - KO for reference --
	var self = this;
	this.catList = ko.observableArray([]);
	catData.forEach(function(thisCat) {
		self.catList.push(new CatModel(thisCat));
	})
	this.currentCat = ko.observable(this.catList()[0]);
	this.incrementCount = function() {
		self.currentCat().clickCount(self.currentCat().clickCount() + 1);
	};
	
	this.selectCat = function(selectedCat) {
		self.currentCat(selectedCat);
	}
	-- end reference code -- */
	
};

ko.applyBindings(new locationViewModel());

(function ($) {// Load map when page loads. 
	console.log("app.js loaded");
	
})(jQuery);


