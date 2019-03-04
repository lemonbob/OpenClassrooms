//ATOMIC MODULE
// Atomic API by M J Livesey - alternative data store
// no need for Redux or Context API for small app
// Copywright ©2019 M J Livesey, Polymathic Design

//GLOBALS
var Atomic = {};


//IMPLEMENTATION////////////////////////////////////////////////////////////////
//REACT CLASS METHODS

Atomic.setReactClassUpdate = function(ReactClass){
	Atomic[ReactClass] = {};
	Atomic[ReactClass].update = function(stateObject){
		if (stateObject !== undefined){
			this.setState(stateObject);
		}
		else {this.forceUpdate();}
	}
}

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
Atomic.mapsAPIkey = "GoogleMAPAPIKEY";
Atomic.autocomplete = 0;

//CUSTOM METHODS
//add a map marker, always add current position as marker 0
Atomic.addMapMarker = function(lat, lng, visibility, icon){
	var newMarker,pos,icon;

	if (Atomic.marker.length === 0){icon = null};
	pos = {lat:lat,lng:lng};
	if (visibility === "visible"){newMarker = new google.maps.Marker({position: pos, icon:icon, map: Atomic.map});}
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
		Atomic.GoogleMap.update({mouseDrop:false});
	}
}

//Remover marker listeners
Atomic.removeMarkerListeners = function(){
	if (Atomic.marker.length > 1){
		for(let i=1;i<Atomic.marker.length;i++){
			google.maps.event.clearListeners(Atomic.marker[i]);
		}
		Atomic.GoogleMap.update({mouseDrop:false});
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
	Atomic.GoogleMap.update({markerData:markerData});
	Atomic.map.setCenter(Atomic.marker[markerNum].getPosition());
	Atomic.InfoPanel.update({addRestFlag:false, addRestaurantText:"Restaurant Details", blockAddRest:true});
	if (markerNum > Atomic.restaurantDataStore.length){Atomic.StreetMapData.update({reviewText:"Google Places Data", googlePlacesData:true});}
	else{Atomic.StreetMapData.update({reviewText:"+ Review", googlePlacesData:false});}
	$("#popupAddRestaurant").hide();
	$("#popupInfo").show(1000);
}


//setup all the data
Atomic.setInfoData = function(filterLow,filterHigh){
	if (filterLow === undefined){filterLow = 0;filterHigh = 5;}
	if (Atomic.marker.length !== 0){
		Atomic.removeMarkerListeners();
		Atomic.removeMapMarkers();
	}
	Atomic.infoData = [];
	Atomic.addMapMarker(Atomic.location.lat,Atomic.location.lng,"visible");
	for (let i=0;i<Atomic.restaurantDataStore.length;i++){
		let rName = Atomic.restaurantDataStore[i].restaurantName;
		let rAddr = Atomic.restaurantDataStore[i].address;
		let rRating = 0;
		let rReviewList = [];
		let rVisible = "visible";
		let rDisplay = "block";
		if (Atomic.restaurantDataStore[i].ratings.length !== 0){
			rReviewList = Atomic.restaurantDataStore[i].ratings;
			Atomic.restaurantDataStore[i].ratings.forEach(function(v,i,a){rRating += a[i].stars;});
			rRating = rRating/Atomic.restaurantDataStore[i].ratings.length;
			if (rRating >= filterLow && rRating <= filterHigh){rVisible = "visible";rDisplay = "block";}else{rVisible = "hidden";rDisplay = "none";};
		}else{
			rRating = "no reviews";
			rReviewList[0] = {comment:"no reviews", stars:"no reviews"};
			if (filterLow < 2){rVisible = "visible";rDisplay = "block";}else{rVisible = "hidden";rDisplay = "none";}
		}
		Atomic.infoData.push(<DataItem key={"review"+i} restName={rName} restAddr={rAddr} restRating={rRating} restReviewList={rReviewList} dataItemStyle={rDisplay} dataIndex={i}></DataItem>);
		Atomic.addMapMarker(Atomic.restaurantDataStore[i].lat, Atomic.restaurantDataStore[i].lng, rVisible, 'src/img/ricon_sml.png');
	}
	for (let i=0;i<Atomic.googleRestaurantData.length;i++){
	let rName = Atomic.googleRestaurantData[i].name;
	let rAddr = Atomic.googleRestaurantData[i].vicinity;
	let rRating = Atomic.googleRestaurantData[i].rating;
	let rReviewList = "none";
	let rVisible = "visible";
	let rDisplay = "block";
	if (rRating >= filterLow && rRating <= filterHigh){rVisible = "visible";rDisplay = "block";}else{rVisible = "hidden";rDisplay = "none";};
	Atomic.infoData.push(<DataItem key={"review"+i+Atomic.restaurantDataStore.length} restName={rName} restAddr={rAddr} restRating={rRating} restReviewList={rReviewList} dataItemStyle={rDisplay} dataIndex={i+Atomic.restaurantDataStore.length}></DataItem>);
	Atomic.addMapMarker(Atomic.googleRestaurantData[i].geometry.location.lat(), Atomic.googleRestaurantData[i].geometry.location.lng(), rVisible, 'src/img/ricon_sml2.png');
	}
	Atomic.addMarkerListeners();
}


//load data into Atomic data store
Atomic.loadRestaurantData = function(url){
	$.getJSON(url, function(tempData){
		Atomic.restaurantDataStore = tempData;
		Atomic.InfoPanel.update({addRestFlag:false, addRestaurantText:"Searching", blockAddRest:true});
		Atomic.input = document.getElementById('placeInput');
		Atomic.autocomplete = new google.maps.places.Autocomplete(Atomic.input);
		Atomic.autocomplete.setTypes(['(cities)']);
		Atomic.autocomplete.bindTo('bounds', Atomic.map);
		Atomic.autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
		Atomic.autocomplete.addListener('place_changed', Atomic.onPlaceChanged);
		Atomic.placeSearch = new google.maps.places.PlacesService(Atomic.map);
	});
	//Atomic.StreetMapData.update();
}

Atomic.onPlaceChanged = function(){
	Atomic.place = Atomic.autocomplete.getPlace();
	//Atomic.placeSearch = new google.maps.places.PlacesService(Atomic.map);
	if (!Atomic.place.geometry) {
		$("#placeInput").val("");
		$("#placeInput").attr("placeholder", "Unknow place, try again.");
	}else{
		Atomic.map.panTo(Atomic.place.geometry.location);
		//Atomic.map.setCenter(Atomic.place.geometry.location);
		Atomic.map.setZoom(17);
		Atomic.location = {lat:Atomic.place.geometry.location.lat(), lng:Atomic.place.geometry.location.lng()};
		Atomic.marker[0].setPosition(Atomic.place.geometry.location);
		Atomic.search();
	}
}

//search map for Google Places - retaurants
Atomic.search = function(){
	var search,rlength;

	search = {bounds: Atomic.map.getBounds(), types: ['restaurant']};
	Atomic.placeSearch.nearbySearch(search, function(results, status, pagination){
		if (status === google.maps.places.PlacesServiceStatus.OK){
			Atomic.googleRestaurantData = [];
			rlength = results.length;
			if (rlength>10){rlength =10;};
			for (let i=0; i<rlength; i++) {
				Atomic.googleRestaurantData.push(results[i]);
			}
		}
		Atomic.setInfoData();
		Atomic.InfoPanel.update({addRestFlag:false, addRestaurantText:"+ Restaurant", blockAddRest:false});
		Atomic.marker[0].setAnimation(google.maps.Animation.BOUNCE);
		setTimeout(function(){Atomic.marker[0].setAnimation(null)},5000);
	});
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
