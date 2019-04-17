//ReSTORE MODULE
//ReSTORE API by M J Livesey - alternative data store
//no need for Redux or Context API
//Copyright ©2019 M J Livesey, Polymathic Design

//GLOBALS
var Atomic = {};

//IMPLEMENTATION////////////////////////////////////////////////////////////////
//REACT CLASS METHODS

//to allow external access t any React Class including state and functions
//in constructor call:
//Atomic.nameofreactclass = () = this;
//to setState call:
//Atomic.nameofreactclass().setState({object});
//to return a state variable into local x:
//let x = Atomic.nameofreactclass().state.variablename;
//to call a React class function
//Atomic.nameofreactclass().reactclassfunction();

////////////////////////////////////////////////////////////////////////////////
//NON-REACT IMPLEMENTATION
//CUSTOM PROPERTIES
Atomic.restaurantDataStore = 0;
Atomic.infoData = [];
Atomic.googleRestaurantData = [];
Atomic.marker = [];
Atomic.map = 0;
Atomic.location = {};
Atomic.place = {};
Atomic.mapsAPIkey = "key=AIzaSyAS3g-JFzP1bv-xezck-dNFwEu1jQzKZDQ"
Atomic.autocomplete = 0;
Atomic.placeSearch = 0;
Atomic.filterLow = 0;
Atomic.filterHigh = 5;
Atomic.mapLoaded = false;

//CUSTOM METHODS
//add a map marker, always add current position as marker 0
Atomic.addMapMarker = function(lat, lng, visibility, icon){
	var newMarker,pos,icon;

	if (Atomic.marker.length === 0){icon = null};
	pos = {lat:lat,lng:lng};
	if (visibility === "block"){newMarker = new google.maps.Marker({position: pos, icon:icon, map: Atomic.map});}
	else {newMarker = new google.maps.Marker({position: pos, icon:icon, map: null});}
	Atomic.marker.push(newMarker);
}

//Remove all the map markers
Atomic.removeMapMarkers = function(){
	if (Atomic.marker.length !==0){
		Atomic.removeMarkerListeners();
		for(let i=0;i<Atomic.marker.length;i++){
			Atomic.marker[i].setMap(null);
		}
		Atomic.marker = [];
	}
}

//Add marker listeners (don't add listener for current position marker 0)
Atomic.addMarkerListeners = function(){
	if (Atomic.marker.length > 1){
		for(let i=1;i<Atomic.marker.length;i++){
			Atomic.marker[i].addListener('click', () => Atomic.markerClick(i));
		}
		Atomic.GoogleMap().setState({mouseDrop:false});
	}
}

//Remover marker listeners
Atomic.removeMarkerListeners = function(){
	if (Atomic.marker.length > 1){
		for(let i=1;i<Atomic.marker.length;i++){
			google.maps.event.clearListeners(Atomic.marker[i]);
		}
		Atomic.GoogleMap().setState({mouseDrop:false});
	}
}


//marker click function
Atomic.markerClick = function(markerNum){
	let lat,lng,markerData,url;
	Atomic.removeMarkerListeners();
	lat = Atomic.marker[markerNum].position.lat();
	lng = Atomic.marker[markerNum].position.lng();
	url = "https://maps.googleapis.com/maps/api/streetview?size=320x300&location=" + lat + "," + lng + "&fov=90&heading=235&pitch=10&" + Atomic.mapsAPIkey;
	markerData = {mNum:(markerNum-1), url:url, lat:lat, lng:lng, addRest:false}
	Atomic.map.panTo(Atomic.marker[markerNum].getPosition());
	Atomic.InfoPanel().setState({addRestFlag:false, addRestaurantText:"Restaurant Details", blockAddRest:true});
	if (markerNum > Atomic.restaurantDataStore.length){Atomic.StreetMapData().setState({reviewText:"Google Places Data", googlePlacesData:true, markerData:markerData});}
	else{Atomic.StreetMapData().setState({reviewText:"+ Review", googlePlacesData:false, controlsActive:true, markerData:markerData});}
	$("#popupAddRestaurant").hide();
	$("#popupInfo").show(1000);
}


//setup all the data and update data
Atomic.setInfoData = function(){
	if (Atomic.marker.length !== 0){
		Atomic.removeMarkerListeners();
		Atomic.removeMapMarkers();
	}
	Atomic.infoData = [];
	Atomic.addMapMarker(Atomic.location.lat,Atomic.location.lng,"block");
	for (let i=0;i<Atomic.restaurantDataStore.length;i++){
		let rName = Atomic.restaurantDataStore[i].restaurantName;
		let rAddr = Atomic.restaurantDataStore[i].address;
		let rRating = 0;
		let rReviewList = [];
		let rVisible = "block";
		let rIndex = i;
		if (Atomic.restaurantDataStore[i].rReviewList.length !== 0){
			//get reverse order of reviews, latest first, and only 5 max reviews
			Atomic.restaurantDataStore[i].rReviewList.forEach(function(v,i,a){if (i<5){rReviewList[i] = a[a.length-i-1]};});
			Atomic.restaurantDataStore[i].rReviewList.forEach(function(v,i,a){rRating += a[i].stars;});
			rRating = rRating/Atomic.restaurantDataStore[i].rReviewList.length;
			Atomic.restaurantDataStore[i].rating = rRating;
			if (rRating >= Atomic.filterLow && rRating <= Atomic.filterHigh){rVisible = "block";}else{rVisible = "none";};
		}else{
			rRating = "no reviews";
			rReviewList[0] = {comment:"no reviews", stars:"no reviews"};
			rVisible = "block";
		}
		Atomic.infoData.push({key:"review"+rIndex, restName:rName, restAddr:rAddr, restRating:rRating, restReviewList:rReviewList, display:rVisible, index:rIndex});
		Atomic.addMapMarker(Atomic.restaurantDataStore[i].lat, Atomic.restaurantDataStore[i].lng, rVisible, 'src/img/ricon_sml.png');
	}
	for (let i=0;i<Atomic.googleRestaurantData.length;i++){
		let rName = Atomic.googleRestaurantData[i].name;
		let rAddr = Atomic.googleRestaurantData[i].vicinity;
		let rRating = Atomic.googleRestaurantData[i].rating;
		let rReviewList = Atomic.googleRestaurantData[i].rReviewList;
		let rVisible = "block";
		let rIndex = i+Atomic.restaurantDataStore.length;
		if (rRating !== "no reviews" && rRating >= Atomic.filterLow && rRating <= Atomic.filterHigh){rVisible = "block";}else{rVisible = "none";};
		if (rRating === "no reviews"){rVisible = "block";}
		Atomic.infoData.push({key:"review"+rIndex, restName:rName, restAddr:rAddr, restRating:rRating, restReviewList:rReviewList, display:rVisible, index:rIndex});
		Atomic.addMapMarker(Atomic.googleRestaurantData[i].geometry.location.lat(), Atomic.googleRestaurantData[i].geometry.location.lng(), rVisible, 'src/img/ricon_sml2.png');
	}
	Atomic.addMarkerListeners();
}

//filter results
Atomic.filterRestaurants = function(filterLow,filterHigh){
	for (let i=0;i<Atomic.restaurantDataStore.length;i++){
		if (rRating >= filterLow && rRating <= filterHigh){rVisible = "block";}else{rVisible = "none";};
	}

}


//grab the google place review in callback function
Atomic.setGoogleRestarauntReviewList = function(index, place_id){
	Atomic.placeSearch.getDetails({placeId: place_id}, function(place, status){
		let rReviewList = [];
		if (status !== google.maps.places.PlacesServiceStatus.OK) {
			console.log(index + " " + place_id);
			return;
		}
		if (place.reviews === undefined){
			rReviewList[0] = {comment:"no reviews", stars:"no reviews"};
		}
		else{
			let reviewLength = place.reviews.length>5?reviewLength=5:reviewLength=place.reviews.length;
			for (let i=0;i<reviewLength;i++){
				rReviewList.push({stars:place.reviews[i].rating, comment:place.reviews[i].text});
			}
		}
		let rName = Atomic.googleRestaurantData[index].name;
		let rAddr = Atomic.googleRestaurantData[index].vicinity;
		let rRating = Atomic.googleRestaurantData[index].rating;
		let rIndex = index+Atomic.restaurantDataStore.length;
		let rVisible = "block";
		if (Atomic.googleRestaurantData[index].rating !== "no reviews"){
			if (rRating >= Atomic.filterLow && rRating <= Atomic.filterHigh){rVisible = "block";}else{rVisible = "none";};
		}
		Atomic.googleRestaurantData[index].rReviewList = rReviewList;
		Atomic.infoData[rIndex] = {key:"review"+rIndex, restName:rName, restAddr:rAddr, restRating:rRating, restReviewList:rReviewList, display:rVisible, index:rIndex};
		Atomic.InfoPanel().forceUpdate();
	});
}

//load data into Atomic data store
Atomic.loadRestaurantData = function(url){
	$.getJSON(url, function(tempData){
		Atomic.restaurantDataStore = tempData;
		Atomic.InfoPanel().setState({addRestFlag:false, addRestaurantText:"Searching", blockAddRest:true});
		Atomic.input = document.getElementById('placeInput');
		Atomic.autocomplete = new google.maps.places.Autocomplete(Atomic.input);
		Atomic.autocomplete.setTypes(['(cities)']);
		Atomic.autocomplete.bindTo('bounds', Atomic.map);
		Atomic.autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
		Atomic.autocomplete.addListener('place_changed', Atomic.onPlaceChanged);
		Atomic.placeSearch = new google.maps.places.PlacesService(Atomic.map);
	});
}

//place serach box changed
Atomic.onPlaceChanged = function(){
	Atomic.place = Atomic.autocomplete.getPlace();
	if (!Atomic.place.geometry) {
		$("#placeInput").val("");
		$("#placeInput").attr("placeholder", "Unknow place, try again.");
	}else{
		Atomic.map.panTo(Atomic.place.geometry.location);
		Atomic.map.setZoom(17);
		Atomic.location = {lat:Atomic.place.geometry.location.lat(), lng:Atomic.place.geometry.location.lng()};
		Atomic.marker[0].setPosition(Atomic.place.geometry.location);
		Atomic.search();
	}
}

//search map for Google Places - retaurants
Atomic.search = function(){
	var search,rlength;

	if (Atomic.mapLoaded === true){
		search = {bounds: Atomic.map.getBounds(), types: ['restaurant']};
		Atomic.placeSearch.nearbySearch(search, function(results, status, pagination){
			Atomic.googleRestaurantData = [];
			if (status === google.maps.places.PlacesServiceStatus.OK){
				let rReviewList = [];
				rReviewList[0] = {comment:"no reviews", stars:"no reviews"};
				rlength = results.length;
				if (rlength > 8){rlength = 8;};
				for (let i=0; i<rlength; i++) {
					let rRating = typeof(results[i].rating) === "number" ? results[i].rating : "no reviews"
					Atomic.googleRestaurantData.push({name:results[i].name, vicinity:results[i].vicinity, rating:rRating, place_id:results[i].place_id, rReviewList:rReviewList, geometry:results[i].geometry});
					Atomic.setGoogleRestarauntReviewList(i,Atomic.googleRestaurantData[i].place_id);
				}
			}
			Atomic.setInfoData();
			Atomic.InfoPanel().setState({addRestFlag:false, addRestaurantText:"+ Restaurant", blockAddRest:false});
			Atomic.marker[0].setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function(){Atomic.marker[0].setAnimation(null)},7000);
		});
	}
}

//form clearing routines
Atomic.clearAddRestarauntForm = function(){
	$("input[name=resterauntName]").val("");
	$("input[name=address1]").val("");
	$("input[name=address2]").val("");
	$("input[name=city]").val("");
	$("input[name=postcode]").val("");
}

Atomic.clearAddReviewForm = function(){
	$("textarea[name=comment]").val("Enter review...");
	$("input[name=name]").val("");
	$("input[name=email]").val("");
}
//export default Atomic
////////////////////////////////////////////////////////////////////////////////
